/**
 * Account Center Component
 * Personal center page for user account management
 */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-account-center',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzAvatarModule, NzButtonModule, NzIconModule, NzDescriptionsModule, NzTagModule, NzDividerModule],
  template: `
    <div class="account-center-container">
      <nz-card nzTitle="個人中心" [nzExtra]="extraTemplate">
        <div class="user-profile">
          <div class="profile-header">
            <nz-avatar 
              [nzSize]="120" 
              nzSrc="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
              class="profile-avatar">
            </nz-avatar>
            <div class="profile-info">
              <h2>用戶名稱</h2>
              <p>user@example.com</p>
              <nz-tag nzColor="blue">已驗證</nz-tag>
            </div>
          </div>
        </div>

        <nz-divider></nz-divider>

        <nz-descriptions nzTitle="帳戶信息" [nzColumn]="2">
          <nz-descriptions-item nzTitle="用戶ID">U001</nz-descriptions-item>
          <nz-descriptions-item nzTitle="註冊時間">2024-01-01</nz-descriptions-item>
          <nz-descriptions-item nzTitle="最後登入">2024-01-15 10:30</nz-descriptions-item>
          <nz-descriptions-item nzTitle="登入次數">156</nz-descriptions-item>
          <nz-descriptions-item nzTitle="帳戶狀態">
            <nz-tag nzColor="green">正常</nz-tag>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="會員等級">
            <nz-tag nzColor="gold">VIP</nz-tag>
          </nz-descriptions-item>
        </nz-descriptions>

        <nz-divider></nz-divider>

        <div class="quick-actions">
          <h3>快速操作</h3>
          <div class="action-buttons">
            <button nz-button nzType="primary">
              <span nz-icon nzType="edit"></span>
              編輯資料
            </button>
            <button nz-button nzType="default">
              <span nz-icon nzType="safety"></span>
              安全設置
            </button>
            <button nz-button nzType="default">
              <span nz-icon nzType="notification"></span>
              通知設置
            </button>
            <button nz-button nzType="default">
              <span nz-icon nzType="key"></span>
              修改密碼
            </button>
          </div>
        </div>
      </nz-card>
    </div>

    <ng-template #extraTemplate>
      <button nz-button nzType="link">
        <span nz-icon nzType="setting"></span>
        設置
      </button>
    </ng-template>
  `,
  styles: [
    `
      .account-center-container {
        padding: 24px;
        max-width: 800px;
        margin: 0 auto;
      }

      .user-profile {
        margin-bottom: 24px;
      }

      .profile-header {
        display: flex;
        align-items: center;
        gap: 24px;
      }

      .profile-avatar {
        border: 4px solid #f0f0f0;
      }

      .profile-info h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 600;
      }

      .profile-info p {
        margin: 0 0 12px 0;
        color: #666;
        font-size: 16px;
      }

      .quick-actions {
        margin-top: 24px;
      }

      .quick-actions h3 {
        margin-bottom: 16px;
        font-size: 18px;
        font-weight: 600;
      }

      .action-buttons {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .action-buttons button {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `
  ]
})
export class AccountCenterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Initialize component
  }
}
