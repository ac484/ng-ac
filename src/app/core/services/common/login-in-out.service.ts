import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@config/actionCode';
import { TokenKey, TokenPre } from '@config/constant';
import { SimpleReuseStrategy } from '@core/services/common/reuse-strategy';
import { TabService } from '@core/services/common/tab.service';
import { WindowService } from '@core/services/common/window.service';
import { FirebaseAuthService } from '@core/services/firebase/firebase-auth.service';
import { Menu } from '@core/services/types';
import { LoginService } from '@services/login/login.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { UserInfo, UserInfoService } from '@store/common-store/userInfo.service';
import { fnFlatDataHasParentToTree } from '@utils/treeTableTools';

/*
 * 退出登录
 * */
@Injectable({
  providedIn: 'root'
})
export class LoginInOutService {
  private destroyRef = inject(DestroyRef);
  private activatedRoute = inject(ActivatedRoute);
  private tabService = inject(TabService);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private userInfoService = inject(UserInfoService);
  private menuService = inject(MenuStoreService);
  private windowServe = inject(WindowService);
  private firebaseAuthService = inject(FirebaseAuthService);

  // 通过用户Id来获取菜单数组
  getMenuByUserId(userId: number): Observable<Menu[]> {
    return this.loginService.getMenuByUserId(userId);
  }

  loginIn(token: string | any): Promise<void> {
    return new Promise(resolve => {
      // 檢查是否為 Firebase 用戶
      if (typeof token === 'object' && token.firebaseUser) {
        // Firebase 用戶處理
        this.handleFirebaseLogin(token, resolve);
      } else {
        // 傳統用戶處理
        this.handleTraditionalLogin(token, resolve);
      }
    });
  }

  private handleFirebaseLogin(firebaseToken: any, resolve: () => void): void {
    console.log('🔥 handleFirebaseLogin 開始處理:', firebaseToken);

    // 使用兼容的 JWT token，就像傳統登入一樣
    const compatibleToken = firebaseToken.compatibleToken || firebaseToken.token;
    console.log('🔥 使用的兼容 token:', compatibleToken);

    // 將 token 持久化缓存，使用與傳統登入相同的方式
    const fullToken = TokenPre + compatibleToken;
    this.windowServe.setSessionStorage(TokenKey, fullToken);
    console.log('🔥 Token 已存儲到 SessionStorage:', fullToken);

    // 使用標準的 token 解析方法
    const userInfo: UserInfo = this.userInfoService.parsToken(fullToken);
    console.log('🔥 解析後的用戶信息:', userInfo);

    // 將用戶信息缓存到全局 service 中
    this.userInfoService.setUserInfo(userInfo);

    // Firebase 用戶使用預設菜單
    const defaultMenus = this.getDefaultMenusForFirebaseUser();
    console.log('🔥 設置的預設菜單:', defaultMenus);
    this.menuService.setMenuArrayStore(defaultMenus);

    console.log('🔥 handleFirebaseLogin 處理完成');
    resolve();
  }

  private handleTraditionalLogin(token: string, resolve: () => void): void {
    // 将 token 持久化缓存，请注意，如果没有缓存，则会在路由守卫中被拦截，不让路由跳转
    // 这个路由守卫在src/app/core/services/common/guard/judgeLogin.guard.ts
    this.windowServe.setSessionStorage(TokenKey, TokenPre + token);
    // 解析token ，然后获取用户信息
    const userInfo: UserInfo = this.userInfoService.parsToken(TokenPre + token);
    // todo  这里是手动添加静态页面标签页操作中打开详情的按钮的权限，因为他们涉及到路由跳转，会走路由守卫，但是权限又没有通过后端管理，所以下面两行手动添加权限，实际操作中可以删除下面2行
    userInfo.authCode.push(ActionCode.TabsDetail);
    userInfo.authCode.push(ActionCode.SearchTableDetail);
    // 将用户信息缓存到全局service中
    this.userInfoService.setUserInfo(userInfo);
    // 通过用户id来获取这个用户所拥有的menu
    this.getMenuByUserId(userInfo.userId)
      .pipe(
        finalize(() => {
          resolve();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(menus => {
        menus = menus.filter(item => {
          item.selected = false;
          item.open = false;
          return item.menuType === 'C';
        });
        const temp = fnFlatDataHasParentToTree(menus);
        // 存储menu
        this.menuService.setMenuArrayStore(temp);
        resolve();
      });
  }

  private getDefaultMenusForFirebaseUser(): Menu[] {
    // 為 Firebase 用戶提供預設菜單
    return [
      {
        id: 1,
        fatherId: 0,
        menuName: '儀表板',
        menuType: 'C',
        path: '/default/dashboard',
        icon: 'dashboard',
        code: 'TabsDetail', // 添加權限碼
        children: [
          {
            id: 11,
            fatherId: 1,
            menuName: '分析頁',
            menuType: 'C',
            path: '/default/dashboard/analysis',
            icon: 'bar-chart',
            code: 'TabsDetail', // 添加權限碼，與用戶的 authCode 匹配
            children: []
          }
        ]
      }
    ];
  }

  // 清除Tab缓存,是与路由复用相关的东西
  clearTabCash(): Promise<void> {
    return SimpleReuseStrategy.deleteAllRouteSnapshot(this.activatedRoute.snapshot).then(() => {
      return new Promise(resolve => {
        // 清空tab
        this.tabService.clearTabs();
        resolve();
      });
    });
  }

  clearSessionCash(): Promise<void> {
    return new Promise(resolve => {
      this.windowServe.removeSessionStorage(TokenKey);
      this.menuService.setMenuArrayStore([]);
      resolve();
    });
  }

  async loginOut(): Promise<void> {
    try {
      // 檢查當前用戶是否為 Firebase 用戶
      const currentUser = this.userInfoService.getUserInfo();
      if (currentUser && (currentUser as any).firebaseUser) {
        // Firebase 用戶登出
        await this.firebaseAuthService.signOut();
      }

      // 清除本地緩存和狀態
      await this.clearTabCash();
      await this.clearSessionCash();

      // 導航到登入頁面
      this.router.navigate(['/login/login-form']);
    } catch (error) {
      console.error('登出過程中發生錯誤:', error);
      // 即使 Firebase 登出失敗，也要清除本地狀態
      await this.clearTabCash();
      await this.clearSessionCash();
      this.router.navigate(['/login/login-form']);
    }
  }
}
