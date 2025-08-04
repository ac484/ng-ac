import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Principal } from '../../../domain/entities/principal.entity';
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
import { FormsModule } from '@angular/forms';

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
}

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
    FormsModule
  ]
})
export class PrincipalWorkflowComponent implements OnInit {
  @Input() principal: Principal | null = null;
  @Output() workflowSaved = new EventEmitter<WorkflowStep[]>();

  workflowSteps: WorkflowStep[] = [];
  workflowStepTypes = WORKFLOW_STEP_TYPES;
  loading = false;

  constructor(private message: NzMessageService) {}

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
    // 模擬載入工作流程數據
    setTimeout(() => {
      this.workflowSteps = [
        {
          id: '1',
          name: '請款申請',
          type: 'application',
          order: 0,
          config: {
            required: true,
            autoApprove: false,
            timeout: 24
          },
          description: '提交請款申請',
          isActive: true
        },
        {
          id: '2',
          name: '部門審核',
          type: 'review',
          order: 1,
          config: {
            required: true,
            approvers: ['部門主管'],
            minApprovers: 1,
            approvalLevel: 1
          },
          description: '部門主管初步審核',
          isActive: true
        },
        {
          id: '3',
          name: '財務檢查',
          type: 'finance_check',
          order: 2,
          config: {
            required: true,
            amountLimit: 100000,
            currency: 'TWD',
            budgetCode: 'FIN001'
          },
          description: '財務合規性檢查',
          isActive: true
        },
        {
          id: '4',
          name: '文件驗證',
          type: 'document_verify',
          order: 3,
          config: {
            required: true,
            requiredDocuments: ['發票', '合約', '收據'],
            documentTypes: ['pdf', 'jpg', 'png']
          },
          description: '驗證必要文件',
          isActive: true
        },
        {
          id: '5',
          name: '最終審批',
          type: 'approval',
          order: 4,
          config: {
            required: true,
            approvers: ['財務經理', '總經理'],
            minApprovers: 2,
            approvalLevel: 2
          },
          description: '最終審批確認',
          isActive: true
        },
        {
          id: '6',
          name: '付款處理',
          type: 'payment_process',
          order: 5,
          config: {
            required: true,
            paymentMethod: '銀行轉帳',
            paymentTerms: 'T+3'
          },
          description: '執行付款流程',
          isActive: true
        },
        {
          id: '7',
          name: '完成通知',
          type: 'notification',
          order: 6,
          config: {
            required: true,
            notifyRecipients: ['申請人', '財務部門'],
            notifyTemplate: 'payment_completed'
          },
          description: '發送完成通知',
          isActive: true
        }
      ];
      this.loading = false;
    }, 500);
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
      isActive: true
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

  onStepTypeChange(step: WorkflowStep, newType: WorkflowStepType): void {
    step.type = newType;
    
    // 根據步驟類型設置預設配置
    switch (newType) {
      case 'application':
        step.config = {
          required: true,
          autoApprove: false,
          timeout: 24
        };
        break;
      case 'review':
      case 'approval':
        step.config = {
          required: true,
          approvers: [],
          minApprovers: 1,
          approvalLevel: 1
        };
        break;
      case 'finance_check':
        step.config = {
          required: true,
          amountLimit: 100000,
          currency: 'TWD',
          budgetCode: ''
        };
        break;
      case 'document_upload':
      case 'document_verify':
        step.config = {
          required: true,
          requiredDocuments: [],
          documentTypes: ['pdf', 'jpg', 'png']
        };
        break;
      case 'notification':
        step.config = {
          required: true,
          notifyRecipients: [],
          notifyTemplate: ''
        };
        break;
      case 'payment_process':
        step.config = {
          required: true,
          paymentMethod: '銀行轉帳',
          paymentTerms: 'T+3'
        };
        break;
      default:
        step.config = {
          required: true,
          autoApprove: false
        };
    }
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

  saveWorkflow(): void {
    if (!this.principal) return;

    this.loading = true;
    // 模擬保存工作流程
    setTimeout(() => {
      this.message.success('請款流程保存成功');
      this.workflowSaved.emit(this.workflowSteps);
      this.loading = false;
    }, 1000);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 