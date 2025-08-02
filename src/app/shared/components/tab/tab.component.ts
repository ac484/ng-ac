import { NgClass, NgStyle, AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { TabModel, TabService } from '../../../core/services/tab.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzContextMenuService, NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzCardModule, 
    NzTabsModule, 
    NzDropDownModule, 
    NzMenuModule, 
    NzButtonModule, 
    NgClass, 
    NgStyle, 
    NzIconModule, 
    AsyncPipe
  ]
})
export class TabComponent implements OnInit {
  private tabService = inject(TabService);
  private nzContextMenuService = inject(NzContextMenuService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);

  tabsSourceData: TabModel[] = [];
  tabsSourceData$ = this.tabService.getTabArray$();

  constructor() {
    // 監聽路由變化，更新視圖
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  /**
   * 獲取當前選中的標籤頁索引
   */
  get currentIndex(): number {
    return this.tabService.getCurrentTabIndex();
  }

  /**
   * 標籤頁追蹤函數
   */
  public trackByTab(index: number, tab: TabModel): string {
    return tab.title;
  }

  /**
   * 點擊標籤頁跳轉到對應的路徑
   */
  goPage(tab: TabModel): void {
    this.tabService.goPage(tab);
  }

  /**
   * 右鍵點擊關閉右側標籤頁
   */
  closeRightTab(tab: TabModel, e: MouseEvent, index: number): void {
    this.stopEvent(e);
    this.tabService.delRightTab(tab.path, index);
  }

  /**
   * 右鍵點擊關閉左側標籤頁
   */
  closeLeftTab(tab: TabModel, e: MouseEvent, index: number): void {
    if (index === 0) {
      return;
    }
    this.stopEvent(e);
    this.tabService.delLeftTab(tab.path, index);
  }

  /**
   * 關閉其他標籤頁
   */
  closeOtherTab(tab: TabModel, e: MouseEvent, index: number): void {
    this.stopEvent(e);
    this.tabService.delOtherTab(tab.path, index);
  }

  /**
   * 右鍵關閉當前標籤頁
   */
  closeTab(tab: TabModel, e: MouseEvent, index: number): void {
    this.stopEvent(e);
    this.closeCurrentTab(tab, index);
  }

  /**
   * 點擊標籤頁上的關閉圖標
   */
  clickCloseIcon(indexObj: { index: number }): void {
    this.closeCurrentTab(this.tabsSourceData[indexObj.index], indexObj.index);
  }

  /**
   * 關閉當前標籤頁
   */
  closeCurrentTab(tab: TabModel, index: number): void {
    if (this.tabsSourceData.length === 1) {
      return;
    }
    this.tabService.delTab(tab, index);
    this.cdr.detectChanges();
  }

  /**
   * 刷新當前標籤頁
   */
  refresh(): void {
    this.tabService.refresh();
  }

  /**
   * 顯示右鍵菜單
   */
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  /**
   * 關閉右鍵菜單
   */
  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  /**
   * 阻止事件冒泡和默認行為
   */
  private stopEvent(e: MouseEvent): void {
    e.stopPropagation();
    e.preventDefault();
  }

  ngOnInit(): void {
    // 訂閱標籤頁數據變化
    this.tabsSourceData$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.tabsSourceData = res;
      this.cdr.markForCheck();
    });
  }
}