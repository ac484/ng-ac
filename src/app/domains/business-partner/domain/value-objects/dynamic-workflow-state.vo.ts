import { ValueObject } from '../../../../shared/domain/base/value-object';

/**
 * 動態工作流程狀態
 */
export interface DynamicWorkflowState {
  id: string;
  name: string;
  description: string;
  isInitial: boolean;
  isFinal: boolean;
  color: string;
}

/**
 * 動態狀態轉換
 */
export interface DynamicStateTransition {
  id: string;
  from: string;
  to: string;
  condition: string;
  action: string;
}

/**
 * 工作流程執行歷史
 */
export interface WorkflowExecutionHistory {
  stateId: string;
  stateName: string;
  timestamp: Date;
  operator?: string;
  comment?: string;
  transitionId?: string;
}

/**
 * 動態工作流程狀態值物件
 * 支援動態狀態定義和轉換規則
 */
export class DynamicWorkflowStateVO extends ValueObject<{
  states: DynamicWorkflowState[];
  transitions: DynamicStateTransition[];
  currentStateId: string;
  executionHistory: WorkflowExecutionHistory[];
}> {
  constructor(props: {
    states: DynamicWorkflowState[];
    transitions: DynamicStateTransition[];
    currentStateId: string;
    executionHistory: WorkflowExecutionHistory[];
  }) {
    super(props);
  }

  static create(
    states: DynamicWorkflowState[] = [],
    transitions: DynamicStateTransition[] = [],
    currentStateId?: string
  ): DynamicWorkflowStateVO {
    // 如果沒有指定當前狀態，使用初始狀態
    const initialState = states.find(s => s.isInitial);
    const finalCurrentStateId = currentStateId || initialState?.id || '';

    const initialHistory: WorkflowExecutionHistory[] = finalCurrentStateId
      ? [
          {
            stateId: finalCurrentStateId,
            stateName: states.find(s => s.id === finalCurrentStateId)?.name || '',
            timestamp: new Date(),
            operator: 'System',
            comment: 'Initial state'
          }
        ]
      : [];

    return new DynamicWorkflowStateVO({
      states,
      transitions,
      currentStateId: finalCurrentStateId,
      executionHistory: initialHistory
    });
  }

  // Getters
  get states(): DynamicWorkflowState[] {
    return this.props.states;
  }

  get transitions(): DynamicStateTransition[] {
    return this.props.transitions;
  }

  get currentStateId(): string {
    return this.props.currentStateId;
  }

  get executionHistory(): WorkflowExecutionHistory[] {
    return this.props.executionHistory;
  }

  // 業務邏輯方法

  /**
   * 獲取當前狀態
   */
  getCurrentState(): DynamicWorkflowState | null {
    return this.states.find(s => s.id === this.currentStateId) || null;
  }

  /**
   * 獲取可用的轉換
   */
  getAvailableTransitions(): DynamicStateTransition[] {
    return this.transitions.filter(t => t.from === this.currentStateId);
  }

  /**
   * 檢查是否可以轉換到指定狀態
   */
  canTransitionTo(targetStateId: string): boolean {
    return this.getAvailableTransitions().some(t => t.to === targetStateId);
  }

  /**
   * 執行狀態轉換
   */
  transitionTo(targetStateId: string, operator?: string, comment?: string, transitionId?: string): DynamicWorkflowStateVO {
    if (!this.canTransitionTo(targetStateId)) {
      throw new Error(`Cannot transition from ${this.currentStateId} to ${targetStateId}`);
    }

    const targetState = this.states.find(s => s.id === targetStateId);
    if (!targetState) {
      throw new Error(`Target state ${targetStateId} not found`);
    }

    const newHistory: WorkflowExecutionHistory = {
      stateId: targetStateId,
      stateName: targetState.name,
      timestamp: new Date(),
      operator,
      comment,
      transitionId
    };

    return new DynamicWorkflowStateVO({
      ...this.props,
      currentStateId: targetStateId,
      executionHistory: [...this.executionHistory, newHistory]
    });
  }

  /**
   * 添加狀態
   */
  addState(state: DynamicWorkflowState): DynamicWorkflowStateVO {
    // 如果是第一個狀態，自動設為初始狀態和當前狀態
    const isFirstState = this.states.length === 0;
    const newState = isFirstState ? { ...state, isInitial: true } : state;
    const newCurrentStateId = isFirstState ? state.id : this.currentStateId;

    const newHistory = isFirstState
      ? [
          {
            stateId: state.id,
            stateName: state.name,
            timestamp: new Date(),
            operator: 'System',
            comment: 'Initial state'
          }
        ]
      : this.executionHistory;

    return new DynamicWorkflowStateVO({
      states: [...this.states, newState],
      transitions: this.transitions,
      currentStateId: newCurrentStateId,
      executionHistory: newHistory
    });
  }

  /**
   * 更新狀態
   */
  updateState(stateId: string, updates: Partial<DynamicWorkflowState>): DynamicWorkflowStateVO {
    const updatedStates = this.states.map(s => (s.id === stateId ? { ...s, ...updates } : s));

    return new DynamicWorkflowStateVO({
      ...this.props,
      states: updatedStates
    });
  }

  /**
   * 刪除狀態
   */
  removeState(stateId: string): DynamicWorkflowStateVO {
    const filteredStates = this.states.filter(s => s.id !== stateId);
    const filteredTransitions = this.transitions.filter(t => t.from !== stateId && t.to !== stateId);

    // 如果刪除的是當前狀態，重置為初始狀態
    const newCurrentStateId = this.currentStateId === stateId ? filteredStates.find(s => s.isInitial)?.id || '' : this.currentStateId;

    return new DynamicWorkflowStateVO({
      states: filteredStates,
      transitions: filteredTransitions,
      currentStateId: newCurrentStateId,
      executionHistory: this.executionHistory
    });
  }

  /**
   * 添加轉換
   */
  addTransition(transition: DynamicStateTransition): DynamicWorkflowStateVO {
    return new DynamicWorkflowStateVO({
      ...this.props,
      transitions: [...this.transitions, transition]
    });
  }

  /**
   * 刪除轉換
   */
  removeTransition(transitionId: string): DynamicWorkflowStateVO {
    return new DynamicWorkflowStateVO({
      ...this.props,
      transitions: this.transitions.filter(t => t.id !== transitionId)
    });
  }

  /**
   * 設置初始狀態
   */
  setInitialState(stateId: string): DynamicWorkflowStateVO {
    const updatedStates = this.states.map(s => ({
      ...s,
      isInitial: s.id === stateId
    }));

    return new DynamicWorkflowStateVO({
      ...this.props,
      states: updatedStates,
      currentStateId: stateId
    });
  }

  /**
   * 檢查是否為終結狀態
   */
  isFinalState(): boolean {
    const currentState = this.getCurrentState();
    return currentState?.isFinal || false;
  }

  /**
   * 獲取狀態名稱
   */
  getStateName(stateId: string): string {
    const state = this.states.find(s => s.id === stateId);
    return state ? state.name : '未知狀態';
  }

  /**
   * 獲取狀態顏色
   */
  getStateColor(stateId?: string): string {
    const targetStateId = stateId || this.currentStateId;
    const state = this.states.find(s => s.id === targetStateId);
    return state ? state.color : '#f0f0f0';
  }

  /**
   * 序列化為普通物件
   */
  toPlainObject(): any {
    return {
      states: this.states,
      transitions: this.transitions,
      currentStateId: this.currentStateId,
      executionHistory: this.executionHistory.map(h => ({
        ...h,
        timestamp: h.timestamp.toISOString()
      }))
    };
  }

  /**
   * 從普通物件反序列化
   */
  static fromPlainObject(data: any): DynamicWorkflowStateVO {
    const executionHistory =
      data.executionHistory?.map((h: any) => ({
        ...h,
        timestamp: new Date(h.timestamp)
      })) || [];

    return new DynamicWorkflowStateVO({
      states: data.states || [],
      transitions: data.transitions || [],
      currentStateId: data.currentStateId || '',
      executionHistory
    });
  }
}
