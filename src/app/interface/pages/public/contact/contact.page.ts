/**
 * @fileoverview 公開資訊／聯繫我們 頁面 (Public/Contact Page)
 * @description 聯絡我們頁面，提供業務團隊、技術支援或人力資源部門的聯絡方式
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
  selector: 'app-public-contact',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="contact-page">
      <div class="hero-section">
        <h1>聯絡我們</h1>
        <p class="subtitle">我們隨時準備為您提供專業的服務和支援</p>
      </div>

      <div class="content-section">
        <mat-card class="contact-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>business_center</mat-icon>
            <mat-card-title>業務團隊</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>專業的業務團隊為您提供項目諮詢、報價和合作洽談服務。</p>
            <p><strong>電話：</strong>+886 2 1234 5678</p>
            <p><strong>郵箱：</strong>business&#64;ng-ac.com</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary">聯繫業務</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="contact-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>support_agent</mat-icon>
            <mat-card-title>技術支援</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>技術團隊提供專業的工程技術支援和解決方案諮詢。</p>
            <p><strong>電話：</strong>+886 2 1234 5679</p>
            <p><strong>郵箱：</strong>tech&#64;ng-ac.com</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary">技術諮詢</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="contact-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>people</mat-icon>
            <mat-card-title>人力資源</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>人力資源部門處理人才招募、合作夥伴等相關事宜。</p>
            <p><strong>電話：</strong>+886 2 1234 5680</p>
            <p><strong>郵箱：</strong>hr&#64;ng-ac.com</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary">人才招募</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .contact-page {
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

    .contact-card {
      height: 100%;
    }

    .contact-card mat-card-header {
      margin-bottom: 16px;
    }

    .contact-card mat-icon {
      font-size: 2rem;
      color: #1976d2;
    }

    .contact-card mat-card-content {
      margin-bottom: 16px;
    }

    .contact-card p {
      margin: 8px 0;
    }
  `]
})
export class PublicContactPageComponent {}


