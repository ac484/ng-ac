import { ValueObject } from '../../../../shared/domain/base/value-object';

/**
 * 請款工作流程狀態枚舉
 */
export enum PaymentWorkflowStateEnum {
  Draft = 'Draft', // 草稿
  Submitted = 'Submitted', // 已提交
  Reviewing = 'Reviewing', // 審核中
  Approved = 'Approved', // 已核准
  Rejected = 'Rejected', // 已拒絕
  Processing = 'Processing', // 處理中
  Completed = 'Completed', // 已完成
  Cancelled = 'Cancelled' // 已取消
}

/**
 * 請款工作流程狀態值物件
 */
export class PaymentWorkflowState extends ValueObject<{
  currentState: PaymentWorkflowStateEnum;
  availableTransitions: PaymentWorkflowStateEnum[];
  stateHistory: Array<{
    state: PaymentWorkflowStateEnum;
    timestamp: Date;
    operator?: string;
    comment?: string;
  }>;
}> {
  constructor(props: {
    currentState: PaymentWorkflowStateEnum;
    availableTransitions: PaymentWorkflowStateEnum[];
    stateHistory: Array<{
      state: PaymentWorkflowStateEnum;
      timestamp: Date;
      operator?: string;
      comment?: string;
    }>;
  }) {
    super(props);
  }

  static create(
    currentState: PaymentWorkflowStateEnum = PaymentWorkflowStateEnum.Draft,
    stateHistory: Array<{
      state: PaymentWorkflowStateEnum;
      timestamp: Date;
      operator?: string;
      comment?: string;
    }> = []
  ): PaymentWorkflowState {
    const availableTransitions = this.getAvailableTransitions(currentState);

    const props = {
      currentState,
      availableTransitions,
      stateHistory:
        stateHistory.length > 0
          ? stateHistory
          : [
              {
                state: currentState,
                timestamp: new Date(),
                operator: 'System',
                comment: 'Initial state'
              }
            ]
    };

    return new PaymentWorkflowState(props);
  }

  get currentState(): PaymentWorkflowStateEnum {
    return this.props.currentState;
  }

  get availableTransitions(): PaymentWorkflowStateEnum[] {
    return this.props.availableTransitions;
  }

  get stateHistory(): Array<{
    state: PaymentWorkflowStateEnum;
    timestamp: Date;
    operator?: string;
    comment?: string;
  }> {
    return this.props.stateHistory;
  }

  /**
   * 轉換到新狀態
   */
  transitionTo(newState: PaymentWorkflowStateEnum, operator?: string, comment?: string): PaymentWorkflowState {
    if (!this.canTransitionTo(newState)) {
      throw new Error(`Cannot transition from ${this.currentState} to ${newState}`);
    }

    const newHistory = [
      ...this.stateHistory,
      {
        state: newState,
        timestamp: new Date(),
        operator,
        comment
      }
    ];

    return PaymentWorkflowState.create(newState, newHistory);
  }

  /**
   * 檢查是否可以轉換到指定狀態
   */
  canTransitionTo(targetState: PaymentWorkflowStateEnum): boolean {
    return this.availableTransitions.includes(targetState);
  }

  /**
   * 獲取狀態的中文顯示名稱
   */
  getStateDisplayName(state?: PaymentWorkflowStateEnum): string {
    const targetState = state || this.currentState;
    const stateNames: Record<PaymentWorkflowStateEnum, string> = {
      [PaymentWorkflowStateEnum.Draft]: '草稿',
      [PaymentWorkflowStateEnum.Submitted]: '已提交',
      [PaymentWorkflowStateEnum.Reviewing]: '審核中',
      [PaymentWorkflowStateEnum.Approved]: '已核准',
      [PaymentWorkflowStateEnum.Rejected]: '已拒絕',
      [PaymentWorkflowStateEnum.Processing]: '處理中',
      [PaymentWorkflowStateEnum.Completed]: '已完成',
      [PaymentWorkflowStateEnum.Cancelled]: '已取消'
    };
    return stateNames[targetState];
  }

  /**
   * 獲取狀態顏色
   */
  getStateColor(state?: PaymentWorkflowStateEnum): string {
    const targetState = state || this.currentState;
    const stateColors: Record<PaymentWorkflowStateEnum, string> = {
      [PaymentWorkflowStateEnum.Draft]: 'default',
      [PaymentWorkflowStateEnum.Submitted]: 'blue',
      [PaymentWorkflowStateEnum.Reviewing]: 'orange',
      [PaymentWorkflowStateEnum.Approved]: 'green',
      [PaymentWorkflowStateEnum.Rejected]: 'red',
      [PaymentWorkflowStateEnum.Processing]: 'purple',
      [PaymentWorkflowStateEnum.Completed]: 'green',
      [PaymentWorkflowStateEnum.Cancelled]: 'red'
    };
    return stateColors[targetState];
  }

  /**
   * 根據當前狀態獲取可用的轉換
   */
  private static getAvailableTransitions(currentState: PaymentWorkflowStateEnum): PaymentWorkflowStateEnum[] {
    const transitions: Record<PaymentWorkflowStateEnum, PaymentWorkflowStateEnum[]> = {
      [PaymentWorkflowStateEnum.Draft]: [PaymentWorkflowStateEnum.Submitted, PaymentWorkflowStateEnum.Cancelled],
      [PaymentWorkflowStateEnum.Submitted]: [PaymentWorkflowStateEnum.Reviewing, PaymentWorkflowStateEnum.Cancelled],
      [PaymentWorkflowStateEnum.Reviewing]: [PaymentWorkflowStateEnum.Approved, PaymentWorkflowStateEnum.Rejected],
      [PaymentWorkflowStateEnum.Approved]: [PaymentWorkflowStateEnum.Processing],
      [PaymentWorkflowStateEnum.Rejected]: [PaymentWorkflowStateEnum.Draft],
      [PaymentWorkflowStateEnum.Processing]: [PaymentWorkflowStateEnum.Completed],
      [PaymentWorkflowStateEnum.Completed]: [],
      [PaymentWorkflowStateEnum.Cancelled]: []
    };

    return transitions[currentState] || [];
  }

  /**
   * 檢查是否為終結狀態
   */
  isFinalState(): boolean {
    return [PaymentWorkflowStateEnum.Completed, PaymentWorkflowStateEnum.Cancelled].includes(this.currentState);
  }
}
