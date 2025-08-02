import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TabModel {
  title: string;
  path: string;
  snapshotArray: ActivatedRouteSnapshot[];
}

/**
 * Tab操作的服務
 * 管理標籤頁的創建、切換、關閉等功能
 */
@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tabArray$ = new BehaviorSubject<TabModel[]>([]);
  private tabArray: TabModel[] = [];
  private currSelectedIndexTab = 0;
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  /**
   * 獲取標籤頁數組的Observable
   */
  getTabArray$(): Observable<TabModel[]> {
    return this.tabArray$.asObservable();
  }

  /**
   * 設置標籤頁數組並通知訂閱者
   */
  setTabArray$(tabArray: TabModel[]): void {
    this.tabArray$.next(tabArray);
  }

  /**
   * 更新標籤頁數據源
   */
  setTabsSourceData(): void {
    this.setTabArray$(this.tabArray);
  }

  /**
   * 清空所有標籤頁
   */
  clearTabs(): void {
    this.tabArray = [];
    this.setTabsSourceData();
  }

  /**
   * 添加標籤頁
   * @param tabModel 標籤頁模型
   * @param isNewTabDetailPage 是否為新標籤詳情頁
   */
  addTab(tabModel: TabModel, isNewTabDetailPage = false): void {
    // 檢查是否已存在相同標題的標籤頁
    this.tabArray.forEach(tab => {
      if (tab.title === tabModel.title && !isNewTabDetailPage) {
        // 更新現有標籤頁的快照數組和路徑
        tab.snapshotArray = [...new Set([...tab.snapshotArray, ...tabModel.snapshotArray])];
        tab.path = tabModel.path;
      }
    });

    // 如果不存在相同路徑的標籤頁，則添加新標籤頁
    if (!this.tabArray.find(value => value.path === tabModel.path)) {
      this.tabArray.push(tabModel);
    }
    this.setTabsSourceData();
  }

  /**
   * 獲取標籤頁數組
   */
  getTabArray(): TabModel[] {
    return this.tabArray;
  }

  /**
   * 修改當前標籤頁標題
   * @param title 新標題
   */
  changeTabTitle(title: string): void {
    if (this.tabArray[this.getCurrentTabIndex()]) {
      this.tabArray[this.getCurrentTabIndex()].title = title;
      this.setTabArray$(this.tabArray);
    }
  }

  /**
   * 關閉右側所有標籤頁
   * @param tabPath 標籤頁路徑
   * @param index 當前標籤頁索引
   */
  delRightTab(tabPath: string, index: number): void {
    // 移除右側所有標籤頁
    this.tabArray.length = index + 1;
    
    // 如果當前選中的標籤頁在被刪除的範圍內，則跳轉到指定標籤頁
    if (index < this.currSelectedIndexTab) {
      this.router.navigateByUrl(this.tabArray[index].path);
      this.currSelectedIndexTab = index;
    }
    this.setTabsSourceData();
  }

  /**
   * 關閉左側所有標籤頁
   * @param tabPath 標籤頁路徑
   * @param index 當前標籤頁索引
   */
  delLeftTab(tabPath: string, index: number): void {
    // 要刪除的標籤頁
    const beDelTabArray = this.tabArray.filter((item, tabindex) => {
      return tabindex < index;
    });

    // 處理索引關係
    if (this.currSelectedIndexTab === index) {
      this.currSelectedIndexTab = 0;
    } else if (this.currSelectedIndexTab < index) {
      this.currSelectedIndexTab = 0;
    } else if (this.currSelectedIndexTab > index) {
      this.currSelectedIndexTab = this.currSelectedIndexTab - beDelTabArray.length;
    }
    
    // 移除左側標籤頁
    this.tabArray = this.tabArray.slice(beDelTabArray.length);
    this.setTabsSourceData();
    
    // 跳轉到新的當前標籤頁
    if (this.tabArray[this.currSelectedIndexTab]) {
      this.router.navigateByUrl(this.tabArray[this.currSelectedIndexTab].path);
    }
  }

  /**
   * 關閉其他所有標籤頁
   * @param path 保留的標籤頁路徑
   * @param index 保留的標籤頁索引
   */
  delOtherTab(path: string, index: number): void {
    // 只保留指定的標籤頁
    this.tabArray = [this.tabArray[index]];
    this.currSelectedIndexTab = 0;
    
    // 跳轉到保留的標籤頁
    this.router.navigateByUrl(path);
    this.setTabsSourceData();
  }

  /**
   * 刪除指定標籤頁
   * @param tab 標籤頁模型
   * @param index 標籤頁索引
   */
  delTab(tab: TabModel, index: number): void {
    // 如果只有一個標籤頁，則不允許刪除
    if (this.tabArray.length === 1) {
      return;
    }

    // 移除當前正在展示的標籤頁
    if (index === this.currSelectedIndexTab) {
      this.tabArray.splice(index, 1);
      // 處理索引關係
      this.currSelectedIndexTab = index - 1 < 0 ? 0 : index - 1;
      // 跳轉到新標籤頁
      if (this.tabArray[this.currSelectedIndexTab]) {
        this.router.navigateByUrl(this.tabArray[this.currSelectedIndexTab].path);
      }
    } else if (index < this.currSelectedIndexTab) {
      // 刪除左側標籤頁
      this.tabArray.splice(index, 1);
      this.currSelectedIndexTab = this.currSelectedIndexTab - 1;
    } else if (index > this.currSelectedIndexTab) {
      // 刪除右側標籤頁
      this.tabArray.splice(index, 1);
    }
    
    this.setTabsSourceData();
  }

  /**
   * 根據路徑查找標籤頁索引
   * @param path 路徑
   * @returns 標籤頁索引
   */
  findIndex(path: string): number {
    const current = this.tabArray.findIndex(tabItem => {
      return path === tabItem.path;
    });
    if (current !== -1) {
      this.currSelectedIndexTab = current;
    }
    return current;
  }

  /**
   * 刷新當前標籤頁
   */
  refresh(): void {
    const currentUrl = this.router.url;
    // 使用空白頁面進行中轉，然後重新導航到當前頁面
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  /**
   * 獲取當前標籤頁索引
   */
  getCurrentTabIndex(): number {
    return this.currSelectedIndexTab;
  }

  /**
   * 跳轉到指定標籤頁
   * @param tab 標籤頁模型
   */
  goPage(tab: TabModel): void {
    this.router.navigateByUrl(tab.path);
  }
}