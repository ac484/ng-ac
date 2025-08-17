/**
 * @fileoverview 認證佈局組件 (Passport Layout Component)
 * @description 使用Angular Material實現的認證頁面佈局
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 * @lastModified 2025-08-17 by System Migration
 *
 * 檔案性質：
 * - 類型：Interface Layer Passport Layout
 * - 職責：認證頁面佈局管理，使用Material Design
 * - 依賴：Angular Core, Router, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現認證佈局
 * - 採用極簡主義設計，避免過度複雜化
 * - 使用card組件包裝認證內容
 *
 * @module Layout
 * @layer Interface
 * @context Authentication Layout (Passport)
 * @see docs/0.FILE_HEADER_CONVENTION.md
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-passport-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatCardModule],
  template: `
    <div class="passport-layout">
      <mat-card class="passport-card">
        <mat-card-header>
          <mat-card-title>NG-AC Admin</mat-card-title>
          <mat-card-subtitle>企業管理系統</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <router-outlet></router-outlet>
        </mat-card-content>

        <mat-card-footer>
          <p>&copy; 2024 NG-AC Team</p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .passport-layout {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .passport-card {
      width: 100%;
      max-width: 400px;
    }

    .passport-card mat-card-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .passport-card mat-card-title {
      font-size: 2rem;
      margin-bottom: 10px;
    }

    .passport-card mat-card-content {
      margin-bottom: 20px;
    }

    .passport-card mat-card-footer {
      text-align: center;
      color: #999;
      font-size: 0.9rem;
      padding: 10px;
    }
  `]
})
export class PassportLayoutComponent {}
