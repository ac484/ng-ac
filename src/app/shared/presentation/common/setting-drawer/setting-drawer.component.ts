import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SettingsService } from '@delon/theme';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-setting-drawer',
    template: `
    <button
      nz-button
      nzType="text"
      nz-tooltip
      nzTooltipTitle="主題設置"
      nzTooltipPlacement="left"
      (click)="open()"
      class="setting-btn"
    >
      <i nz-icon nzType="setting"></i>
    </button>

    <nz-drawer
      nzTitle="主題設置"
      [nzVisible]="visible"
      nzPlacement="right"
      [nzWidth]="300"
      (nzOnClose)="close()"
    >
      <div class="setting-content">
        <nz-card nzTitle="主題模式" [nzSize]="'small'">
          <nz-radio-group [(ngModel)]="currentTheme" (ngModelChange)="onThemeChange($event)">
            <label nz-radio value="light">淺色主題</label>
            <label nz-radio value="dark">深色主題</label>
          </nz-radio-group>
        </nz-card>

        <nz-card nzTitle="導航模式" [nzSize]="'small'">
          <nz-radio-group [(ngModel)]="currentMode" (ngModelChange)="onModeChange($event)">
            <label nz-radio value="side">側邊導航</label>
            <label nz-radio value="top">頂部導航</label>
            <label nz-radio value="mixin">混合導航</label>
          </nz-radio-group>
        </nz-card>

        <nz-card nzTitle="主題色彩" [nzSize]="'small'">
          <nz-select
            [(ngModel)]="currentColor"
            (ngModelChange)="onColorChange($event)"
            nzPlaceHolder="選擇主題色彩"
            style="width: 100%"
          >
            <nz-option nzValue="blue" nzLabel="藍色"></nz-option>
            <nz-option nzValue="green" nzLabel="綠色"></nz-option>
            <nz-option nzValue="red" nzLabel="紅色"></nz-option>
            <nz-option nzValue="orange" nzLabel="橙色"></nz-option>
            <nz-option nzValue="purple" nzLabel="紫色"></nz-option>
          </nz-select>
        </nz-card>

        <nz-card nzTitle="特殊效果" [nzSize]="'small'">
          <div class="setting-item">
            <span>色弱模式</span>
            <nz-switch [(ngModel)]="colorWeak" (ngModelChange)="onColorWeakChange($event)"></nz-switch>
          </div>
          <div class="setting-item">
            <span>灰色主題</span>
            <nz-switch [(ngModel)]="greyTheme" (ngModelChange)="onGreyThemeChange($event)"></nz-switch>
          </div>
        </nz-card>
      </div>
    </nz-drawer>
  `,
    styles: [`
    .setting-btn {
      position: fixed;
      right: 20px;
      bottom: 80px;
      z-index: 1000;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: all 0.3s;
    }
    
    .setting-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .setting-content {
      padding: 16px;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    nz-card {
      margin-bottom: 16px;
    }

    nz-radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `],
    imports: [
        NzButtonModule,
        NzDrawerModule,
        NzCardModule,
        NzFormModule,
        NzRadioModule,
        NzSelectModule,
        NzSwitchModule,
        NzIconModule,
        NzToolTipModule,
        FormsModule
    ],
    standalone: true
})
export class SettingDrawerComponent {
    private readonly settings = inject(SettingsService);

    visible = false;
    currentTheme = 'light';
    currentMode = 'side';
    currentColor = 'blue';
    colorWeak = false;
    greyTheme = false;

    ngOnInit(): void {
        // 初始化設置
        this.currentTheme = this.settings.layout.theme || 'light';
        this.currentMode = this.settings.layout.mode || 'side';
        this.currentColor = this.settings.layout.color || 'blue';
        this.colorWeak = this.settings.layout.colorWeak || false;
        this.greyTheme = this.settings.layout.greyTheme || false;
    }

    open(): void {
        this.visible = true;
    }

    close(): void {
        this.visible = false;
    }

    onThemeChange(theme: string): void {
        this.settings.setLayout('theme', theme);
    }

    onModeChange(mode: string): void {
        this.settings.setLayout('mode', mode);
    }

    onColorChange(color: string): void {
        this.settings.setLayout('color', color);
    }

    onColorWeakChange(colorWeak: boolean): void {
        this.settings.setLayout('colorWeak', colorWeak);
    }

    onGreyThemeChange(greyTheme: boolean): void {
        this.settings.setLayout('greyTheme', greyTheme);
    }
}
