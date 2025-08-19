/**
 * @fileoverview 公開資訊／法律 頁面 (Public/Legal Page)
 * @description 法律文件總覽頁面，包含服務條款、隱私政策、法律聲明等重要法律文件
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2024-12-19 by NG-AC Team
 *
 * 📋 檔案性質：
 * • 類型：Interface Layer - Page Component (Standalone)
 * • 依賴：Angular Core, CommonModule, Material Design
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-public-legal',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="legal-page">
      <div class="hero-section">
        <h1>法律文件總覽</h1>
        <p class="subtitle">重要的法律文件和政策資訊，確保雙方權益得到保障</p>
      </div>

      <div class="content-section">
        <mat-card class="legal-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>description</mat-icon>
            <mat-card-title>服務條款</mat-card-title>
            <mat-card-subtitle>Terms of Service</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>詳細說明我們的服務內容、使用條款和客戶權利義務，確保服務的透明度和公平性。</p>
            <p><strong>更新日期：</strong>2024-12-19</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary">查看條款</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="legal-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>security</mat-icon>
            <mat-card-title>隱私政策</mat-card-title>
            <mat-card-subtitle>Privacy Policy</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>說明我們如何收集、使用和保護您的個人資訊，遵守相關隱私保護法規。</p>
            <p><strong>更新日期：</strong>2024-12-19</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary">查看政策</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="legal-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>gavel</mat-icon>
            <mat-card-title>法律聲明</mat-card-title>
            <mat-card-subtitle>Legal Notice</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>包含免責聲明、版權聲明和其他重要的法律資訊，保護公司和客戶的合法權益。</p>
            <p><strong>更新日期：</strong>2024-12-19</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary">查看聲明</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="additional-info">
        <h2>重要提醒</h2>
        <p>請仔細閱讀所有法律文件，如有疑問請聯繫我們的法律部門。</p>
        <p><strong>法律諮詢：</strong>legal&#64;ng-ac.com</p>
      </div>
    </div>
  `,
  styles: [`
    .legal-page {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .hero-section {
      text-align: center;
      margin-bottom: 40px;
    }

    .hero-section h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 16px;
    }

    .subtitle {
      font-size: 1.2rem;
      color: #666;
      max-width: 600px;
      margin: 0 auto;
    }

    .content-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .legal-card {
      height: 100%;
    }

    .legal-card mat-card-header {
      margin-bottom: 16px;
    }

    .legal-card mat-icon {
      font-size: 2rem;
      color: #1976d2;
    }

    .legal-card mat-card-content {
      margin-bottom: 16px;
    }

    .legal-card p {
      margin: 8px 0;
    }

    .additional-info {
      text-align: center;
      padding: 30px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .additional-info h2 {
      font-size: 1.8rem;
      color: #333;
      margin-bottom: 20px;
    }

    .additional-info p {
      color: #666;
      margin: 8px 0;
    }
  `]
})
export class PublicLegalPageComponent {}


