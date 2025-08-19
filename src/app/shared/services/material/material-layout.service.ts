/**
 * @fileoverview Material布局服務 (Material Layout Service)
 * @description 提供Material Design布局相關的服務功能
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Material Service
 * - 職責：Material布局服務管理
 * - 依賴：Angular CDK Layout
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案提供最精簡的Material布局服務
 * - 採用極簡主義設計，避免過度複雜化
 * - 使用Angular CDK的BreakpointObserver實現響應式布局
 */

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface LayoutBreakpoint {
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialLayoutService {

  constructor(private breakpointObserver: BreakpointObserver) {}

  /**
   * 獲取當前布局斷點信息
   */
  getLayoutBreakpoint(): Observable<LayoutBreakpoint> {
    return this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape,
      Breakpoints.TabletPortrait,
      Breakpoints.TabletLandscape,
      Breakpoints.WebPortrait,
      Breakpoints.WebLandscape
    ]).pipe(
      map(result => ({
        isHandset: result.breakpoints[Breakpoints.HandsetPortrait] ||
                   result.breakpoints[Breakpoints.HandsetLandscape],
        isTablet: result.breakpoints[Breakpoints.TabletPortrait] ||
                  result.breakpoints[Breakpoints.TabletLandscape],
        isWeb: result.breakpoints[Breakpoints.WebPortrait] ||
               result.breakpoints[Breakpoints.WebLandscape],
        isPortrait: result.breakpoints[Breakpoints.HandsetPortrait] ||
                    result.breakpoints[Breakpoints.TabletPortrait] ||
                    result.breakpoints[Breakpoints.WebPortrait],
        isLandscape: result.breakpoints[Breakpoints.HandsetLandscape] ||
                     result.breakpoints[Breakpoints.TabletLandscape] ||
                     result.breakpoints[Breakpoints.WebLandscape]
      }))
    );
  }

  /**
   * 檢查是否為手機設備
   */
  isHandset(): Observable<boolean> {
    return this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(map(result => result.matches));
  }

  /**
   * 檢查是否為平板設備
   */
  isTablet(): Observable<boolean> {
    return this.breakpointObserver.observe(Breakpoints.Tablet)
      .pipe(map(result => result.matches));
  }

  /**
   * 檢查是否為桌面設備
   */
  isWeb(): Observable<boolean> {
    return this.breakpointObserver.observe(Breakpoints.Web)
      .pipe(map(result => result.matches));
  }

  /**
   * 檢查是否為豎屏模式
   */
  isPortrait(): Observable<boolean> {
    return this.breakpointObserver.observe('(orientation: portrait)')
      .pipe(map(result => result.matches));
  }

  /**
   * 檢查是否為橫屏模式
   */
  isLandscape(): Observable<boolean> {
    return this.breakpointObserver.observe('(orientation: landscape)')
      .pipe(map(result => result.matches));
  }
}
