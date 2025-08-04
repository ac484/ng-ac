import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule, NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { TabApplicationService } from '../../../application/services/tab-application.service';
import { TabModel } from '../../../domain/entities/tab.entity';

/**
 * Interface Component: Tab Component
 *
 * UI component for managing tabs in the application. This component
 * belongs to the Interface layer as it handles user interface concerns
 * and user interactions.
 */
@Component({
  selector: 'app-tab',
  template: `
    <nz-card id="multi-tab" class="m-t-10" style="height: 35px" [nzBodyStyle]="{ padding: 0 }" [nzBordered]="false">
      <nz-tabset
        [nzHideAdd]="true"
        [nzSelectedIndex]="currentIndex"
        [nzTabBarStyle]="{ height: '35px' }"
        [nzTabPosition]="'top'"
        [nzType]="'editable-card'"
        (nzClose)="clickCloseIcon($event)"
      >
        @for (tab of tabsSourceData$ | async; track trackByTab(i, tab); let i = $index) {
          <nz-tab nzClosable [nzTitle]="tab.title" (nzClick)="goPage(tab)" (nzContextmenu)="contextMenu($event, menu)">
            <nz-dropdown-menu #menu="nzDropdownMenu">
              <ul nz-menu>
                <li nz-menu-item [nzDisabled]="router.url !== tab.path" (click)="refresh()">刷新</li>
                <li nz-menu-item [nzDisabled]="tabsSourceData.length - 1 === 0" (click)="closeTab(tab, $event, i)">關閉標籤</li>
                <li nz-menu-item [nzDisabled]="tabsSourceData.length - 1 === 0" (click)="closeOtherTab(tab, $event, i)">關閉其他標籤</li>
                <li nz-menu-item [nzDisabled]="tabsSourceData.length - 1 === i" (click)="closeRightTab(tab, $event, i)">關閉右側標籤</li>
                <li nz-menu-item [nzDisabled]="i === 0" (click)="closeLeftTab(tab, $event, i)">關閉左側標籤</li>
              </ul>
            </nz-dropdown-menu>
          </nz-tab>
        }
      </nz-tabset>
    </nz-card>
  `,
  styleUrls: ['./tab.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, NzCardModule, NzTabsModule, NzDropDownModule, NzMenuModule, NzButtonModule, NzIconModule]
})
export class TabComponent implements OnInit {
  private readonly tabApplicationService = inject(TabApplicationService);
  private readonly nzContextMenuService = inject(NzContextMenuService);
  readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  tabsSourceData$ = this.tabApplicationService.getTabArray$();
  tabsSourceData: TabModel[] = [];

  constructor() {
    // Listen to router events for change detection
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.cdr.markForCheck();
      });

    // Subscribe to tab data changes
    this.tabsSourceData$.pipe(takeUntilDestroyed()).subscribe(tabs => {
      this.tabsSourceData = tabs;
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  get currentIndex(): number {
    const currentPath = this.router.url;
    const tabs = this.tabsSourceData;
    const index = tabs.findIndex(tab => tab.path === currentPath);
    return index >= 0 ? index : 0;
  }

  /**
   * Track function for ngFor
   */
  public trackByTab(index: number, tab: TabModel): string {
    // Use path as primary key, fallback to title + index for uniqueness
    return tab.path || `${tab.title}_${index}`;
  }

  /**
   * Navigate to tab page
   */
  goPage(tab: TabModel): void {
    this.tabApplicationService.navigateToTab(tab);
  }

  /**
   * Close right tabs
   */
  closeRightTab(tab: TabModel, e: MouseEvent, index: number): void {
    e.preventDefault();
    e.stopPropagation();
    this.tabApplicationService.removeRightTabs(index);
  }

  /**
   * Close left tabs
   */
  closeLeftTab(tab: TabModel, e: MouseEvent, index: number): void {
    if (index === 0) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.tabApplicationService.removeLeftTabs(index);
  }

  /**
   * Close other tabs
   */
  closeOtherTab(tab: TabModel, e: MouseEvent, index: number): void {
    e.preventDefault();
    e.stopPropagation();
    this.tabApplicationService.removeOtherTabs(index);
  }

  /**
   * Close current tab
   */
  closeTab(tab: TabModel, e: MouseEvent, index: number): void {
    e.preventDefault();
    e.stopPropagation();
    this.closeCurrentTab(tab, index);
  }

  /**
   * Handle close icon click
   */
  clickCloseIcon(indexObj: { index: number }): void {
    this.closeCurrentTab(this.tabsSourceData[indexObj.index], indexObj.index);
  }

  /**
   * Close current tab logic
   */
  private closeCurrentTab(tab: TabModel, index: number): void {
    this.tabApplicationService.removeTab(index);
  }

  /**
   * Refresh current tab
   */
  refresh(): void {
    // Implementation for tab refresh
    console.log('Refreshing current tab');
  }

  /**
   * Show context menu
   */
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }
}
