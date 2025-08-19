/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "現代化用戶卡片-用戶信息展示",
 *   "constraints": ["Standalone組件", "OnPush策略", "Signals狀態"],
 *   "dependencies": ["MatCardModule", "MatButtonModule", "MatIconModule"],
 *   "security": "low",
 *   "lastmod": "2025-01-18"
 * }
 * @usage <app-user-card [user]="user" (edit)="onEdit($event)"></app-user-card>
 * @see docs/architecture/interface.md
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: Date;
  status: 'active' | 'inactive' | 'pending';
  isVip: boolean;
}

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="user-card">
      <mat-card-header>
        <div mat-card-avatar class="user-avatar">
          <mat-icon>person</mat-icon>
        </div>
        <mat-card-title>{{ user()?.name }}</mat-card-title>
        <mat-card-subtitle>{{ user()?.email }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="user-info">
          <p><strong>角色:</strong> {{ user()?.role }}</p>
          <p><strong>部門:</strong> {{ user()?.department }}</p>
          <p><strong>加入日期:</strong> {{ joinDateFormatted() }}</p>
        </div>

        <div class="user-status">
          <mat-chip-set>
            <mat-chip [color]="statusColor()">
              {{ statusText() }}
            </mat-chip>
            @if (user()?.isVip) {
              <mat-chip color="accent">VIP</mat-chip>
            }
          </mat-chip-set>
        </div>
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-button (click)="onView()">
          <mat-icon>visibility</mat-icon>
          查看
        </button>
        @if (canEdit()) {
          <button mat-button (click)="onEdit()">
            <mat-icon>edit</mat-icon>
            編輯
          </button>
        }
        @if (canDelete()) {
          <button mat-button color="warn" (click)="onDelete()">
            <mat-icon>delete</mat-icon>
            刪除
          </button>
        }
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .user-card {
      max-width: 400px;
      margin: 1rem;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--mat-sys-primary-container);
    }

    .user-info {
      margin: 1rem 0;

      p {
        margin: 0.5rem 0;
        font-size: 0.9rem;
      }
    }

    .user-status {
      margin-top: 1rem;
    }
  `]
})
export class UserCardComponent {
  // 輸入屬性
  readonly user = input<User | null>(null);
  readonly canEdit = input(true);
  readonly canDelete = input(false);

  // 輸出事件
  readonly view = output<User>();
  readonly edit = output<User>();
  readonly delete = output<User>();

  // 計算屬性
  readonly joinDateFormatted = () => {
    const user = this.user();
    if (!user?.joinDate) return '未知';

    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(user.joinDate));
  };

  readonly statusColor = () => {
    const status = this.user()?.status;
    switch (status) {
      case 'active': return 'primary';
      case 'inactive': return 'warn';
      case 'pending': return 'accent';
      default: return 'basic';
    }
  };

  readonly statusText = () => {
    const status = this.user()?.status;
    switch (status) {
      case 'active': return '活躍';
      case 'inactive': return '非活躍';
      case 'pending': return '待審核';
      default: return '未知';
    }
  };

  // 事件處理
  protected onView(): void {
    const user = this.user();
    if (user) this.view.emit(user);
  }

  protected onEdit(): void {
    const user = this.user();
    if (user && this.canEdit()) this.edit.emit(user);
  }

  protected onDelete(): void {
    const user = this.user();
    if (user && this.canDelete()) this.delete.emit(user);
  }
}
