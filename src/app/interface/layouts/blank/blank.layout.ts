/**
 * @fileoverview 空白佈局組件 (Blank Layout Component)
 * @description 使用Angular Material實現的空白頁面佈局
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Blank Layout
 * - 職責：空白頁面佈局管理，使用Material Design
 * - 依賴：Angular Core, Router, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現空白佈局
 * - 採用極簡主義設計，避免過度複雜化
 * - 提供乾淨的空白佈局，適合簡單頁面
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
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .blank-layout {
      min-height: 100vh;
      width: 100%;
    }
  `]
})
export class BlankLayoutComponent {}
