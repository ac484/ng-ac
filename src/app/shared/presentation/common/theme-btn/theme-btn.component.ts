import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SettingsService } from '@delon/theme';

@Component({
    selector: 'app-theme-btn',
    template: `
    <button
      nz-button
      nzType="text"
      nz-tooltip
      nzTooltipTitle="切換主題"
      nzTooltipPlacement="left"
      (click)="toggleTheme()"
      class="theme-btn"
    >
      <i nz-icon [nzType]="isDarkTheme ? 'sunny' : 'moon'"></i>
    </button>
  `,
    styles: [`
    .theme-btn {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 1000;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.3s;
    }
    
    .theme-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  `],
    imports: [NzButtonModule, NzIconModule, NzToolTipModule],
    standalone: true
})
export class ThemeBtnComponent {
    private readonly settings = inject(SettingsService);

    get isDarkTheme(): boolean {
        return this.settings.layout.theme === 'dark';
    }

    toggleTheme(): void {
        const currentTheme = this.settings.layout.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.settings.setLayout('theme', newTheme);
    }
}
