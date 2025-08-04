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
import { FormsModule } from '@angular/forms';

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'document';
  order: number;
  config: any;
}

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
    FormsModule
  ]
})
export class PrincipalWorkflowComponent implements OnInit {
  @Input() principal: Principal | null = null;
  @Output() workflowSaved = new EventEmitter<WorkflowStep[]>();

  workflowSteps: WorkflowStep[] = [];
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
          name: '初步審核',
          type: 'approval',
          order: 0,
          config: {}
        },
        {
          id: '2',
          name: '財務審核',
          type: 'approval',
          order: 1,
          config: {}
        },
        {
          id: '3',
          name: '通知相關部門',
          type: 'notification',
          order: 2,
          config: {}
        }
      ];
      this.loading = false;
    }, 500);
  }

  addWorkflowStep(): void {
    const newStep: WorkflowStep = {
      id: this.generateId(),
      name: '',
      type: 'approval',
      order: this.workflowSteps.length,
      config: {}
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