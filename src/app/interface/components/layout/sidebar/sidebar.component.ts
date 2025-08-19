/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "極簡側邊欄組件-導航菜單",
 *   "constraints": ["Standalone組件", "OnPush策略", "現代控制流程"],
 *   "dependencies": ["MatListModule", "MatIconModule", "RouterModule"],
 *   "security": "medium",
 *   "lastmod": "2025-01-18"
 * }
 * @usage <app-sidebar></app-sidebar>
 * @see docs/architecture/interface.md
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

export interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  children?: NavigationItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sidebar-container">
      <div class="sidebar-header">
        <h2>NG-AC</h2>
        <p>極簡主義 DDD 架構</p>
      </div>

      <mat-divider />

      <nav class="sidebar-nav">
        @for (item of navigationItems(); track item.route) {
          <div class="nav-item">
            @if (item.children) {
              <mat-list-item class="nav-group">
                <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                <span matListItemTitle>{{ item.label }}</span>
              </mat-list-item>

              @for (child of item.children; track child.route) {
                <mat-list-item
                  class="nav-child"
                  [routerLink]="child.route"
                  routerLinkActive="active">
                  <mat-icon matListItemIcon>{{ child.icon }}</mat-icon>
                  <span matListItemTitle>{{ child.label }}</span>
                </mat-list-item>
              }
            } @else {
              <mat-list-item
                [routerLink]="item.route"
                routerLinkActive="active">
                <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                <span matListItemTitle>{{ item.label }}</span>
              </mat-list-item>
            }
          </div>
        }
      </nav>
    </div>
  `,
  styles: [`
    .sidebar-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 1rem;
      text-align: center;

      h2 {
        margin: 0;
        color: var(--mat-sys-primary);
      }

      p {
        margin: 0.5rem 0 0 0;
        font-size: 0.8rem;
        color: var(--mat-sys-on-surface-variant);
      }
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
    }

    .nav-item {
      margin-bottom: 0.5rem;
    }

    .nav-group {
      font-weight: 500;
      color: var(--mat-sys-primary);
    }

    .nav-child {
      padding-left: 2rem;
      font-size: 0.9rem;
    }

    .active {
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }
  `]
})
export class SidebarComponent {
  // 導航項目 - 使用 Signals 管理
  private readonly _navigationItems = signal<NavigationItem[]>([
    {
      label: '儀表板',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: '用戶管理',
      icon: 'people',
      route: '/users',
      children: [
        { label: '用戶列表', icon: 'list', route: '/users' },
        { label: '新增用戶', icon: 'person_add', route: '/users/create' }
      ]
    },
    {
      label: '合約管理',
      icon: 'description',
      route: '/contracts'
    },
    {
      label: '設置',
      icon: 'settings',
      route: '/settings'
    }
  ]);

  readonly navigationItems = this._navigationItems.asReadonly();
}
