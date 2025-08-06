import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TabModel } from '../../domain/tab.model';
import { TabService } from './tab.service';

@Injectable({
  providedIn: 'root'
})
export class TabManagementService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private tabService = inject(TabService);

  /**
   * 创建并添加新标签页
   * @param title 标签页标题
   * @param path 路由路径
   * @param isNewTabDetailPage 是否为详情页
   */
  createTab(title: string, path: string, isNewTabDetailPage = false): void {
    const snapshotArray = this.getSnapshotArray();
    const tabModel: TabModel = {
      title,
      path,
      snapshotArray
    };
    this.tabService.addTab(tabModel, isNewTabDetailPage);
  }

  /**
   * 获取当前路由的快照数组
   */
  private getSnapshotArray(): ActivatedRouteSnapshot[] {
    const snapshotArray: ActivatedRouteSnapshot[] = [];
    let currentSnapshot = this.activatedRoute.snapshot;
    
    while (currentSnapshot) {
      snapshotArray.push(currentSnapshot);
      currentSnapshot = currentSnapshot.firstChild!;
    }
    
    return snapshotArray;
  }

  /**
   * 根据路由路径查找标签页索引
   */
  findTabIndex(path: string): number {
    return this.tabService.findIndex(path);
  }

  /**
   * 获取当前标签页索引
   */
  getCurrentTabIndex(): number {
    return this.tabService.getCurrentTabIndex();
  }

  /**
   * 刷新当前标签页
   */
  refreshCurrentTab(): void {
    this.tabService.refresh();
  }

  /**
   * 关闭指定标签页
   */
  closeTab(tab: TabModel, index: number): void {
    this.tabService.delTab(tab, index);
  }

  /**
   * 关闭其他标签页
   */
  closeOtherTabs(path: string, index: number): void {
    this.tabService.delOtherTab(path, index);
  }

  /**
   * 关闭右侧标签页
   */
  closeRightTabs(path: string, index: number): void {
    this.tabService.delRightTab(path, index);
  }

  /**
   * 关闭左侧标签页
   */
  closeLeftTabs(path: string, index: number): void {
    this.tabService.delLeftTab(path, index);
  }

  /**
   * 获取标签页数组
   */
  getTabArray(): TabModel[] {
    return this.tabService.getTabArray();
  }

  /**
   * 获取标签页数组Observable
   */
  getTabArray$() {
    return this.tabService.getTabArray$();
  }
}
