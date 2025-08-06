import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ThemeService } from '../../application/theme/theme.service';
import { ThemeSettings, ThemeType, ThemeMode } from '../../domain/theme/theme.entity';

@Component({
  selector: 'app-theme-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzCardModule,
    NzSwitchModule,
    NzSelectModule,
    NzColorPickerModule,
    NzDividerModule,
    NzIconModule,
    NzToolTipModule
  ],
  template: `
    <nz-card nzTitle="主題設置" [nzExtra]="extraTemplate">
      <ng-template #extraTemplate>
        <button nz-button nzType="default" nzSize="small" (click)="resetToDefault()">
          <i nz-icon nzType="reload"></i>
          重置
        </button>
      </ng-template>

      <!-- 主題模式 -->
      <div class="setting-section">
        <h4>主題模式</h4>
        <div class="theme-options">
          <div 
            class="theme-option" 
            [class.active]="settings?.theme === 'light'"
            (click)="toggleTheme()"
            nz-tooltip
            nzTooltipTitle="亮色主題"
          >
            <div class="theme-preview light-theme">
              <div class="header"></div>
              <div class="sidebar"></div>
              <div class="content"></div>
            </div>
            <span>亮色</span>
          </div>
          
          <div 
            class="theme-option" 
            [class.active]="settings?.theme === 'dark'"
            (click)="toggleTheme()"
            nz-tooltip
            nzTooltipTitle="暗色主題"
          >
            <div class="theme-preview dark-theme">
              <div class="header"></div>
              <div class="sidebar"></div>
              <div class="content"></div>
            </div>
            <span>暗色</span>
          </div>
        </div>
      </div>

      <nz-divider></nz-divider>

      <!-- 主色調 -->
      <div class="setting-section">
        <h4>主色調</h4>
        <nz-color-picker 
          [(ngModel)]="primaryColor" 
          (ngModelChange)="updatePrimaryColor($event)"
          nzShowText
        ></nz-color-picker>
      </div>

      <nz-divider></nz-divider>

      <!-- 導航模式 -->
      <div class="setting-section">
        <h4>導航模式</h4>
        <nz-select 
          [(ngModel)]="navigationMode" 
          (ngModelChange)="updateNavigationMode($event)"
          style="width: 200px;"
        >
          <nz-option nzValue="side" nzLabel="側邊導航"></nz-option>
          <nz-option nzValue="top" nzLabel="頂部導航"></nz-option>
          <nz-option nzValue="mixin" nzLabel="混合模式"></nz-option>
        </nz-select>
      </div>

      <nz-divider></nz-divider>

      <!-- 佈局設置 -->
      <div class="setting-section">
        <h4>佈局設置</h4>
        <div class="layout-settings">
          <div class="setting-item">
            <span>固定頭部</span>
            <nz-switch 
              [ngModel]="settings?.fixedHead" 
              (ngModelChange)="updateLayoutSetting('fixedHead', $event)"
            ></nz-switch>
          </div>
          
          <div class="setting-item">
            <span>固定側邊欄</span>
            <nz-switch 
              [ngModel]="settings?.fixedLeftNav" 
              (ngModelChange)="updateLayoutSetting('fixedLeftNav', $event)"
            ></nz-switch>
          </div>
          
          <div class="setting-item">
            <span>顯示多頁簽</span>
            <nz-switch 
              [ngModel]="settings?.isShowTab" 
              (ngModelChange)="updateLayoutSetting('isShowTab', $event)"
            ></nz-switch>
          </div>
          
          <div class="setting-item">
            <span>固定頁簽</span>
            <nz-switch 
              [ngModel]="settings?.fixedTab" 
              (ngModelChange)="updateLayoutSetting('fixedTab', $event)"
              [nzDisabled]="!settings?.fixedHead"
            ></nz-switch>
          </div>
        </div>
      </div>

      <nz-divider></nz-divider>

      <!-- 特殊模式 -->
      <div class="setting-section">
        <h4>特殊模式</h4>
        <div class="special-settings">
          <div class="setting-item">
            <span>色弱模式</span>
            <nz-switch 
              [ngModel]="settings?.colorWeak" 
              (ngModelChange)="toggleSpecialTheme('colorWeak', $event)"
            ></nz-switch>
          </div>
          
          <div class="setting-item">
            <span>灰色模式</span>
            <nz-switch 
              [ngModel]="settings?.greyTheme" 
              (ngModelChange)="toggleSpecialTheme('greyTheme', $event)"
            ></nz-switch>
          </div>
        </div>
      </div>
    </nz-card>
  `,
  styles: [`
    .setting-section {
      margin-bottom: 24px;
    }

    .setting-section h4 {
      margin-bottom: 16px;
      color: var(--text-color);
      font-weight: 500;
    }

    .theme-options {
      display: flex;
      gap: 16px;
    }

    .theme-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 12px;
      border-radius: 8px;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .theme-option:hover {
      border-color: var(--primary-color);
    }

    .theme-option.active {
      border-color: var(--primary-color);
      background-color: var(--background-color-light);
    }

    .theme-preview {
      width: 60px;
      height: 40px;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
    }

    .light-theme {
      background-color: #f0f2f5;
    }

    .dark-theme {
      background-color: #141414;
    }

    .theme-preview .header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 8px;
      background-color: var(--primary-color);
    }

    .theme-preview .sidebar {
      position: absolute;
      left: 0;
      top: 8px;
      width: 12px;
      height: 32px;
      background-color: var(--border-color);
    }

    .theme-preview .content {
      position: absolute;
      left: 12px;
      top: 8px;
      right: 0;
      height: 32px;
      background-color: var(--background-color);
    }

    .layout-settings,
    .special-settings {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }

    .setting-item span {
      color: var(--text-color);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSettingsComponent {
  private readonly themeService = inject(ThemeService);
  private readonly message = inject(NzMessageService);

  settings: ThemeSettings | null = null;
  primaryColor = '#1890FF';
  navigationMode: ThemeMode = 'side';

  constructor() {
    this.themeService.settings$.subscribe(settings => {
      this.settings = settings;
      if (settings) {
        this.primaryColor = settings.color;
        this.navigationMode = settings.mode;
      }
    });
  }

  async toggleTheme(): Promise<void> {
    try {
      await this.themeService.toggleTheme();
      this.message.success('主題切換成功');
    } catch (error) {
      this.message.error('主題切換失敗');
    }
  }

  async updatePrimaryColor(color: string): Promise<void> {
    try {
      await this.themeService.updatePrimaryColor(color);
      this.message.success('主色調更新成功');
    } catch (error) {
      this.message.error('主色調更新失敗');
    }
  }

  async updateNavigationMode(mode: ThemeMode): Promise<void> {
    try {
      await this.themeService.updateNavigationMode(mode);
      this.message.success('導航模式更新成功');
    } catch (error) {
      this.message.error('導航模式更新失敗');
    }
  }

  async updateLayoutSetting(key: keyof ThemeSettings, value: boolean): Promise<void> {
    try {
      await this.themeService.updateLayoutSetting(key, value);
      this.message.success('佈局設置更新成功');
    } catch (error) {
      this.message.error('佈局設置更新失敗');
    }
  }

  async toggleSpecialTheme(type: 'colorWeak' | 'greyTheme', value: boolean): Promise<void> {
    try {
      await this.themeService.toggleSpecialTheme(type);
      this.message.success('特殊模式切換成功');
    } catch (error) {
      this.message.error('特殊模式切換失敗');
    }
  }

  async resetToDefault(): Promise<void> {
    try {
      await this.themeService.resetToDefault();
      this.message.success('設置已重置為默認');
    } catch (error) {
      this.message.error('重置設置失敗');
    }
  }
} 