/**
 * 合約統計卡片組件
 * 顯示合約總數、各狀態數量和總金額統計
 */

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

export interface ContractStats {
  total: number;
  draft: number;
  preparing: number;
  active: number;
  completed: number;
  totalAmount: number;
}

@Component({
  selector: 'app-contract-statistics',
  template: `
    <div nz-row [nzGutter]="16" class="mb-16">
      <div nz-col [nzSpan]="4">
        <nz-card>
          <nz-statistic 
            nzTitle="總合約數" 
            [nzValue]="stats.total" 
            nzPrefix="📋"
            [nzValueStyle]="{ color: '#1890ff' }">
          </nz-statistic>
        </nz-card>
      </div>
      
      <div nz-col [nzSpan]="4">
        <nz-card>
          <nz-statistic 
            nzTitle="草稿" 
            [nzValue]="stats.draft" 
            nzPrefix="📝"
            [nzValueStyle]="{ color: '#8c8c8c' }">
          </nz-statistic>
        </nz-card>
      </div>
      
      <div nz-col [nzSpan]="4">
        <nz-card>
          <nz-statistic 
            nzTitle="籌備中" 
            [nzValue]="stats.preparing" 
            nzPrefix="⚙️"
            [nzValueStyle]="{ color: '#faad14' }">
          </nz-statistic>
        </nz-card>
      </div>
      
      <div nz-col [nzSpan]="4">
        <nz-card>
          <nz-statistic 
            nzTitle="進行中" 
            [nzValue]="stats.active" 
            nzPrefix="🔄"
            [nzValueStyle]="{ color: '#52c41a' }">
          </nz-statistic>
        </nz-card>
      </div>
      
      <div nz-col [nzSpan]="4">
        <nz-card>
          <nz-statistic 
            nzTitle="已完成" 
            [nzValue]="stats.completed" 
            nzPrefix="✅"
            [nzValueStyle]="{ color: '#722ed1' }">
          </nz-statistic>
        </nz-card>
      </div>
      
      <div nz-col [nzSpan]="4">
        <nz-card>
          <nz-statistic 
            nzTitle="總金額" 
            [nzValue]="stats.totalAmount" 
            nzPrefix="💰"
            [nzValueStyle]="{ color: '#fa8c16' }"
            [nzFormatter]="amountFormatter">
          </nz-statistic>
        </nz-card>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    NzStatisticModule
  ]
})
export class ContractStatisticsComponent {
  @Input() stats: ContractStats = {
    total: 0,
    draft: 0,
    preparing: 0,
    active: 0,
    completed: 0,
    totalAmount: 0
  };

  amountFormatter = (value: number): string => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(value);
  };
}