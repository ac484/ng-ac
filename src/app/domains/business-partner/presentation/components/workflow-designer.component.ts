import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

export interface WorkflowState {
    id: string;
    name: string;
    description: string;
    isInitial: boolean;
    isFinal: boolean;
    color: string;
}

export interface StateTransition {
    id: string;
    from: string;
    to: string;
    condition: string;
    action: string;
}

/**
 * 工作流程狀態機設計器
 * 極簡設計，使用 ng-zorro-antd 組件
 */
@Component({
    selector: 'app-workflow-designer',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzButtonModule,
        NzInputModule,
        NzSelectModule,
        NzCardModule,
        NzTagModule,
        NzIconModule,
        NzFormModule,
        NzDividerModule,
        NzPopconfirmModule,
        NzEmptyModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="workflow-designer-container">
      <nz-card nzTitle="工作流程狀態機設計器" class="header-card">
        <p>建立您自己的工作流程狀態機</p>
      </nz-card>

      <div class="designer-grid">
        <!-- 左側：狀態設計 -->
        <div class="left-panel">
          <!-- 添加/編輯狀態 -->
          <nz-card [nzTitle]="editingState() ? '編輯狀態' : '新增狀態'" class="state-form-card">
            <form nz-form nzLayout="vertical">
              <nz-form-item>
                <nz-form-label nzRequired>狀態名稱</nz-form-label>
                <nz-form-control>
                  <input 
                    nz-input 
                    [(ngModel)]="newStateName"
                    placeholder="例：草稿、已提交、審核中..."
                  />
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-label>狀態說明</nz-form-label>
                <nz-form-control>
                  <textarea 
                    nz-input 
                    [(ngModel)]="newStateDescription"
                    rows="2"
                    placeholder="說明此狀態的用途..."
                  ></textarea>
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-control>
                  @if (editingState(); as state) {
                    <button 
                      nz-button 
                      nzType="primary" 
                      (click)="updateState()"
                      class="update-btn">
                      <span nz-icon nzType="save"></span>
                      更新
                    </button>
                    <button 
                      nz-button 
                      nzType="default" 
                      (click)="cancelEdit()"
                      class="cancel-btn">
                      取消
                    </button>
                  } @else {
                    <button 
                      nz-button 
                      nzType="primary" 
                      (click)="addState()"
                      [disabled]="!newStateName.trim()">
                      <span nz-icon nzType="plus"></span>
                      新增狀態
                    </button>
                  }
                </nz-form-control>
              </nz-form-item>
            </form>
          </nz-card>

          <!-- 狀態列表 -->
          <nz-card nzTitle="狀態列表" class="state-list-card">
            <div class="state-list">
              @for (state of states(); track state.id) {
                <div 
                  class="state-item"
                  [class.current-state]="currentWorkflowState() === state.id"
                  [style.background-color]="state.color">
                  <div class="state-content">
                    <div class="state-header">
                      <h4>{{ state.name }}</h4>
                      <div class="state-badges">
                        @if (state.isInitial) {
                          <nz-tag nzColor="green">初始</nz-tag>
                        }
                        @if (state.isFinal) {
                          <nz-tag nzColor="red">結束</nz-tag>
                        }
                        @if (currentWorkflowState() === state.id) {
                          <nz-tag nzColor="blue">當前</nz-tag>
                        }
                      </div>
                    </div>
                    @if (state.description) {
                      <p class="state-description">{{ state.description }}</p>
                    }
                  </div>
                  <div class="state-actions">
                    <button 
                      nz-button 
                      nzType="text" 
                      nzSize="small"
                      (click)="setAsInitialState(state.id)"
                      title="設為初始狀態">
                      <span nz-icon nzType="play-circle"></span>
                    </button>
                    <button 
                      nz-button 
                      nzType="text" 
                      nzSize="small"
                      (click)="toggleFinalState(state.id)"
                      title="切換終止狀態">
                      <span nz-icon nzType="stop"></span>
                    </button>
                    <button 
                      nz-button 
                      nzType="text" 
                      nzSize="small"
                      (click)="editState(state)"
                      title="編輯">
                      <span nz-icon nzType="edit"></span>
                    </button>
                    <button 
                      nz-button 
                      nzType="text" 
                      nzSize="small" 
                      nzDanger
                      nz-popconfirm
                      nzPopconfirmTitle="確定要刪除此狀態嗎？"
                      (nzOnConfirm)="deleteState(state.id)"
                      title="刪除">
                      <span nz-icon nzType="delete"></span>
                    </button>
                  </div>
                </div>
              } @empty {
                <nz-empty nzNotFoundContent="尚未新增任何狀態"></nz-empty>
              }
            </div>
          </nz-card>

          <!-- 新增轉換 -->
          <nz-card nzTitle="新增狀態轉換" class="transition-form-card">
            <form nz-form nzLayout="vertical">
              <div nz-row [nzGutter]="16">
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label>從狀態</nz-form-label>
                    <nz-form-control>
                      <nz-select 
                        [(ngModel)]="selectedFromState"
                        nzPlaceHolder="選擇狀態">
                        @for (state of states(); track state.id) {
                          <nz-option [nzLabel]="state.name" [nzValue]="state.id"></nz-option>
                        }
                      </nz-select>
                    </nz-form-control>
                  </nz-form-item>
                </div>
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label>到狀態</nz-form-label>
                    <nz-form-control>
                      <nz-select 
                        [(ngModel)]="selectedToState"
                        nzPlaceHolder="選擇狀態">
                        @for (state of availableToStates(); track state.id) {
                          <nz-option [nzLabel]="state.name" [nzValue]="state.id"></nz-option>
                        }
                      </nz-select>
                    </nz-form-control>
                  </nz-form-item>
                </div>
              </div>

              <nz-form-item>
                <nz-form-label>轉換條件 / 動作</nz-form-label>
                <nz-form-control>
                  <input 
                    nz-input 
                    [(ngModel)]="transitionCondition"
                    placeholder="例：提交、審核通過、退回..."
                  />
                </nz-form-control>
              </nz-form-item>

              <nz-form-item>
                <nz-form-control>
                  <button 
                    nz-button 
                    nzType="primary" 
                    nzBlock
                    (click)="addTransition()"
                    [disabled]="!selectedFromState || !selectedToState || !transitionCondition.trim()">
                    <span nz-icon nzType="arrow-right"></span>
                    新增轉換
                  </button>
                </nz-form-control>
              </nz-form-item>
            </form>
          </nz-card>
        </div>

        <!-- 右側：流程預覽和執行 -->
        <div class="right-panel">
          <!-- 轉換列表 -->
          <nz-card nzTitle="狀態轉換規則" class="transition-list-card">
            <div class="transition-list">
              @for (transition of transitions(); track transition.id) {
                <div class="transition-item">
                  <div class="transition-content">
                    <span class="from-state">{{ getStateName(transition.from) }}</span>
                    <span nz-icon nzType="arrow-right" class="arrow"></span>
                    <span class="to-state">{{ getStateName(transition.to) }}</span>
                    <span class="condition">({{ transition.condition }})</span>
                  </div>
                  <button 
                    nz-button 
                    nzType="text" 
                    nzSize="small" 
                    nzDanger
                    nz-popconfirm
                    nzPopconfirmTitle="確定要刪除此轉換嗎？"
                    (nzOnConfirm)="deleteTransition(transition.id)">
                    <span nz-icon nzType="delete"></span>
                  </button>
                </div>
              } @empty {
                <nz-empty nzNotFoundContent="尚未設定任何轉換規則"></nz-empty>
              }
            </div>
          </nz-card>

          <!-- 流程執行 -->
          <nz-card nzTitle="流程執行模擬" class="execution-card">
            @if (currentWorkflowState(); as currentState) {
              <div class="current-state-display">
                <nz-tag nzColor="blue" class="current-state-tag">
                  當前狀態：{{ getCurrentStateName() }}
                </nz-tag>
                @if (getCurrentStateDescription()) {
                  <p class="current-state-desc">{{ getCurrentStateDescription() }}</p>
                }
              </div>

              <nz-divider></nz-divider>

              <div class="available-actions">
                <h4>可執行的操作：</h4>
                @for (transition of availableTransitions(); track transition.id) {
                  <button 
                    nz-button 
                    nzType="default" 
                    nzBlock
                    (click)="executeTransition(transition.id)"
                    class="action-button">
                    <div class="action-content">
                      <div class="action-name">{{ transition.condition }}</div>
                      <div class="action-target">→ {{ getStateName(transition.to) }}</div>
                    </div>
                  </button>
                } @empty {
                  <nz-empty nzNotFoundContent="此狀態無可執行的轉換操作"></nz-empty>
                }
              </div>
            } @else {
              <nz-empty nzNotFoundContent="請先新增狀態並設定初始狀態"></nz-empty>
            }
          </nz-card>

          <!-- 流程圖視覺化 -->
          <nz-card nzTitle="流程圖預覽" class="preview-card">
            <div class="workflow-preview">
              @if (states().length > 0) {
                <div class="states-preview">
                  @for (state of states(); track state.id) {
                    <div 
                      class="preview-state"
                      [class.current-preview-state]="currentWorkflowState() === state.id"
                      [style.background-color]="state.color">
                      <div class="preview-state-name">{{ state.name }}</div>
                      @if (state.isInitial) {
                        <div class="initial-indicator"></div>
                      }
                      @if (state.isFinal) {
                        <div class="final-indicator"></div>
                      }
                    </div>
                  }
                </div>
              } @else {
                <nz-empty nzNotFoundContent="新增狀態後，此處會顯示流程圖"></nz-empty>
              }
            </div>
          </nz-card>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .workflow-designer-container {
      padding: 24px;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .header-card {
      margin-bottom: 24px;
    }

    .designer-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .left-panel, .right-panel {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .state-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .state-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px;
      margin-bottom: 8px;
      border-radius: 8px;
      border: 2px solid #e8e8e8;
      transition: all 0.2s;
    }

    .state-item.current-state {
      border-color: #1890ff;
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
    }

    .state-content {
      flex: 1;
    }

    .state-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .state-header h4 {
      margin: 0;
      font-weight: 600;
    }

    .state-badges {
      display: flex;
      gap: 4px;
    }

    .state-description {
      margin: 0;
      font-size: 12px;
      color: #666;
    }

    .state-actions {
      display: flex;
      gap: 4px;
    }

    .update-btn {
      margin-right: 8px;
    }

    .transition-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .transition-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      margin-bottom: 8px;
      background: #fafafa;
      border-radius: 6px;
    }

    .transition-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .from-state, .to-state {
      font-weight: 600;
    }

    .arrow {
      color: #1890ff;
    }

    .condition {
      font-size: 12px;
      color: #666;
    }

    .current-state-display {
      margin-bottom: 16px;
    }

    .current-state-tag {
      font-size: 14px;
      padding: 4px 12px;
    }

    .current-state-desc {
      margin: 8px 0 0 0;
      font-size: 12px;
      color: #666;
    }

    .available-actions h4 {
      margin-bottom: 12px;
      font-weight: 600;
    }

    .action-button {
      margin-bottom: 8px;
      height: auto;
      padding: 12px;
    }

    .action-content {
      text-align: left;
    }

    .action-name {
      font-weight: 600;
    }

    .action-target {
      font-size: 12px;
      color: #666;
    }

    .workflow-preview {
      min-height: 300px;
      background: #fafafa;
      border-radius: 8px;
      padding: 16px;
    }

    .states-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
      align-items: flex-start;
    }

    .preview-state {
      position: relative;
      padding: 12px;
      border-radius: 8px;
      border: 2px solid #e8e8e8;
      text-align: center;
      min-width: 120px;
      transition: all 0.2s;
    }

    .preview-state.current-preview-state {
      border-color: #1890ff;
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
    }

    .preview-state-name {
      font-weight: 600;
      font-size: 14px;
    }

    .initial-indicator {
      position: absolute;
      top: -8px;
      left: -8px;
      width: 16px;
      height: 16px;
      background: #52c41a;
      border-radius: 50%;
    }

    .final-indicator {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 16px;
      height: 16px;
      background: #ff4d4f;
      border-radius: 50%;
    }

    @media (max-width: 1200px) {
      .designer-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WorkflowDesignerComponent {
    private readonly message = inject(NzMessageService);

    // Signals 狀態管理
    private readonly statesSignal = signal<WorkflowState[]>([]);
    private readonly transitionsSignal = signal<StateTransition[]>([]);
    private readonly editingStateSignal = signal<WorkflowState | null>(null);
    private readonly currentWorkflowStateSignal = signal<string>('');

    // 表單狀態
    newStateName = '';
    newStateDescription = '';
    selectedFromState = '';
    selectedToState = '';
    transitionCondition = '';

    // Computed
    readonly states = this.statesSignal.asReadonly();
    readonly transitions = this.transitionsSignal.asReadonly();
    readonly editingState = this.editingStateSignal.asReadonly();
    readonly currentWorkflowState = this.currentWorkflowStateSignal.asReadonly();

    readonly availableToStates = computed(() => {
        return this.states().filter(s => s.id !== this.selectedFromState);
    });

    readonly availableTransitions = computed(() => {
        return this.transitions().filter(t => t.from === this.currentWorkflowState());
    });

    // 添加新狀態
    addState(): void {
        if (this.newStateName.trim()) {
            const newState: WorkflowState = {
                id: Date.now().toString(),
                name: this.newStateName.trim(),
                description: this.newStateDescription.trim(),
                isInitial: this.states().length === 0,
                isFinal: false,
                color: `hsl(${Math.random() * 360}, 70%, 85%)`
            };

            this.statesSignal.update(states => [...states, newState]);
            this.newStateName = '';
            this.newStateDescription = '';

            // 如果是第一個狀態，設為當前狀態
            if (this.states().length === 1) {
                this.currentWorkflowStateSignal.set(newState.id);
            }

            this.message.success('狀態新增成功');
        }
    }

    // 編輯狀態
    editState(state: WorkflowState): void {
        this.editingStateSignal.set(state);
        this.newStateName = state.name;
        this.newStateDescription = state.description;
    }

    // 更新狀態
    updateState(): void {
        const editingState = this.editingState();
        if (editingState && this.newStateName.trim()) {
            this.statesSignal.update(states =>
                states.map(s =>
                    s.id === editingState.id
                        ? {
                            ...s,
                            name: this.newStateName.trim(),
                            description: this.newStateDescription.trim()
                        }
                        : s
                )
            );
            this.cancelEdit();
            this.message.success('狀態更新成功');
        }
    }

    // 取消編輯
    cancelEdit(): void {
        this.editingStateSignal.set(null);
        this.newStateName = '';
        this.newStateDescription = '';
    }

    // 刪除狀態
    deleteState(stateId: string): void {
        this.statesSignal.update(states => states.filter(s => s.id !== stateId));
        this.transitionsSignal.update(transitions =>
            transitions.filter(t => t.from !== stateId && t.to !== stateId)
        );

        if (this.currentWorkflowState() === stateId) {
            this.currentWorkflowStateSignal.set('');
        }

        this.message.success('狀態刪除成功');
    }

    // 添加轉換
    addTransition(): void {
        if (this.selectedFromState && this.selectedToState && this.transitionCondition.trim()) {
            const newTransition: StateTransition = {
                id: Date.now().toString(),
                from: this.selectedFromState,
                to: this.selectedToState,
                condition: this.transitionCondition.trim(),
                action: ''
            };

            this.transitionsSignal.update(transitions => [...transitions, newTransition]);
            this.selectedFromState = '';
            this.selectedToState = '';
            this.transitionCondition = '';

            this.message.success('轉換規則新增成功');
        }
    }

    // 刪除轉換
    deleteTransition(transitionId: string): void {
        this.transitionsSignal.update(transitions =>
            transitions.filter(t => t.id !== transitionId)
        );
        this.message.success('轉換規則刪除成功');
    }

    // 執行狀態轉換
    executeTransition(transitionId: string): void {
        const transition = this.transitions().find(t => t.id === transitionId);
        if (transition) {
            this.currentWorkflowStateSignal.set(transition.to);
            this.message.success(`狀態已轉換至：${this.getStateName(transition.to)}`);
        }
    }

    // 設置為初始狀態
    setAsInitialState(stateId: string): void {
        this.statesSignal.update(states =>
            states.map(s => ({
                ...s,
                isInitial: s.id === stateId
            }))
        );
        this.currentWorkflowStateSignal.set(stateId);
        this.message.success('初始狀態設定成功');
    }

    // 切換終止狀態
    toggleFinalState(stateId: string): void {
        this.statesSignal.update(states =>
            states.map(s =>
                s.id === stateId
                    ? { ...s, isFinal: !s.isFinal }
                    : s
            )
        );
        this.message.success('終止狀態設定已更新');
    }

    // 獲取狀態名稱
    getStateName(stateId: string): string {
        const state = this.states().find(s => s.id === stateId);
        return state ? state.name : '未知狀態';
    }

    // 獲取當前狀態名稱
    getCurrentStateName(): string {
        const state = this.states().find(s => s.id === this.currentWorkflowState());
        return state ? state.name : '';
    }

    // 獲取當前狀態描述
    getCurrentStateDescription(): string {
        const state = this.states().find(s => s.id === this.currentWorkflowState());
        return state ? state.description : '';
    }
}