/**
 * @fileoverview 現代化 App Shell 組件，使用 Material 3 sidenav 和 Container Queries 實現響應式佈局
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2024-12-19 by NG-AC Team
 *
 * 📋 檔案性質：
 * • 類型：Interface Layer - Component
 * • 依賴：ModernBreakpointService, @angular/material/sidenav
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 只負責 App Shell 的佈局渲染
 * • 不包含具體的業務邏輯
 *
 * @module AppShellModernComponent
 * @layer Interface
 * @context Layout System
 * @see docs/5.new_Tree_layout.md
 */

import { ModernBreakpointService } from '@/app/shared/services/material/modern-breakpoint.service';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';

@Component({
  selector: 'app-shell-modern',
  standalone: true,
  template: `
    <mat-sidenav-container class="app-shell cq cq-medium">
      <mat-sidenav #drawer [mode]="(bps.layout().isMobile ? 'over' : 'side')" [opened]="!bps.layout().isMobile">
        <ng-content select="[shell-sidenav]"></ng-content>
      </mat-sidenav>
      <mat-sidenav-content>
        <ng-content />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .app-shell { height: 100vh; }
    mat-sidenav { width: 256px; }
    @container (max-width: 600px) { mat-sidenav { width: 208px; } }
  `]
})
export class AppShellModernComponent {
  constructor(public readonly bps: ModernBreakpointService) {}

  @ViewChild('drawer') drawer?: MatSidenav;
  @ViewChild(MatSidenavContainer) container?: MatSidenavContainer;
}
