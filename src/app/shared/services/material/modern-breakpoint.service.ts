/**
 * @fileoverview 現代化斷點服務，使用 Angular 20 Signal 和 CDK BreakpointObserver 提供響應式佈局狀態
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2024-12-19 by NG-AC Team
 *
 * 📋 檔案性質：
 * • 類型：Shared Layer - Service
 * • 依賴：@angular/cdk/layout, @angular/core
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 只負責斷點觀察和狀態管理
 * • 不包含具體的佈局邏輯
 *
 * @module ModernBreakpointService
 * @layer Shared
 * @context Layout System
 * @see docs/5.new_Tree_layout.md
 */

import { Injectable, computed, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({ providedIn: 'root' })
export class ModernBreakpointService {
  private readonly bo = inject(BreakpointObserver);
  
  readonly isHandset = signal(this.bo.isMatched(Breakpoints.Handset));
  readonly isTablet = signal(this.bo.isMatched(Breakpoints.Tablet));
  readonly isWeb = signal(this.bo.isMatched(Breakpoints.Web));
  
  readonly layout = computed(() => ({
    isHandset: this.isHandset(),
    isTablet: this.isTablet(),
    isWeb: this.isWeb(),
    isMobile: this.isHandset() || this.isTablet(),
    isDesktop: this.isWeb()
  }));
}
