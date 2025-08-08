import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

import { PaymentWorkflowState, PaymentWorkflowStateEnum } from '../../domain/value-objects/payment-workflow-state.vo';

export interface PaymentWorkflowTransition {
  companyId: string;
  newState: PaymentWorkflowStateEnum;
  operator?: string;
  comment?: string;
}

/**
 * 請款工作流程狀態機組件
 * 極簡設計，使用 ng-zorro-antd 組件
 */
@Component({
  selector: 'app-payment-workflow',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzButtonModule,
    NzTagModule,
    NzStepsModule,
    NzTimelineModule,
    NzInputModule,
    NzSelectModule,
    NzFormModule,
    NzIconModule,
    NzDividerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-modal [(nzVisible)]="visible" nzTitle="請款工作流程狀態" nzWidth="700px" [nzFooter]="null" (nzOnCancel)="onCancel()">
      <ng-container *nzModalContent>
        <div class="workflow-container">
          <!-- 當前狀態顯示 -->
          <div class="current-state-section">
            <h4>當前狀態</h4>
            <div class="current-state">
              <nz-tag [nzColor]="workflowState?.getStateColor() || 'default'" class="state-tag">
                <span nz-icon [nzType]="getStateIcon()"></span>
                {{ workflowState?.getStateDisplayName() || 'Unknown' }}
              </nz-tag>
            </div>
          </div>

          <nz-divider></nz-divider>

          <!-- 可用轉換 -->
          <div class="transitions-section" *ngIf="workflowState && !workflowState.isFinalState()">
            <h4>可執行操作</h4>
            <div class="transition-options">
              <div
                *ngFor="let transition of workflowState.availableTransitions"
                class="transition-option"
                [class.selected]="selectedTransition() === transition"
                (click)="selectTransition(transition)"
              >
                <nz-tag [nzColor]="workflowState.getStateColor(transition)">
                  {{ workflowState.getStateDisplayName(transition) }}
                </nz-tag>
              </div>
            </div>

            <!-- 轉換表單 -->
            <div class="transition-form" *ngIf="selectedTransition()">
              <form nz-form nzLayout="vertical">
                <nz-form-item>
                  <nz-form-label>操作人員</nz-form-label>
                  <nz-form-control>
                    <input nz-input [(ngModel)]="transitionOperator" placeholder="請輸入操作人員姓名" />
                  </nz-form-control>
                </nz-form-item>

                <nz-form-item>
                  <nz-form-label>備註</nz-form-label>
                  <nz-form-control>
                    <textarea nz-input [(ngModel)]="transitionComment" placeholder="請輸入操作備註（選填）" rows="3"> </textarea>
                  </nz-form-control>
                </nz-form-item>

                <nz-form-item>
                  <nz-form-control>
                    <button nz-button nzType="primary" [nzLoading]="isSubmitting()" (click)="executeTransition()"> 執行狀態轉換 </button>
                    <button nz-button nzType="default" class="ml-2" (click)="cancelTransition()"> 取消 </button>
                  </nz-form-control>
                </nz-form-item>
              </form>
            </div>
          </div>

          <!-- 終結狀態提示 -->
          <div class="final-state-notice" *ngIf="workflowState?.isFinalState()">
            <nz-tag nzColor="blue">
              <span nz-icon nzType="info-circle"></span>
              此狀態為終結狀態，無法進行進一步操作
            </nz-tag>
          </div>

          <nz-divider></nz-divider>

          <!-- 狀態歷史 -->
          <div class="history-section">
            <h4>狀態歷史</h4>
            <nz-timeline>
              <nz-timeline-item
                *ngFor="let history of workflowState?.stateHistory; let i = index"
                [nzColor]="workflowState?.getStateColor(history.state) || 'default'"
              >
                <div class="history-item">
                  <div class="history-header">
                    <nz-tag [nzColor]="workflowState?.getStateColor(history.state) || 'default'">
                      {{ workflowState?.getStateDisplayName(history.state) || history.state }}
                    </nz-tag>
                    <span class="history-time">
                      {{ history.timestamp | date: 'yyyy-MM-dd HH:mm:ss' }}
                    </span>
                  </div>
                  <div class="history-details" *ngIf="history.operator || history.comment">
                    <div *ngIf="history.operator" class="history-operator"> 操作人員: {{ history.operator }} </div>
                    <div *ngIf="history.comment" class="history-comment"> 備註: {{ history.comment }} </div>
                  </div>
                </div>
              </nz-timeline-item>
            </nz-timeline>
          </div>
        </div>
      </ng-container>
    </nz-modal>
  `,
  styles: [
    `
      .workflow-container {
        padding: 16px 0;
      }

      .current-state-section h4,
      .transitions-section h4,
      .history-section h4 {
        margin: 0 0 16px 0;
        font-weight: 600;
        color: #262626;
      }

      .current-state {
        display: flex;
        align-items: center;
      }

      .state-tag {
        font-size: 14px;
        padding: 4px 12px;
        border-radius: 6px;
      }

      .state-tag .anticon {
        margin-right: 6px;
      }

      .transition-options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
      }

      .transition-option {
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .transition-option:hover {
      }

      .transition-option.selected {
        border: 1px solid #1890ff;
      }

      .transition-form {
        padding: 16px;
        border-radius: 6px;
        margin-top: 16px;
      }

      .final-state-notice {
        text-align: center;
        padding: 16px;
        border-radius: 6px;
      }

      .history-item {
        margin-bottom: 8px;
      }

      .history-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
      }

      .history-time {
        font-size: 12px;
        color: #8c8c8c;
      }

      .history-details {
        font-size: 12px;
        color: #595959;
        margin-left: 8px;
      }

      .history-operator {
        margin-bottom: 2px;
      }

      .history-comment {
        font-style: italic;
      }

      .ml-2 {
        margin-left: 8px;
      }

      ::ng-deep .ant-timeline-item-content {
        margin-left: 20px;
      }
    `
  ]
})
export class PaymentWorkflowComponent {
  @Input() companyId!: string;
  @Input() workflowState: PaymentWorkflowState | null = null;
  @Input() visible = false;

  @Output() readonly visibleChange = new EventEmitter<boolean>();
  @Output() readonly stateTransition = new EventEmitter<PaymentWorkflowTransition>();

  // 組件狀態
  private readonly selectedTransitionSignal = signal<PaymentWorkflowStateEnum | null>(null);
  private readonly isSubmittingSignal = signal(false);

  private readonly message = inject(NzMessageService);

  transitionOperator = '';
  transitionComment = '';

  constructor() {}

  // Computed
  readonly selectedTransition = this.selectedTransitionSignal.asReadonly();
  readonly isSubmitting = this.isSubmittingSignal.asReadonly();

  /**
   * 選擇轉換狀態
   */
  selectTransition(transition: PaymentWorkflowStateEnum): void {
    this.selectedTransitionSignal.set(transition);
    this.transitionOperator = '';
    this.transitionComment = '';
  }

  /**
   * 取消轉換
   */
  cancelTransition(): void {
    this.selectedTransitionSignal.set(null);
    this.transitionOperator = '';
    this.transitionComment = '';
  }

  /**
   * 執行狀態轉換
   */
  executeTransition(): void {
    const selectedState = this.selectedTransition();
    if (!selectedState || !this.workflowState) return;

    if (!this.transitionOperator.trim()) {
      this.message.error('請輸入操作人員');
      return;
    }

    // 檢查是否可以轉換到目標狀態
    if (!this.workflowState.canTransitionTo(selectedState)) {
      this.message.error('無法轉換到此狀態');
      return;
    }

    this.isSubmittingSignal.set(true);

    try {
      // 模擬 API 調用
      setTimeout(() => {
        this.stateTransition.emit({
          companyId: this.companyId,
          newState: selectedState,
          operator: this.transitionOperator.trim(),
          comment: this.transitionComment.trim() || undefined
        });

        this.message.success('狀態轉換成功');
        this.cancelTransition();
        this.onCancel();
        this.isSubmittingSignal.set(false);
      }, 1000);
    } catch (error) {
      console.error('狀態轉換失敗:', error);
      this.message.error('狀態轉換失敗');
      this.isSubmittingSignal.set(false);
    }
  }

  /**
   * 關閉模態框
   */
  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancelTransition();
  }

  /**
   * 獲取狀態圖標
   */
  getStateIcon(): string {
    if (!this.workflowState) return 'question';

    const stateIcons: Record<PaymentWorkflowStateEnum, string> = {
      [PaymentWorkflowStateEnum.Draft]: 'edit',
      [PaymentWorkflowStateEnum.Submitted]: 'upload',
      [PaymentWorkflowStateEnum.Reviewing]: 'eye',
      [PaymentWorkflowStateEnum.Approved]: 'check-circle',
      [PaymentWorkflowStateEnum.Rejected]: 'close-circle',
      [PaymentWorkflowStateEnum.Processing]: 'loading',
      [PaymentWorkflowStateEnum.Completed]: 'check',
      [PaymentWorkflowStateEnum.Cancelled]: 'stop'
    };

    return stateIcons[this.workflowState?.currentState || PaymentWorkflowStateEnum.Draft] || 'question';
  }
}
