/**
 * @fileoverview 公開資訊／職缺 頁面 (Public/Jobs Page)
 * @description 人才招募頁面，提供具有競爭力的薪酬福利、完善的培訓體系和清晰的職業發展路徑
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
  selector: 'app-public-jobs',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="jobs-page">
      <div class="hero-section">
        <h1>人才招募</h1>
        <p class="subtitle">加入我們的團隊，一起建設更美好的未來</p>
      </div>

      <div class="content-section">
        <mat-card class="job-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>engineering</mat-icon>
            <mat-card-title>工程師</mat-card-title>
            <mat-card-subtitle>全職 | 台北市</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>負責建築工程項目的技術設計、施工管理和品質控制。</p>
            <p><strong>要求：</strong>土木工程相關學歷，3年以上經驗</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary">立即申請</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="job-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>business_center</mat-icon>
            <mat-card-title>專案經理</mat-card-title>
            <mat-card-subtitle>全職 | 台北市</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>負責工程項目的整體規劃、進度控制和團隊協調。</p>
            <p><strong>要求：</strong>工程管理相關學歷，5年以上經驗</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary">立即申請</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="job-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>support_agent</mat-icon>
            <mat-card-title>技術支援</mat-card-title>
            <mat-card-subtitle>全職 | 台北市</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>提供客戶技術諮詢、問題解決和售後服務支援。</p>
            <p><strong>要求：</strong>工程相關學歷，2年以上經驗</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary">立即申請</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="benefits-section">
        <h2>我們的優勢</h2>
        <div class="benefits-grid">
          <div class="benefit-item">
            <mat-icon>attach_money</mat-icon>
            <h3>競爭力薪酬</h3>
            <p>提供具有市場競爭力的薪酬福利</p>
          </div>
          <div class="benefit-item">
            <mat-icon>school</mat-icon>
            <h3>完善培訓</h3>
            <p>完善的培訓體系和學習發展機會</p>
          </div>
          <div class="benefit-item">
            <mat-icon>trending_up</mat-icon>
            <h3>職業發展</h3>
            <p>清晰的職業發展路徑和晉升機會</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .jobs-page {
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

    .job-card {
      height: 100%;
    }

    .job-card mat-card-header {
      margin-bottom: 16px;
    }

    .job-card mat-icon {
      font-size: 2rem;
      color: #1976d2;
    }

    .job-card mat-card-content {
      margin-bottom: 16px;
    }

    .job-card p {
      margin: 8px 0;
    }

    .benefits-section {
      text-align: center;
      margin-top: 40px;
    }

    .benefits-section h2 {
      font-size: 2rem;
      color: #333;
      margin-bottom: 30px;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .benefit-item {
      padding: 20px;
      text-align: center;
    }

    .benefit-item mat-icon {
      font-size: 3rem;
      color: #1976d2;
      margin-bottom: 16px;
    }

    .benefit-item h3 {
      font-size: 1.3rem;
      color: #333;
      margin-bottom: 12px;
    }

    .benefit-item p {
      color: #666;
    }
  `]
})
export class PublicJobsPageComponent {}


