/**
 * @fileoverview 公開資訊／案例 頁面 (Public/Cases Page)
 * @description 成功案例/客戶故事頁面，展示我們的專業能力和項目成果
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
  selector: 'app-public-cases',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="cases-page">
      <div class="hero-section">
        <h1>成功案例/客戶故事</h1>
        <p class="subtitle">展示我們的專業能力和項目成果</p>
      </div>

      <div class="content-section">
        <mat-card class="case-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>business</mat-icon>
            <mat-card-title>商業建築</mat-card-title>
            <mat-card-subtitle>辦公大樓項目</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>包括各類商業建築項目，展示我們在辦公大樓、購物中心等商業建築領域的專業能力。</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">查看詳情</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="case-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>home</mat-icon>
            <mat-card-title>住宅項目</mat-card-title>
            <mat-card-subtitle>高品質住宅</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>涵蓋各類住宅項目，從單戶住宅到大型住宅社區，體現我們對品質的追求。</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">查看詳情</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="case-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>infrastructure</mat-icon>
            <mat-card-title>基礎設施</mat-card-title>
            <mat-card-subtitle>公共工程</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>包括道路、橋樑、水利等基礎設施項目，展現我們在公共工程領域的技術實力。</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">查看詳情</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .cases-page {
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

    .case-card {
      height: 100%;
    }

    .case-card mat-card-header {
      margin-bottom: 16px;
    }

    .case-card mat-icon {
      font-size: 2rem;
      color: #1976d2;
    }

    .case-card mat-card-content {
      margin-bottom: 16px;
    }
  `]
})
export class PublicCasesPageComponent {}


