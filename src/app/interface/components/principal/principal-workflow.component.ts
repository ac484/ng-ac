import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Principal } from '../../../domain/entities/principal.entity';
import { PrincipalApplicationService } from '../../../application/services/principal-application.service';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';

// 流程狀態枚舉
export type WorkflowStateType = 
  | 'draft'           // 草稿
  | 'submitted'       // 已提交
  | 'under_review'    // 審核中
  | 'approved'        // 已通過
  | 'rejected'        // 已拒絕
  | 'withdrawn'       // 已撤回
  | 'finance_check'   // 財務檢查中
  | 'payment_processing' // 付款處理中
  | 'completed'       // 已完成
  | 'cancelled';      // 已取消

// 操作類型
export type WorkflowActionType = 
  | 'submit'          // 提交
  | 'withdraw'        // 撤回
  | 'approve'         // 通過
  | 'reject'          // 拒絕
  | 'return'          // 退回
  | 'process_payment' // 處理付款
  | 'complete'        // 完成
  | 'cancel';         // 取消

// 條件類型
export interface WorkflowCondition {
  type: 'amount' | 'role' | 'department' | 'custom';
  operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in';
  value: any;
  field?: string;
}

// 通知配置
export interface NotificationConfig {
  type: 'email' | 'sms' | 'system' | 'webhook';
  recipients: string[];
  template: string;
  trigger: 'on_state_change' | 'on_action' | 'on_timeout';
}

// 權限配置
export interface PermissionConfig {
  roles: string[];
  departments: string[];
  users: string[];
  minApprovers?: number;
  maxApprovers?: number;
}

// 狀態轉換
export interface WorkflowTransition {
  id: string;
  fromState: WorkflowStateType;
  toState: WorkflowStateType;
  action: WorkflowActionType;
  conditions?: WorkflowCondition[];
  permissions?: PermissionConfig;
  notifications?: NotificationConfig[];
  description?: string;
  isActive?: boolean;
}

// 流程狀態配置
export interface WorkflowState {
  type: WorkflowStateType;
  name: string;
  description: string;
  color: string;
  icon: string;
  allowedActions: WorkflowActionType[];
  defaultTransitions: WorkflowTransition[];
  permissions?: PermissionConfig;
  notifications?: NotificationConfig[];
  isActive?: boolean;
}

// 步驟配置接口
export interface WorkflowStepConfig {
  // 通用配置
  required?: boolean;
  autoApprove?: boolean;
  timeout?: number; // 超時時間（小時）
  
  // 審核相關
  approvers?: string[];
  minApprovers?: number;
  approvalLevel?: number;
  
  // 財務相關
  amountLimit?: number;
  currency?: string;
  budgetCode?: string;
  
  // 通知相關
  notifyRecipients?: string[];
  notifyTemplate?: string;
  
  // 文件相關
  requiredDocuments?: string[];
  documentTypes?: string[];
  
  // 付款相關
  paymentMethod?: string;
  paymentTerms?: string;
  
  // 狀態轉換相關
  stateTransitions?: WorkflowTransition[];
  
  // 自定義配置
  customFields?: Record<string, any>;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: WorkflowStepType;
  order: number;
  config: WorkflowStepConfig;
  description?: string;
  isActive?: boolean;
  stateTransitions?: WorkflowTransition[];
}

// 請款流程步驟類型枚舉
export type WorkflowStepType = 
  | 'application'      // 申請
  | 'review'           // 審核
  | 'approval'         // 審批
  | 'finance_check'    // 財務檢查
  | 'budget_check'     // 預算檢查
  | 'legal_review'     // 法務審查
  | 'document_upload'  // 文件上傳
  | 'document_verify'  // 文件驗證
  | 'notification'     // 通知
  | 'payment_process'  // 付款處理
  | 'reimbursement'    // 報銷
  | 'expense_claim'    // 費用申請
  | 'vendor_payment'   // 供應商付款
  | 'tax_processing'   // 稅務處理
  | 'audit_trail'      // 審計追蹤
  | 'completion';      // 完成

// 步驟類型配置
export const WORKFLOW_STEP_TYPES = [
  { value: 'application', label: '申請', description: '請款申請提交' },
  { value: 'review', label: '審核', description: '初步審核檢查' },
  { value: 'approval', label: '審批', description: '正式審批流程' },
  { value: 'finance_check', label: '財務檢查', description: '財務合規性檢查' },
  { value: 'budget_check', label: '預算檢查', description: '預算可用性檢查' },
  { value: 'legal_review', label: '法務審查', description: '法務合規性審查' },
  { value: 'document_upload', label: '文件上傳', description: '相關文件上傳' },
  { value: 'document_verify', label: '文件驗證', description: '文件完整性驗證' },
  { value: 'notification', label: '通知', description: '發送通知給相關方' },
  { value: 'payment_process', label: '付款處理', description: '實際付款執行' },
  { value: 'reimbursement', label: '報銷', description: '員工費用報銷' },
  { value: 'expense_claim', label: '費用申請', description: '費用申請處理' },
  { value: 'vendor_payment', label: '供應商付款', description: '供應商付款處理' },
  { value: 'tax_processing', label: '稅務處理', description: '稅務申報和處理' },
  { value: 'audit_trail', label: '審計追蹤', description: '審計記錄和追蹤' },
  { value: 'completion', label: '完成', description: '流程完成確認' }
];

// 狀態配置
export const WORKFLOW_STATES: WorkflowState[] = [
  {
    type: 'draft',
    name: '草稿',
    description: '申請草稿狀態',
    color: '#8c8c8c',
    icon: 'file-text',
    allowedActions: ['submit'],
    defaultTransitions: []
  },
  {
    type: 'submitted',
    name: '已提交',
    description: '申請已提交，等待審核',
    color: '#1890ff',
    icon: 'upload',
    allowedActions: ['withdraw'],
    defaultTransitions: []
  },
  {
    type: 'under_review',
    name: '審核中',
    description: '正在進行審核',
    color: '#faad14',
    icon: 'eye',
    allowedActions: ['approve', 'reject', 'return'],
    defaultTransitions: []
  },
  {
    type: 'approved',
    name: '已通過',
    description: '審核已通過',
    color: '#52c41a',
    icon: 'check-circle',
    allowedActions: ['process_payment'],
    defaultTransitions: []
  },
  {
    type: 'rejected',
    name: '已拒絕',
    description: '審核被拒絕',
    color: '#ff4d4f',
    icon: 'close-circle',
    allowedActions: ['cancel'],
    defaultTransitions: []
  },
  {
    type: 'withdrawn',
    name: '已撤回',
    description: '申請已撤回',
    color: '#722ed1',
    icon: 'rollback',
    allowedActions: ['cancel'],
    defaultTransitions: []
  },
  {
    type: 'finance_check',
    name: '財務檢查中',
    description: '正在進行財務檢查',
    color: '#13c2c2',
    icon: 'account-book',
    allowedActions: ['approve', 'reject', 'return'],
    defaultTransitions: []
  },
  {
    type: 'payment_processing',
    name: '付款處理中',
    description: '正在處理付款',
    color: '#eb2f96',
    icon: 'credit-card',
    allowedActions: ['complete', 'cancel'],
    defaultTransitions: []
  },
  {
    type: 'completed',
    name: '已完成',
    description: '流程已完成',
    color: '#52c41a',
    icon: 'check',
    allowedActions: [],
    defaultTransitions: []
  },
  {
    type: 'cancelled',
    name: '已取消',
    description: '流程已取消',
    color: '#ff4d4f',
    icon: 'stop',
    allowedActions: [],
    defaultTransitions: []
  }
];

// 操作配置
export const WORKFLOW_ACTIONS = [
  { value: 'submit', label: '提交', description: '提交申請' },
  { value: 'withdraw', label: '撤回', description: '撤回申請' },
  { value: 'approve', label: '通過', description: '通過審核' },
  { value: 'reject', label: '拒絕', description: '拒絕申請' },
  { value: 'return', label: '退回', description: '退回修改' },
  { value: 'process_payment', label: '處理付款', description: '執行付款' },
  { value: 'complete', label: '完成', description: '完成流程' },
  { value: 'cancel', label: '取消', description: '取消流程' }
];

@Component({
  selector: 'app-principal-workflow',
  templateUrl: './principal-workflow.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzModalModule,
    NzEmptyModule,
    NzSpinModule,
    NzListModule,
    NzInputModule,
    NzSelectModule,
    NzFormModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzTagModule,
    NzTabsModule,
    NzCollapseModule,
    NzCheckboxModule,
    NzRadioModule,
    FormsModule
  ]
})
export class PrincipalWorkflowComponent implements OnInit {
  @Input() principal: Principal | null = null;
  @Output() workflowSaved = new EventEmitter<WorkflowStep[]>();

  workflowSteps: WorkflowStep[] = [];
  workflowStepTypes = WORKFLOW_STEP_TYPES;
  workflowStates = WORKFLOW_STATES;
  workflowActions = WORKFLOW_ACTIONS;
  loading = false;
  activeTab = 0;

  constructor(
    private message: NzMessageService,
    private principalApplicationService: PrincipalApplicationService
  ) {}

  ngOnInit(): void {
    if (this.principal) {
      this.loadWorkflow();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['principal'] && this.principal) {
      this.loadWorkflow();
    }
  }

  loadWorkflow(): void {
    if (!this.principal) return;

    this.loading = true;
    // 從 Principal 實體中讀取請款流程數據
    setTimeout(() => {
      if (this.principal) {
        this.workflowSteps = this.principal.workflowSteps || [];
      }
      this.loading = false;
    }, 100);
  }

  addWorkflowStep(): void {
    const newStep: WorkflowStep = {
      id: this.generateId(),
      name: '',
      type: 'application',
      order: this.workflowSteps.length,
      config: {
        required: true,
        autoApprove: false
      },
      description: '',
      isActive: true,
      stateTransitions: []
    };
    
    this.workflowSteps = [...this.workflowSteps, newStep];
  }

  removeStep(index: number): void {
    this.workflowSteps = this.workflowSteps.filter((_, i) => i !== index);
    this.updateStepOrders();
  }

  moveStepUp(index: number): void {
    if (index > 0) {
      const steps = [...this.workflowSteps];
      [steps[index], steps[index - 1]] = [steps[index - 1], steps[index]];
      this.workflowSteps = steps;
      this.updateStepOrders();
    }
  }

  moveStepDown(index: number): void {
    if (index < this.workflowSteps.length - 1) {
      const steps = [...this.workflowSteps];
      [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];
      this.workflowSteps = steps;
      this.updateStepOrders();
    }
  }

  updateStepOrders(): void {
    this.workflowSteps = this.workflowSteps.map((step, index) => ({
      ...step,
      order: index
    }));
  }

  getStepTypeLabel(type: WorkflowStepType): string {
    const stepType = this.workflowStepTypes.find(st => st.value === type);
    return stepType ? stepType.label : type;
  }

  getStepTypeDescription(type: WorkflowStepType): string {
    const stepType = this.workflowStepTypes.find(st => st.value === type);
    return stepType ? stepType.description : '';
  }

  getStateLabel(type: WorkflowStateType): string {
    const state = this.workflowStates.find(s => s.type === type);
    return state ? state.name : type;
  }

  getStateColor(type: WorkflowStateType): string {
    const state = this.workflowStates.find(s => s.type === type);
    return state ? state.color : '#8c8c8c';
  }

  getActionLabel(action: WorkflowActionType): string {
    const actionConfig = this.workflowActions.find(a => a.value === action);
    return actionConfig ? actionConfig.label : action;
  }

  onStepTypeChange(step: WorkflowStep, newType: WorkflowStepType): void {
    step.type = newType;
    
    // 根據步驟類型設置預設配置和狀態轉換
    switch (newType) {
      case 'application':
        step.config = {
          required: true,
          autoApprove: false,
          timeout: 24
        };
        step.stateTransitions = [
          {
            id: this.generateId(),
            fromState: 'draft',
            toState: 'submitted',
            action: 'submit',
            description: '提交申請',
            isActive: true
          },
          {
            id: this.generateId(),
            fromState: 'submitted',
            toState: 'withdrawn',
            action: 'withdraw',
            description: '撤回申請',
            isActive: true
          }
        ];
        break;
      case 'review':
      case 'approval':
        step.config = {
          required: true,
          approvers: [],
          minApprovers: 1,
          approvalLevel: 1
        };
        step.stateTransitions = [
          {
            id: this.generateId(),
            fromState: 'submitted',
            toState: 'under_review',
            action: 'submit',
            description: '開始審核',
            isActive: true
          },
          {
            id: this.generateId(),
            fromState: 'under_review',
            toState: 'approved',
            action: 'approve',
            description: '通過審核',
            isActive: true
          },
          {
            id: this.generateId(),
            fromState: 'under_review',
            toState: 'rejected',
            action: 'reject',
            description: '拒絕申請',
            isActive: true
          }
        ];
        break;
      case 'finance_check':
        step.config = {
          required: true,
          amountLimit: 100000,
          currency: 'TWD',
          budgetCode: ''
        };
        step.stateTransitions = [
          {
            id: this.generateId(),
            fromState: 'approved',
            toState: 'finance_check',
            action: 'submit',
            description: '開始財務檢查',
            isActive: true
          },
          {
            id: this.generateId(),
            fromState: 'finance_check',
            toState: 'payment_processing',
            action: 'approve',
            description: '財務檢查通過',
            isActive: true
          },
          {
            id: this.generateId(),
            fromState: 'finance_check',
            toState: 'rejected',
            action: 'reject',
            description: '財務檢查不通過',
            isActive: true
          }
        ];
        break;
      case 'payment_process':
        step.config = {
          required: true,
          paymentMethod: '銀行轉帳',
          paymentTerms: 'T+3'
        };
        step.stateTransitions = [
          {
            id: this.generateId(),
            fromState: 'payment_processing',
            toState: 'completed',
            action: 'complete',
            description: '付款完成',
            isActive: true
          },
          {
            id: this.generateId(),
            fromState: 'payment_processing',
            toState: 'cancelled',
            action: 'cancel',
            description: '付款失敗',
            isActive: true
          }
        ];
        break;
      default:
        step.config = {
          required: true,
          autoApprove: false
        };
        step.stateTransitions = [];
    }
  }

  addStateTransition(step: WorkflowStep): void {
    const newTransition: WorkflowTransition = {
      id: this.generateId(),
      fromState: 'draft',
      toState: 'submitted',
      action: 'submit',
      description: '',
      isActive: true
    };
    
    step.stateTransitions = [...(step.stateTransitions || []), newTransition];
  }

  removeStateTransition(step: WorkflowStep, transitionId: string): void {
    step.stateTransitions = step.stateTransitions?.filter(t => t.id !== transitionId) || [];
  }

  configureStep(step: WorkflowStep): void {
    // 這裡可以打開一個模態框來配置步驟的詳細設置
    this.message.info(`配置步驟: ${step.name}`);
    // TODO: 實現步驟配置模態框
  }

  getActiveStepsCount(): number {
    return this.workflowSteps.filter(s => s.isActive).length;
  }

  getRequiredStepsCount(): number {
    return this.workflowSteps.filter(s => s.config.required).length;
  }

  getApprovalStepsCount(): number {
    return this.workflowSteps.filter(s => 
      ['review', 'approval', 'finance_check', 'legal_review'].includes(s.type)
    ).length;
  }

  getTotalTransitionsCount(): number {
    return this.workflowSteps.reduce((total, step) => 
      total + (step.stateTransitions?.length || 0), 0
    );
  }

  saveWorkflow(): void {
    if (!this.principal) return;

    this.loading = true;
    
    this.principalApplicationService.updateWorkflow({
      principalId: this.principal.id.getValue(),
      workflowSteps: this.workflowSteps
    }).subscribe({
      next: (success) => {
        if (success) {
          this.message.success('請款流程保存成功');
          this.workflowSaved.emit(this.workflowSteps);
        } else {
          this.message.error('請款流程保存失敗');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('保存請款流程時發生錯誤:', error);
        this.message.error('請款流程保存失敗');
        this.loading = false;
      }
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 