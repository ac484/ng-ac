/**
 * App Shell 主組件
 * 負責渲染應用骨架的主要佈局
 *
 * @author NG-AC Team
 * @since 2024-12-19
 * @version 1.0.0
 */

import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShellService, OfflineService } from '../../../application/services/app-shell';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-shell" [class.theme-dark]="appShellService.currentTheme() === 'dark'">
      <header class="app-header">
        <nav class="app-nav">
          <div class="nav-brand">NG-AC</div>
          <div class="nav-actions">
            <button (click)="toggleTheme()">Theme</button>
            <button (click)="toggleSidebar()">Menu</button>
            <span [class.offline]="!offlineService.isOnline()">
              {{ offlineService.isOnline() ? 'Online' : 'Offline' }}
            </span>
          </div>
        </nav>
      </header>

      <div class="app-content">
        <aside class="app-sidebar" [class.open]="appShellService.sidebarOpen()">
          <div class="sidebar-content">
            <h3>Navigation</h3>
            <ul>
              <li>Dashboard</li>
              <li>Users</li>
              <li>Settings</li>
            </ul>
          </div>
        </aside>

        <main class="app-main">
          <router-outlet />
        </main>
      </div>

      <footer class="app-footer">
        <p>&copy; 2024 NG-AC Enterprise Admin</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background: #1976d2;
      color: white;
      padding: 1rem;
    }

    .app-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .app-content {
      display: flex;
      flex: 1;
    }

    .app-sidebar {
      width: 250px;
      background: #f5f5f5;
      padding: 1rem;
      display: none;
    }

    .app-sidebar.open {
      display: block;
    }

    .app-main {
      flex: 1;
      padding: 1rem;
    }

    .app-footer {
      background: #f5f5f5;
      padding: 1rem;
      text-align: center;
    }

    .offline {
      color: #f44336;
    }

    @media (max-width: 768px) {
      .app-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        z-index: 1000;
      }
    }
  `]
})
export class AppShellComponent {
  protected readonly appShellService = inject(AppShellService);
  protected readonly offlineService = inject(OfflineService);

  toggleTheme(): void {
    this.appShellService.toggleTheme();
  }

  toggleSidebar(): void {
    this.appShellService.toggleSidebar();
  }
}
