/**
 * @fileoverview 公開資訊／部落格 頁面 (Public/Blog Page)
 * @description 部落格/新聞中心頁面，分享最新的工程技術、行業動態和公司資訊
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
  selector: 'app-public-blog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="blog-page">
      <div class="hero-section">
        <h1>部落格/新聞中心</h1>
        <p class="subtitle">分享最新的工程技術、行業動態和公司資訊</p>
      </div>

      <div class="content-section">
        <mat-card class="blog-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>engineering</mat-icon>
            <mat-card-title>工程技術</mat-card-title>
            <mat-card-subtitle>2024-12-19</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>涵蓋建築工程、施工技術、品質管理等專業內容，分享行業最新技術發展。</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">閱讀更多</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="blog-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>trending_up</mat-icon>
            <mat-card-title>行業動態</mat-card-title>
            <mat-card-subtitle>2024-12-18</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>關注建築行業發展趨勢，分析市場變化，為客戶提供前瞻性的建議。</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">閱讀更多</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="blog-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>business</mat-icon>
            <mat-card-title>公司資訊</mat-card-title>
            <mat-card-subtitle>2024-12-17</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>分享公司最新動態、項目進展、團隊建設等相關資訊。</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">閱讀更多</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .blog-page {
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
    }

    .blog-card {
      height: 100%;
    }

    .blog-card mat-card-header {
      margin-bottom: 16px;
    }

    .blog-card mat-icon {
      font-size: 2rem;
      color: #1976d2;
    }

    .blog-card mat-card-content {
      margin-bottom: 16px;
    }
  `]
})
export class PublicBlogPageComponent {}


