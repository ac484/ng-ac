import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { ContractStatus } from '../../../../domain/entities/contract.entity';

@Component({
  selector: 'app-contract-status-badge',
  standalone: true,
  imports: [CommonModule, NzTagModule],
  template: `
    <nz-tag [nzColor]="getStatusColor()">
      {{ getStatusText() }}
    </nz-tag>
  `
})
export class ContractStatusBadgeComponent {
  @Input() status!: ContractStatus;

  getStatusColor(): string {
    const colorMap: Record<ContractStatus, string> = {
      [ContractStatus.DRAFT]: 'default',
      [ContractStatus.PENDING_APPROVAL]: 'orange',
      [ContractStatus.APPROVED]: 'blue',
      [ContractStatus.ACTIVE]: 'green',
      [ContractStatus.COMPLETED]: 'cyan',
      [ContractStatus.TERMINATED]: 'red',
      [ContractStatus.EXPIRED]: 'volcano'
    };
    return colorMap[this.status] || 'default';
  }

  getStatusText(): string {
    const textMap: Record<ContractStatus, string> = {
      [ContractStatus.DRAFT]: '草稿',
      [ContractStatus.PENDING_APPROVAL]: '待審批',
      [ContractStatus.APPROVED]: '已審批',
      [ContractStatus.ACTIVE]: '執行中',
      [ContractStatus.COMPLETED]: '已完成',
      [ContractStatus.TERMINATED]: '已終止',
      [ContractStatus.EXPIRED]: '已過期'
    };
    return textMap[this.status] || '未知';
  }
}
