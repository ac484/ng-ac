import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { ContractDto } from '../../../application/dto/contract.dto';
import { ContractApplicationService } from '../../../application/services/contract-application.service';

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzButtonModule, NzIconModule, NzTagModule, NzDescriptionsModule, NzDividerModule],
  template: `
    <div class="contract-detail-container">
      <div class="header-actions">
        <button nz-button nzType="default" (click)="goBack()">
          <span nz-icon nzType="arrow-left"></span>
          返回列表
        </button>
        <div class="action-buttons">
          <button nz-button nzType="primary" (click)="editContract()">
            <span nz-icon nzType="edit"></span>
            編輯合約
          </button>
          <button nz-button nzDanger (click)="deleteContract()">
            <span nz-icon nzType="delete"></span>
            刪除合約
          </button>
        </div>
      </div>

      <nz-card *ngIf="contract" [nzTitle]="'合約詳情'" class="detail-card">
        <div class="contract-header">
          <h2>{{ contract.contractName }}</h2>
          <nz-tag [nzColor]="getStatusColor(contract.status)">
            {{ getStatusText(contract.status) }}
          </nz-tag>
        </div>

        <nz-descriptions nzTitle="基本資訊" [nzColumn]="2" nzBordered>
          <nz-descriptions-item nzTitle="合約編號">
            {{ contract.contractNumber }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="合約名稱">
            {{ contract.contractName }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="總金額">
            {{ contract.amount | currency: 'TWD' : 'symbol' : '1.0-0' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="合約狀態">
            <nz-tag [nzColor]="getStatusColor(contract.status)">
              {{ getStatusText(contract.status) }}
            </nz-tag>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="建立時間">
            {{ contract.createdAt | date: 'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="更新時間">
            {{ contract.updatedAt | date: 'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
        </nz-descriptions>

        <nz-divider></nz-divider>

        <nz-descriptions nzTitle="客戶資訊" [nzColumn]="2" nzBordered>
          <nz-descriptions-item nzTitle="客戶名稱">
            {{ contract.clientName }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="客戶代表">
            {{ contract.clientRepresentative || '未指定' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="聯絡人">
            {{ contract.contactPerson || '未指定' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="聯絡電話">
            {{ contract.contactPhone || '未指定' }}
          </nz-descriptions-item>
        </nz-descriptions>

        <div *ngIf="contract.notes" class="notes-section">
          <nz-divider></nz-divider>
          <h3>備註說明</h3>
          <p class="notes-content">{{ contract.notes }}</p>
        </div>
      </nz-card>

      <nz-card *ngIf="loading" class="loading-card">
        <div class="loading-content">
          <span nz-icon nzType="loading" nzSpin></span>
          <p>載入合約資料中...</p>
        </div>
      </nz-card>

      <nz-card *ngIf="!contract && !loading" class="error-card">
        <div class="error-content">
          <span nz-icon nzType="exclamation-circle" nzTheme="outline"></span>
          <h3>合約不存在</h3>
          <p>找不到指定的合約，可能已被刪除或編號錯誤。</p>
          <button nz-button nzType="primary" (click)="goBack()"> 返回列表 </button>
        </div>
      </nz-card>
    </div>
  `,
  styles: [
    `
      .contract-detail-container {
        padding: 24px;
      }

      .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .action-buttons {
        display: flex;
        gap: 12px;
      }

      .detail-card {
        max-width: 1000px;
        margin: 0 auto;
      }

      .contract-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .contract-header h2 {
        margin: 0;
        color: #1890ff;
      }

      .notes-section {
        margin-top: 24px;
      }

      .notes-section h3 {
        color: #1890ff;
        margin-bottom: 12px;
      }

      .notes-content {
        background: #f5f5f5;
        padding: 16px;
        border-radius: 6px;
        margin: 0;
        line-height: 1.6;
      }

      .loading-card,
      .error-card {
        max-width: 600px;
        margin: 0 auto;
      }

      .loading-content,
      .error-content {
        text-align: center;
        padding: 48px 24px;
      }

      .loading-content span {
        font-size: 48px;
        color: #1890ff;
        margin-bottom: 16px;
      }

      .error-content span {
        font-size: 48px;
        color: #ff4d4f;
        margin-bottom: 16px;
      }

      .error-content h3 {
        color: #ff4d4f;
        margin-bottom: 8px;
      }

      .error-content p {
        color: #666;
        margin-bottom: 24px;
      }
    `
  ]
})
export class ContractDetailComponent implements OnInit {
  private readonly contractApplicationService = inject(ContractApplicationService);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  contract?: ContractDto;
  loading = false;

  ngOnInit(): void {
    this.loadContract();
  }

  private async loadContract(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.message.error('合約編號無效');
      this.router.navigate(['/contracts']);
      return;
    }

    try {
      this.loading = true;
      this.contract = await this.contractApplicationService.getContract(id);
    } catch (error) {
      this.message.error('載入合約資料失敗');
      this.contract = undefined;
    } finally {
      this.loading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/contracts']);
  }

  editContract(): void {
    if (this.contract) {
      this.router.navigate(['/contracts', this.contract.id, 'edit']);
    }
  }

  async deleteContract(): Promise<void> {
    if (!this.contract) return;

    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除合約 "${this.contract.contractName}" 嗎？此操作無法復原。`,
      nzOkText: '確定刪除',
      nzCancelText: '取消',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          await this.contractApplicationService.deleteContract(this.contract!.id);
          this.message.success('合約刪除成功');
          this.router.navigate(['/contracts']);
        } catch (error) {
          this.message.error('合約刪除失敗');
        }
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      draft: 'default',
      preparing: 'processing',
      in_progress: 'warning',
      completed: 'success'
    };
    return colors[status] || 'default';
  }

  getStatusText(status: string): string {
    const texts: Record<string, string> = {
      draft: '草稿',
      preparing: '籌備中',
      in_progress: '進行中',
      completed: '已完成'
    };
    return texts[status] || status;
  }
}
