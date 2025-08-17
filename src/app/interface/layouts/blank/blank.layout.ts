/**
 * @fileoverview 空白佈局組件檔案 (Blank Layout Component)
 * @description 提供空白頁面的佈局容器
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Blank Layout Component
 * - 職責：空白頁面佈局容器
 * - 依賴：RouterOutlet
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用 Angular 20+ 和 Router
 * - 遵循極簡主義原則，只實現必要的功能
 * - 提供簡單的佈局容器
 *
 * @module BlankLayout
 * @layer Interface
 * @context Blank Layout Container
 * @see docs/0.FILE_HEADER_CONVENTION.md
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="blank-layout">
      <main class="blank-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .blank-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .blank-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class BlankLayoutComponent {
  // 空白佈局組件邏輯
  // 目前不需要額外的業務邏輯
}
