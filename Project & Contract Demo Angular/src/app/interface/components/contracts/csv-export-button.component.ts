/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "CSV導出按鈕-將合約數據導出為CSV",
 *   "constraints": ["純JavaScript實現", "無外部依賴", "極簡設計"],
 *   "dependencies": [],
 *   "security": "low",
 *   "lastmod": "2025-01-18"
 * }
 */
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Contract } from '../../../shared/types';

@Component({
  selector: 'app-csv-export-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <button
      mat-icon-button
      (click)="exportToCsv()"
      matTooltip="導出 CSV"
      [disabled]="contracts().length === 0">
      <mat-icon>download</mat-icon>
    </button>
  `
})
export class CsvExportButtonComponent {
  readonly contracts = input.required<Contract[]>();

  exportToCsv(): void {
    const contracts = this.contracts();
    if (contracts.length === 0) return;

    const headers = [
      '合約編號',
      '標題',
      '客戶',
      '狀態',
      '總價值',
      '開始日期',
      '結束日期',
      '工作範圍'
    ];

    const csvData = contracts.map(contract => [
      contract.id,
      contract.title,
      contract.client,
      this.getStatusText(contract.status),
      contract.totalValue.toString(),
      this.formatDate(contract.startDate),
      this.formatDate(contract.endDate),
      contract.scope.replace(/\n/g, ' ').replace(/,/g, '；')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contracts_${this.getDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'Draft': '草稿',
      'Active': '進行中',
      'Completed': '已完成',
      'Cancelled': '已取消'
    };
    return statusMap[status] || status;
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(date));
  }

  private getDateString(): string {
    return new Date().toISOString().split('T')[0];
  }
}
