import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subject, takeUntil, filter } from 'rxjs';
import { TabService, TabData } from '../../services/tab.service';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  imports: [
    CommonModule,
    NzTabsModule,
    NzIconModule
  ],
  template: `
    <div class="tab-bar">
      <nz-tabset
        [nzSelectedIndex]="activeTabIndex"
        (nzSelectedIndexChange)="onTabChange($event)"
        [nzType]="'card'"
        [nzAnimated]="false"
        [nzTabBarGutter]="0">
        
        <nz-tab
          *ngFor="let tab of tabs; trackBy: trackByTabId"
          [nzTitle]="tabTitle"
          [nzClosable]="tab.closable"
          (nzClose)="onTabClose(tab)">
          
          <ng-template #tabTitle>
            <div class="tab-title">
              <i *ngIf="tab.icon" nz-icon [nzType]="tab.icon"></i>
              <span>{{ tab.title }}</span>
            </div>
          </ng-template>
          
        </nz-tab>
      </nz-tabset>
    </div>
  `,
  styles: [`
    .tab-title {
      display: flex;
      align-items: center;
      gap: 4px;
      min-width: 0;
    }
    
    .tab-title span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    :host ::ng-deep .ant-tabs-content-holder {
      display: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabBarComponent implements OnInit, OnDestroy {
  tabs: TabData[] = [];
  activeTabId?: string;
  private destroy$ = new Subject<void>();

  constructor(
    private tabService: TabService,
    private router: Router
  ) {}

  ngOnInit(): void {
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

  private subscribeToTabs(): void {
    this.tabService.tabs$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tabs => {
        this.tabs = tabs;
      });

    this.tabService.activeTab$
      .pipe(takeUntil(this.destroy$))
      .subscribe(activeTab => {
        this.activeTabId = activeTab?.id;
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
        this.tabService.createTab(
          routeData.title,
          currentUrl,
          routeData.icon,
          routeData.closable
        );
      }
    }
  }
}
