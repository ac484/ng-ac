/**
 * @ai-context {
 *   "role": "Interface/Layout",
 *   "purpose": "主應用布局-應用主要布局結構",
 *   "constraints": ["Standalone組件", "現代控制流程", "Deferrable Views"],
 *   "dependencies": ["RouterOutlet", "SidebarComponent", "UserMenuComponent"],
 *   "security": "medium",
 *   "lastmod": "2025-01-18"
 * }
 * @usage <main-app-layout></main-app-layout>
 * @see docs/architecture/interface.md
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { UserMenuComponent } from '../../components/common/user-menu/user-menu.component';
import { SidebarComponent } from '../../components/layout/sidebar/sidebar.component';

@Component({
  selector: 'main-app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SidebarComponent,
    UserMenuComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-sidenav-container class="layout-container">
      <!-- 側邊欄 -->
      <mat-sidenav #sidenav mode="side" opened class="sidenav">
        <app-sidebar />
      </mat-sidenav>

      <!-- 主要內容區域 -->
      <mat-sidenav-content class="main-content">
        <!-- 頂部工具欄 -->
        <mat-toolbar class="toolbar">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>

          <span class="toolbar-title">NG-AC</span>

          <span class="toolbar-spacer"></span>

          <app-user-menu />
        </mat-toolbar>

        <!-- 路由內容 -->
        <div class="content-area">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .layout-container {
      height: 100vh;
      width: 100vw;
    }

    .sidenav {
      width: 280px;
    }

    .main-content {
      display: flex;
      flex-direction: column;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .toolbar-title {
      margin-left: 1rem;
      font-weight: 500;
    }

    .toolbar-spacer {
      flex: 1;
    }

    .content-area {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }
  `]
})
export class MainAppLayoutComponent {
  // 組件邏輯保持極簡
}


