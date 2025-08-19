/**
 * @fileoverview 頁腳組件 (Footer Component)
 * @description 使用Angular Material實現的超極簡頁腳組件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Layout Component
 * - 職責：超極簡頁腳組件，一行解決
 * - 依賴：Angular Core, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現頁腳
 * - 採用超極簡主義設計，一行解決
 * - 只提供最基本的頁腳功能
 *
 * @module FooterComponent
 * @layer Interface
 * @context Layout - Footer
 * @see docs/0.FILE_HEADER_CONVENTION.md
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `<footer style="background: #f5f5f5; border-top: 1px solid #e0e0e0; padding: 16px; text-align: center; color: #666; font-size: 0.9rem;">&copy; {{currentYear}} NG-AC Team. All rights reserved.</footer>`,
  styles: [``]
})
export class FooterComponent {
  get currentYear(): number { return new Date().getFullYear(); }
}
