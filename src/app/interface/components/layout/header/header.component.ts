/**
 * @fileoverview 頭部組件 (Header Component)
 * @description 使用Angular Material實現的超極簡頭部組件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Layout Component
 * - 職責：超極簡頭部組件，一行解決
 * - 依賴：Angular Core, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現頭部
 * - 採用超極簡主義設計，一行解決
 * - 只提供最基本的頭部功能
 */

import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule],
  template: `<mat-toolbar color="primary"><span>{{title}}</span><span style="flex: 1 1 auto;"></span><button mat-button>登出</button></mat-toolbar>`,
  styles: [``]
})
export class HeaderComponent {
  @Input() title: string = 'NG-AC Admin';
}
