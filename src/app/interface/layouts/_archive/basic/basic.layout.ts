/**
 * @fileoverview 基礎佈局組件 (Basic Layout Component)
 * @description 使用Angular CDK + Angular Material實現的基礎佈局
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Layout Component
 * - 職責：主要佈局管理，使用Material Design
 * - 依賴：Angular Core, Router, Angular Material, Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現佈局
 * - 採用極簡主義設計，避免過度複雜化
 * - 包含toolbar、sidenav和content三個主要區域
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-basic-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- 側邊導航 -->
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="'navigation'"
          [mode]="'side'"
          [opened]="true">
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/app/dashboard">
            <mat-icon>dashboard</mat-icon>
            <span>儀表板</span>
          </a>
          <a mat-list-item routerLink="/app/users">
            <mat-icon>people</mat-icon>
            <span>用戶管理</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <!-- 主要內容區域 -->
      <mat-sidenav-content class="sidenav-content">
        <!-- 頂部工具欄 -->
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="drawer.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>NG-AC Admin</span>
        </mat-toolbar>

        <!-- 頁面內容 -->
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 200px;
    }

    .sidenav .mat-toolbar {
      background: inherit;
    }

    .sidenav-content {
      display: flex;
      flex-direction: column;
    }

    .content {
      flex: 1;
      padding: 20px;
    }

    .mat-toolbar-row {
      display: flex;
      align-items: center;
    }

    .mat-toolbar-row span {
      margin-left: 10px;
    }

    .mat-nav-list a {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  `]
})
export class BasicLayoutComponent {}
