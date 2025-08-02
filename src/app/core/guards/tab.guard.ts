import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { TabService, TabModel } from '../services/tab.service';

/**
 * Tab Guard - 標籤頁路由守衛
 * 
 * 作用：
 * 1. 自動為路由創建標籤頁
 * 2. 從路由數據中獲取標題
 * 3. 管理標籤頁的狀態
 * 4. 支持標籤頁的切換和關閉功能
 */
export const tabGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tabService = inject(TabService);
  
  // 從路由數據中獲取標題，如果沒有則使用默認標題
  const title = route.data?.['title'] || route.routeConfig?.path || '未命名頁面';
  
  // 構建完整的路由路徑
  const pathSegments: string[] = [];
  let currentRoute: ActivatedRouteSnapshot | null = route;
  
  while (currentRoute) {
    if (currentRoute.url.length > 0) {
      pathSegments.unshift(...currentRoute.url.map(segment => segment.path));
    }
    currentRoute = currentRoute.parent;
  }
  
  const path = '/' + pathSegments.join('/');
  
  // 創建標籤頁模型
  const tabModel: TabModel = {
    title,
    path,
    snapshotArray: [route]
  };
  
  // 添加到標籤頁服務
  tabService.addTab(tabModel);
  
  // 更新當前選中的標籤頁索引
  tabService.findIndex(path);
  
  return true;
};