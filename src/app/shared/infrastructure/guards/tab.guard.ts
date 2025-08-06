import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TabManagementService } from '../services/tab-management.service';

export const tabGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const tabManagementService = inject(TabManagementService);
  
  // 获取路由标题，优先使用路由数据中的title，如果没有则使用路由路径的最后一段
  const title = route.data['title'] || route.url[route.url.length - 1]?.path || 'Unknown';
  const path = state.url;
  
  // 创建标签页
  tabManagementService.createTab(title, path);
  
  return true;
};
