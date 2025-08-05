import { Injectable, inject, APP_INITIALIZER, Provider } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { MenuService, SettingsService, TitleService } from '@delon/theme';
import { ACLService } from '@delon/acl';

/**
 * 應用啟動服務
 * 遵循極簡主義：只做必要的事情
 */
export function provideStartup(): Provider[] {
  return [
    StartupApplicationService,
    {
      provide: APP_INITIALIZER,
      useFactory: (startupService: StartupApplicationService) => () => startupService.load(),
      deps: [StartupApplicationService],
      multi: true
    }
  ];
}

@Injectable({
  providedIn: 'root'
})
export class StartupApplicationService {
  private menuService = inject(MenuService);
  private settingService = inject(SettingsService);
  private tokenService = inject(DA_SERVICE_TOKEN);
  private aclService = inject(ACLService);
  private titleService = inject(TitleService);

  /**
   * 初始化應用
   * 極簡設計：只設置必要的基礎配置
   */
  load(): Observable<void> {
    // 設置應用基本信息
    this.settingService.setApp({
      name: 'NG-AC',
      description: 'Angular DDD project'
    });

    // 設置頁面標題
    this.titleService.suffix = 'NG-AC';

    // 檢查認證狀態並設置相應配置
    const tokenData = this.tokenService.get();

    if (tokenData?.token) {
      this.setupAuthenticatedUser(tokenData);
    } else {
      this.setupUnauthenticatedUser();
    }

    return of(void 0);
  }

  /**
   * 設置已認證用戶
   */
  private setupAuthenticatedUser(tokenData: any): void {
    // 設置用戶信息
    this.settingService.setUser({
      name: tokenData.name || 'Admin',
      avatar: tokenData.avatar || './assets/logo-color.svg',
      email: tokenData.email || 'admin@ng-ac.com'
    });

    // 設置Layout配置
    this.settingService.setLayout({
      fixed: true,
      collapsed: false,
      boxed: false,
      lang: null
    });

    // 設置權限
    this.aclService.setFull(true);

    // 設置菜單
    this.menuService.add([
      {
        text: 'Main',
        group: true,
        children: [
          {
            text: 'Dashboard',
            link: '/dashboard',
            icon: 'dashboard'
          },
          {
            text: 'User Management',
            link: '/users',
            icon: 'user'
          },
          {
            text: 'Settings',
            link: '/settings',
            icon: 'setting'
          }
        ]
      }
    ]);
  }

  /**
   * 設置未認證用戶
   */
  private setupUnauthenticatedUser(): void {
    // 設置基本權限
    this.aclService.setFull(false);
    this.aclService.setRole(['guest']);

    // 設置基本菜單
    this.menuService.add([
      {
        text: 'Authentication',
        group: true,
        children: [
          {
            text: 'Login',
            link: '/passport/login',
            icon: 'login'
          }
        ]
      }
    ]);
  }
} 