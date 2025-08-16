/**
 * @fileoverview 用戶卡片組件 (User Card Component)
 * @description 使用Angular Material實現的超極簡用戶卡片組件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Widget Component
 * - 職責：超極簡用戶卡片組件，只保留最基本功能
 * - 依賴：Angular Core, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現用戶卡片
 * - 採用超極簡主義設計，只保留最基本功能
 * - 不添加過度複雜的邏輯
 */

import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <mat-card style="max-width: 300px; margin: 16px;">
      <mat-card-header>
        <mat-card-title>{{user.name}}</mat-card-title>
        <mat-card-subtitle>{{user.email}}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p>角色: {{user.role}}</p>
        <p>狀態: {{user.isActive ? '活躍' : '非活躍'}}</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button>編輯</button>
        <button mat-button>查看</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [``]
})
export class UserCardComponent {
  @Input() user: { name: string; email: string; role: string; isActive: boolean; } = {
    name: '用戶名稱', email: 'user@example.com', role: '用戶', isActive: true
  };
}
