import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { ThemeSwitcherComponent } from '../../../../../shared/presentation/components/theme-switcher/theme-switcher.component';
import { ThemeService, ThemeConfig } from '../../../../../shared/infrastructure/services/theme.service';

@Component({
    selector: 'app-theme-demo',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzCardModule,
        NzButtonModule,
        NzInputModule,
        NzSelectModule,
        NzCheckboxModule,
        NzRadioModule,
        NzSwitchModule,
        NzSliderModule,
        NzProgressModule,
        NzAlertModule,
        NzTabsModule,
        NzPaginationModule,
        NzMenuModule,
        ThemeSwitcherComponent
    ],
    template: `
    <div class="theme-demo-container">
      <nz-card nzTitle="主題切換演示" [nzExtra]="themeSwitcher">
        <div class="demo-section">
          <h3>主題切換器</h3>
          <p>點擊右上角的主題切換器來體驗不同的主題效果</p>
        </div>

        <div class="demo-section">
          <h3>按鈕組件</h3>
          <div class="component-demo">
            <nz-button nzType="primary">主要按鈕</nz-button>
            <nz-button nzType="default">默認按鈕</nz-button>
            <nz-button nzType="dashed">虛線按鈕</nz-button>
            <nz-button nzType="text">文字按鈕</nz-button>
            <nz-button nzType="link">鏈接按鈕</nz-button>
          </div>
        </div>

        <div class="demo-section">
          <h3>表單組件</h3>
          <div class="component-demo">
                         <nz-input nzPlaceholder="請輸入內容" style="width: 200px; margin-right: 16px;"></nz-input>
             <nz-select nzPlaceholder="請選擇" style="width: 200px; margin-right: 16px;">
              <nz-option nzValue="option1" nzLabel="選項 1"></nz-option>
              <nz-option nzValue="option2" nzLabel="選項 2"></nz-option>
              <nz-option nzValue="option3" nzLabel="選項 3"></nz-option>
            </nz-select>
          </div>
        </div>

        <div class="demo-section">
          <h3>選擇組件</h3>
          <div class="component-demo">
            <label nz-checkbox [(ngModel)]="checkboxValue">複選框</label>
            <label nz-radio [(ngModel)]="radioValue" nzValue="A">單選框 A</label>
            <label nz-radio [(ngModel)]="radioValue" nzValue="B">單選框 B</label>
            <nz-switch [(ngModel)]="switchValue"></nz-switch>
          </div>
        </div>

        <div class="demo-section">
          <h3>進度組件</h3>
          <div class="component-demo">
            <nz-slider [(ngModel)]="sliderValue" [nzMax]="100"></nz-slider>
            <nz-progress [nzPercent]="progressValue" nzType="circle"></nz-progress>
          </div>
        </div>

        <div class="demo-section">
          <h3>提示組件</h3>
          <div class="component-demo">
            <nz-alert nzType="success" nzMessage="成功提示" nzShowIcon></nz-alert>
            <nz-alert nzType="info" nzMessage="信息提示" nzShowIcon></nz-alert>
            <nz-alert nzType="warning" nzMessage="警告提示" nzShowIcon></nz-alert>
            <nz-alert nzType="error" nzMessage="錯誤提示" nzShowIcon></nz-alert>
          </div>
        </div>

        <div class="demo-section">
          <h3>標籤頁組件</h3>
          <nz-tabset>
            <nz-tab nzTitle="標籤 1">
              <p>這是第一個標籤頁的內容</p>
            </nz-tab>
            <nz-tab nzTitle="標籤 2">
              <p>這是第二個標籤頁的內容</p>
            </nz-tab>
            <nz-tab nzTitle="標籤 3">
              <p>這是第三個標籤頁的內容</p>
            </nz-tab>
          </nz-tabset>
        </div>

        <div class="demo-section">
          <h3>分頁組件</h3>
          <nz-pagination [nzTotal]="100" [nzPageSize]="10"></nz-pagination>
        </div>

        <div class="demo-section">
          <h3>菜單組件</h3>
          <ul nz-menu nzMode="horizontal">
            <li nz-menu-item nzSelected>菜單項 1</li>
            <li nz-menu-item>菜單項 2</li>
            <li nz-menu-item>菜單項 3</li>
          </ul>
        </div>

        <div class="demo-section">
          <h3>當前主題信息</h3>
          <div class="theme-info">
            <p><strong>主題名稱：</strong>{{ currentTheme?.name }}</p>
            <p><strong>主題鍵值：</strong>{{ currentTheme?.key }}</p>
            <p><strong>主色調：</strong>{{ currentTheme?.primaryColor }}</p>
            <p><strong>描述：</strong>{{ currentTheme?.description }}</p>
          </div>
        </div>
      </nz-card>
    </div>

    <ng-template #themeSwitcher>
      <app-theme-switcher></app-theme-switcher>
    </ng-template>
  `,
    styles: [`
    .theme-demo-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .demo-section {
      margin-bottom: 32px;
      
      h3 {
        margin-bottom: 16px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
      }
    }

    .component-demo {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;
      margin-bottom: 16px;
    }

    .theme-info {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 6px;
      
      p {
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    // 深色主題適配
    .theme-dark {
      .theme-demo-container {
        background-color: #141414;
        color: rgba(255, 255, 255, 0.85);
      }
      
      .demo-section h3 {
        color: rgba(255, 255, 255, 0.85);
      }
      
      .theme-info {
        background-color: #1f1f1f;
        color: rgba(255, 255, 255, 0.85);
      }
    }
  `]
})
export class ThemeDemoComponent {
    private readonly themeService = inject(ThemeService);

    checkboxValue = false;
    radioValue = 'A';
    switchValue = false;
    sliderValue = 50;
    progressValue = 75;
    currentTheme: ThemeConfig | null = null;

    constructor() {
        this.themeService.currentTheme$.subscribe((theme: ThemeConfig) => {
            this.currentTheme = theme;
        });
    }
}
