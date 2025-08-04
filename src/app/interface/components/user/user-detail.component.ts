import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';

import { UserApplicationService } from '../../../application/services/user-application.service';
import { UserDto } from '../../../application/dto/user.dto';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzDescriptionsModule
  ],
  template: `
    <div class="user-detail-container">
      <nz-card>
        <div class="header">
          <h2>用戶詳情</h2>
          <div class="actions">
            <button nz-button nzType="default" (click)="goBack()">
              <span nz-icon nzType="arrow-left"></span>
              返回
            </button>
            <button nz-button nzType="primary" (click)="editUser()">
              <span nz-icon nzType="edit"></span>
              編輯
            </button>
          </div>
        </div>

        <div *ngIf="user; else loading" class="user-info">
          <nz-descriptions nzTitle="基本信息" [nzColumn]="2">
            <nz-descriptions-item nzTitle="用戶ID">
              {{ user.id }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="顯示名稱">
              {{ user.displayName }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="郵箱">
              {{ user.email }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="狀態">
              <nz-tag [nzColor]="getStatusColor(user.status)">
                {{ getStatusText(user.status) }}
              </nz-tag>
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="創建時間">
              {{ user.createdAt | date:'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="更新時間">
              {{ user.updatedAt | date:'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="頭像URL" *ngIf="user.photoURL">
              {{ user.photoURL }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="電話號碼" *ngIf="user.phoneNumber">
              {{ user.phoneNumber }}
            </nz-descriptions-item>
          </nz-descriptions>
        </div>

        <ng-template #loading>
          <div class="loading">載入中...</div>
        </ng-template>
      </nz-card>
    </div>
  `,
  styles: [`
    .user-detail-container {
      padding: 24px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .header h2 {
      margin: 0;
    }
    
    .actions {
      display: flex;
      gap: 8px;
    }
    
    .loading {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  `]
})
export class UserDetailComponent implements OnInit {
  private readonly userApplicationService = inject(UserApplicationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  user: UserDto | null = null;
  loading = false;

  ngOnInit(): void {
    this.loadUser();
  }

  async loadUser(): Promise<void> {
    const userId = this.route.snapshot.paramMap.get('id');
    if (!userId) {
      this.message.error('用戶ID不能為空');
      this.goBack();
      return;
    }

    this.loading = true;
    try {
      const user = await this.userApplicationService.getUserById(userId);
      if (user) {
        this.user = user;
        this.loading = false;
      } else {
        this.message.error('用戶不存在');
        this.router.navigate(['/users']);
      }
    } catch (error: any) {
      this.message.error('載入用戶詳情失敗');
      this.router.navigate(['/users']);
    } finally {
      this.loading = false;
    }
  }

  editUser(): void {
    if (this.user) {
      this.router.navigate(['/users', this.user.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'INACTIVE': return 'red';
      case 'PENDING': return 'orange';
      case 'SUSPENDED': return 'red';
      default: return 'default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'ACTIVE': return '啟用';
      case 'INACTIVE': return '停用';
      case 'PENDING': return '待審核';
      case 'SUSPENDED': return '暫停';
      default: return '未知';
    }
  }
} 