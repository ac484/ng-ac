import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ThemeService } from '../../application/theme/theme.service';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [
        CommonModule,
        NzButtonModule,
        NzIconModule,
        NzToolTipModule
    ],
    template: `
    <button 
      nz-button 
      nzType="text" 
      nzSize="small"
      (click)="toggleTheme()"
      nz-tooltip
      [nzTooltipTitle]="isDarkTheme ? '切換到亮色主題' : '切換到暗色主題'"
    >
      <i nz-icon [nzType]="isDarkTheme ? 'sun' : 'moon'"></i>
    </button>
  `,
    styles: [`
    :host {
      display: inline-block;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent {
    private readonly themeService = inject(ThemeService);
    private readonly message = inject(NzMessageService);

    isDarkTheme = false;

    constructor() {
        this.themeService.isDarkTheme$.subscribe(isDark => {
            this.isDarkTheme = isDark;
        });
    }

    async toggleTheme(): Promise<void> {
        try {
            await this.themeService.toggleTheme();
            this.message.success(this.isDarkTheme ? '已切換到亮色主題' : '已切換到暗色主題');
        } catch (error) {
            this.message.error('主題切換失敗');
        }
    }
} 