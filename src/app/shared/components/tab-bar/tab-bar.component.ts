import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Subject, takeUntil, filter } from 'rxjs';

import { TabService, TabData } from '../../services/tab.service';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [CommonModule, NzTabsModule, NzIconModule, NzButtonModule],
  template: `
    <div class="tab-bar">
      <nz-tabset
        [nzSelectedIndex]="activeTabIndex"
        (nzSelectedIndexChange)="onTabChange($event)"
        [nzType]="'card'"
        [nzAnimated]="false"
        [nzTabBarGutter]="0"
      >
        <nz-tab *ngFor="let tab of tabs; trackBy: trackByTabId" [nzTitle]="tabTitle" [nzClosable]="false">
          <ng-template #tabTitle>
            <div class="tab-title">
              <i *ngIf="tab.icon" nz-icon [nzType]="tab.icon"></i>
              <span>{{ tab.title }}</span>
              <!-- 自定義關閉按鈕 -->
              <button
                *ngIf="tab.closable"
                class="custom-close-btn"
                (click)="onCustomTabClose($event, tab)"
                nz-button
                nzType="text"
                nzSize="small"
                title="關閉標籤"
              >
                <i nz-icon nzType="close" nzTheme="outline"></i>
              </button>
            </div>
          </ng-template>
        </nz-tab>
      </nz-tabset>
    </div>
  `,
  styles: [
    `
      .tab-title {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
        max-width: 200px; /* 限制最大寬度，確保關閉按鈕有空間 */
      }

      .tab-title span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1; /* 讓文字部分佔用剩餘空間 */
        min-width: 0; /* 允許收縮 */
      }

      :host ::ng-deep .ant-tabs-content-holder {
        display: none;
      }

      /* 自定義關閉按鈕樣式 */
      :host ::ng-deep .ant-tabs-tab-remove {
        display: flex !important;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        margin-left: 8px;
        border-radius: 2px;
        transition: all 0.2s;
      }

      :host ::ng-deep .ant-tabs-tab-remove:hover {
        background-color: rgba(0, 0, 0, 0.06);
        color: #ff4d4f;
      }

      :host ::ng-deep .ant-tabs-tab-remove .anticon {
        font-size: 12px;
      }

      /* 確保關閉按鈕在所有可關閉標籤上顯示 */
      :host ::ng-deep .ant-tabs-tab[data-node-key] .ant-tabs-tab-remove {
        opacity: 1;
        visibility: visible;
      }

      /* 自定義關閉按鈕樣式 */
      .custom-close-btn {
        display: flex !important; /* 強制顯示 */
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        min-width: 16px;
        max-width: 16px;
        padding: 0;
        margin-left: 8px;
        border: none;
        border-radius: 2px;
        background: transparent;
        color: rgba(0, 0, 0, 0.45);
        transition: all 0.2s;
        flex-shrink: 0; /* 防止被壓縮 */
        z-index: 10; /* 確保在最上層 */
      }

      .custom-close-btn:hover {
        background-color: rgba(0, 0, 0, 0.06);
        color: #ff4d4f;
      }

      .custom-close-btn .anticon {
        font-size: 10px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabBarComponent implements OnInit, OnDestroy {
  tabs: TabData[] = [];
  activeTabId?: string;
  private destroy$ = new Subject<void>();

  private readonly tabService = inject(TabService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit(): void {
    // 更新所有現有標籤的 closable 屬性
    this.tabService.updateAllTabsClosable();

    this.subscribeToTabs();
    this.subscribeToRouter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get activeTabIndex(): number {
    if (!this.activeTabId) return 0;
    const index = this.tabs.findIndex(tab => tab.id === this.activeTabId);
    return index >= 0 ? index : 0;
  }

  trackByTabId(index: number, tab: TabData): string {
    return tab.id;
  }

  onTabChange(index: number): void {
    const tab = this.tabs[index];
    if (tab) {
      this.tabService.activateTab(tab.id);
      this.router.navigateByUrl(tab.url);
    }
  }

  onTabClose(tab: TabData): void {
    this.tabService.closeTab(tab.id);

    // If we closed the active tab, navigate to the new active tab
    const activeTab = this.tabs.find(t => t.active);
    if (activeTab) {
      this.router.navigateByUrl(activeTab.url);
    }
  }

  onCustomTabClose(event: Event, tab: TabData): void {
    event.stopPropagation(); // 防止觸發標籤切換
    this.onTabClose(tab);
  }

  private subscribeToTabs(): void {
    this.tabService.tabs$.pipe(takeUntil(this.destroy$)).subscribe(tabs => {
      this.tabs = tabs;
      this.cdr.markForCheck(); // 觸發變更檢測
    });

    this.tabService.activeTab$.pipe(takeUntil(this.destroy$)).subscribe(activeTab => {
      this.activeTabId = activeTab?.id;
      this.cdr.markForCheck(); // 觸發變更檢測
    });
  }

  private subscribeToRouter(): void {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.handleRouteChange();
      });
  }

  private handleRouteChange(): void {
    const currentUrl = this.router.url;

    // Check if a tab already exists for this URL
    const existingTab = this.tabs.find(tab => tab.url === currentUrl);

    if (existingTab) {
      // Activate existing tab
      this.tabService.activateTab(existingTab.id);
    } else {
      // Create new tab based on route
      const routeData = this.tabService.getRouteData(currentUrl);
      if (routeData) {
        this.tabService.createTab(routeData.title, currentUrl, routeData.icon, routeData.closable);
      }
    }
  }
}
