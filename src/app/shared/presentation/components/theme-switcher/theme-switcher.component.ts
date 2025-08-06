import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ThemeService, ThemeConfig } from '../../../infrastructure/services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [
    CommonModule,
    NzDropDownModule,
    NzButtonModule,
    NzIconModule,
    NzMenuModule,
    NzToolTipModule
  ],
  template: `
    <nz-dropdown
      [nzDropdownMenu]="menu"
      nzPlacement="bottomRight"
      [nzTrigger]="'click'">
      <button
        nz-button
        nzType="text"
        nz-tooltip
        nzTooltipTitle="切換主題"
        class="theme-switcher-btn">
        <span nz-icon nzType="skin" nzTheme="outline"></span>
        <span class="theme-name">{{ currentTheme?.name }}</span>
      </button>
    </nz-dropdown>

    <nz-dropdown-menu #menu="nzDropdownMenu">
      <ul nz-menu>
        @for (theme of availableThemes; track theme.key) {
          <li
            nz-menu-item
            [class.active]="theme.key === currentTheme?.key"
            (click)="switchTheme(theme.key)">
            <div class="theme-item">
              <div class="theme-color" [style.background-color]="theme.primaryColor"></div>
              <div class="theme-info">
                <div class="theme-name">{{ theme.name }}</div>
                <div class="theme-description">{{ theme.description }}</div>
              </div>
              @if (theme.key === currentTheme?.key) {
                <span nz-icon nzType="check" class="active-icon"></span>
              }
            </div>
          </li>
        }
      </ul>
    </nz-dropdown-menu>
  `,
  styles: [`
    .theme-switcher-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 32px;
      padding: 0 12px;
      border-radius: 6px;
      transition: all 0.3s;
    }

    .theme-switcher-btn:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .theme-name {
      font-size: 14px;
      font-weight: 500;
    }

    .theme-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      width: 100%;
    }

    .theme-color {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .theme-info {
      flex: 1;
      min-width: 0;
    }

    .theme-info .theme-name {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 2px;
    }

    .theme-info .theme-description {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 1.2;
    }

    .active-icon {
      color: #1890ff;
      font-size: 14px;
    }

    li[nz-menu-item].active {
      background-color: #f0f9ff;
    }

    li[nz-menu-item]:hover {
      background-color: #f5f5f5;
    }
  `]
})
export class ThemeSwitcherComponent {
  private readonly themeService = inject(ThemeService);

  currentTheme$ = this.themeService.currentTheme$;
  currentTheme: ThemeConfig | null = null;
  availableThemes: ThemeConfig[] = [];

  constructor() {
    this.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    this.availableThemes = this.themeService.getAvailableThemes();
  }

  switchTheme(themeKey: string): void {
    this.themeService.setTheme(themeKey);
  }
}
