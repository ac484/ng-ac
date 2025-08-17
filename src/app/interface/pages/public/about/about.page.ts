/**
 * @fileoverview 公開資訊／關於 頁面 (Public/About Page)
 * @description 關於我們頁面，展示企業文化、團隊實力和發展歷程
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2024-12-19 by NG-AC Team
 *
 * 📋 檔案性質：
 * • 類型：Interface Layer - Page Component (Standalone)
 * • 依賴：Angular Core, CommonModule, Material Design
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 僅提供極簡頁面骨架
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-public-about',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="about-page">
      <div class="hero-section">
        <h1>關於我們</h1>
        <p class="subtitle">專注於建築工程管理，為客戶提供專業的解決方案</p>
      </div>

      <div class="content-section">
        <mat-card class="info-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>business</mat-icon>
            <mat-card-title>企業文化</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>我們致力於建築工程的卓越品質，以專業技術和創新思維推動行業發展。</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="info-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>engineering</mat-icon>
            <mat-card-title>專業實力</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>擁有豐富的工程管理經驗，專業團隊提供全方位的技術支援和解決方案。</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="info-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>trending_up</mat-icon>
            <mat-card-title>發展歷程</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>持續創新發展，不斷提升服務品質，成為客戶信賴的合作夥伴。</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .about-page {
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
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .info-card {
      text-align: center;
      padding: 20px;
    }

    .info-card mat-card-header {
      margin-bottom: 16px;
    }

    .info-card mat-icon {
      font-size: 2rem;
      color: #1976d2;
    }
  `]
})
export class PublicAboutPageComponent {}


