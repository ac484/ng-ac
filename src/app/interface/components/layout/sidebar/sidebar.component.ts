/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "極簡側邊欄組件-導航菜單",
 *   "constraints": ["Standalone組件", "OnPush策略", "現代控制流程"],
 *   "dependencies": ["MatListModule", "MatIconModule", "RouterModule", "NavigationService"],
 *   "security": "medium",
 *   "lastmod": "2025-01-18"
 * }
 * @usage <app-sidebar></app-sidebar>
 * @see docs/architecture/interface.md
 */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../../../application/services/navigation.service';
import { SidebarItem } from '../../../../shared/interfaces/layout/sidebar.interface';

// 使用 SidebarItem 類型，與常數文件保持一致
export type NavigationItem = SidebarItem;

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
        @for (item of navigationItems(); track item.id) {
          <div class="nav-item">
            @if (item.children?.length) {
              <mat-list-item class="nav-group" (click)="toggle(item.id)">
                <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                <span matListItemTitle>{{ item.label }}</span>
                <span class="spacer"></span>
                <mat-icon>{{ isOpen(item.id) ? 'expand_less' : 'expand_more' }}</mat-icon>
              </mat-list-item>

              @if (isOpen(item.id)) {
                @for (child of item.children; track child.id) {
                  <mat-list-item
                    class="nav-child"
                    [routerLink]="child.route"
                    routerLinkActive="active">
                    <mat-icon matListItemIcon>{{ child.icon }}</mat-icon>
                    <span matListItemTitle>{{ child.label }}</span>
                  </mat-list-item>
                }
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

    .nav-group { font-weight: 500; color: var(--mat-sys-primary); cursor: pointer; }

    .nav-child {
      padding-left: 2rem;
      font-size: 0.9rem;
    }

    .spacer { flex: 1 1 auto; }

    .active {
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }
  `]
})
export class SidebarComponent {
  private readonly navigationService = inject(NavigationService);

  readonly navigationItems = this.navigationService.navigationItems;

  private readonly openGroups = signal<Record<string, boolean>>({});

  isOpen(id: string): boolean {
    return !!this.openGroups()[id];
  }

  toggle(id: string): void {
    const state = { ...this.openGroups() };
    state[id] = !state[id];
    this.openGroups.set(state);
  }
}
