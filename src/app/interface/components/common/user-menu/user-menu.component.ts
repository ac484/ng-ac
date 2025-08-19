/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "極簡用戶菜單-用戶操作入口",
 *   "constraints": ["Standalone組件", "OnPush策略", "極簡實現"],
 *   "dependencies": ["MatMenuModule", "MatIconModule", "MatButtonModule"],
 *   "security": "medium",
 *   "lastmod": "2025-01-18"
 * }
 * @usage <app-user-menu></app-user-menu>
 * @see docs/architecture/interface.md
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      [matMenuTriggerFor]="userMenu"
      aria-label="用戶菜單">
      <mat-icon>account_circle</mat-icon>
    </button>

    <mat-menu #userMenu="matMenu" class="user-menu">
      <div class="user-info">
        <p class="username">NG-AC 用戶</p>
        <p class="user-role">開發者</p>
      </div>

      <mat-divider />

      <button mat-menu-item (click)="onProfile()">
        <mat-icon>person</mat-icon>
        <span>個人資料</span>
      </button>

      <button mat-menu-item (click)="onSettings()">
        <mat-icon>settings</mat-icon>
        <span>設置</span>
      </button>

      <mat-divider />

      <button mat-menu-item (click)="onLogout()">
        <mat-icon>logout</mat-icon>
        <span>登出</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .user-info {
      padding: 1rem;
      text-align: center;

      .username {
        margin: 0;
        font-weight: 500;
        color: var(--mat-sys-on-surface);
      }

      .user-role {
        margin: 0.25rem 0 0 0;
        font-size: 0.8rem;
        color: var(--mat-sys-on-surface-variant);
      }
    }
  `]
})
export class UserMenuComponent {
  protected onProfile(): void {
    console.log('導航到個人資料頁面');
  }

  protected onSettings(): void {
    console.log('導航到設置頁面');
  }

  protected onLogout(): void {
    console.log('執行登出邏輯');
  }
}



