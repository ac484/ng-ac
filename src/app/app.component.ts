/**
 * @fileoverview 應用根組件 (Root Component)
 * @description 主組件，通常是應用的入口組件，負責視圖渲染和組件承載
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Component
 * - 職責：視圖渲染、組件承載、路由承載
 * - 依賴：RouterOutlet, DDD 架構服務
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * DDD 架構說明：
 * - Interface Layer: 只負責基本的組件結構和路由承載
 * - 樣式將從 Shared Layer 引用
 * - 業務邏輯將從 Application Layer 引用
 * - 配置將從 Infrastructure Layer 引用
 * - 佈局將由各個頁面組件自己處理
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <!-- 簡化的根組件，只負責路由承載 -->
    <router-outlet />
  `,
  styles: [`
    /* 移除所有自定義樣式，避免與側邊欄衝突 */
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
    }
  `]
})
export class AppComponent {
  // 精簡的組件實現
  // 所有佈局邏輯將由各個頁面組件自己處理
  // 側邊欄組件將處理自己的佈局
}
