/**
 * @fileoverview 空白頁面組件檔案 (Blank Page Component)
 * @description 提供一個簡單的空白頁面，可用於測試或作為可關閉的標籤頁
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Blank Page Component
 * - 職責：空白頁面 UI 組件
 * - 依賴：Angular Material、Common Module
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用 Angular 20+ 和 Material 組件
 * - 遵循極簡主義原則，只實現必要的功能
 * - 使用官方 Angular Material 組件
 *
 * @module BlankPage
 * @layer Interface
 * @context Blank Page UI
 * @see docs/0.FILE_HEADER_CONVENTION.md
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-blank-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  template: `
    <div class="blank-page">
      <div class="blank-page-container">
        <mat-card class="blank-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon class="blank-icon">dashboard</mat-icon>
              空白頁面
            </mat-card-title>
            <mat-card-subtitle>
              這是一個可以關閉的空白頁面，用於測試標籤頁功能
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="blank-content">
              <p class="blank-description">
                歡迎使用空白頁面！這個頁面可以正常關閉，因為它不是 Dashboard。
              </p>

              <mat-divider class="content-divider"></mat-divider>

              <div class="feature-list">
                <h3>功能特點：</h3>
                <ul>
                  <li>✅ 可以正常關閉標籤頁</li>
                  <li>✅ 使用 Angular Material 設計</li>
                  <li>✅ 遵循 DDD 架構規範</li>
                  <li>✅ 響應式設計</li>
                </ul>
              </div>

              <div class="usage-info">
                <h3>使用說明：</h3>
                <p>
                  您可以關閉這個標籤頁，然後重新打開它來測試標籤頁的開關功能。
                  這個頁面不會影響 Dashboard 的不可關閉狀態。
                </p>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions class="blank-actions">
            <button mat-button color="primary">
              <mat-icon>refresh</mat-icon>
              刷新頁面
            </button>
            <button mat-button>
              <mat-icon>info</mat-icon>
              更多信息
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .blank-page {
      padding: 24px;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .blank-page-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .blank-card {
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .blank-icon {
      margin-right: 12px;
      color: #3f51b5;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .blank-content {
      padding: 16px 0;
    }

    .blank-description {
      font-size: 16px;
      line-height: 1.6;
      color: #666;
      margin-bottom: 24px;
    }

    .content-divider {
      margin: 24px 0;
    }

    .feature-list {
      margin-bottom: 24px;
    }

    .feature-list h3 {
      color: #333;
      margin-bottom: 16px;
      font-weight: 500;
    }

    .feature-list ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .feature-list li {
      padding: 8px 0;
      color: #555;
      font-size: 14px;
    }

    .usage-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #3f51b5;
    }

    .usage-info h3 {
      color: #333;
      margin-bottom: 12px;
      font-weight: 500;
    }

    .usage-info p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    .blank-actions {
      display: flex;
      gap: 12px;
      padding: 16px 24px;
      justify-content: flex-end;
    }

    .blank-actions button {
      border-radius: 8px;
      font-weight: 500;
    }

    .blank-actions mat-icon {
      margin-right: 8px;
    }

    /* 響應式設計 */
    @media (max-width: 768px) {
      .blank-page {
        padding: 16px;
      }

      .blank-page-container {
        max-width: 100%;
      }

      .blank-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .blank-actions button {
        width: 100%;
      }
    }
  `]
})
export class BlankPageComponent {
  // 空白頁面組件邏輯
  // 目前不需要額外的業務邏輯
}
