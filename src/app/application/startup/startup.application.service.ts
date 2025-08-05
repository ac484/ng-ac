import { Injectable, inject, APP_INITIALIZER, Provider } from '@angular/core';
import { Observable, of, throwError, catchError, tap, delay } from 'rxjs';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { MenuService, SettingsService, TitleService } from '@delon/theme';
import { ACLService } from '@delon/acl';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
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
   * 初始化應用程序
   * 在 DDD 架構中，這個服務負責協調領域服務和基礎設施服務
   */
  load(): Observable<void> {
    return this.initializeApp()
      .pipe(
        delay(500), // 給用戶一個視覺反饋
        tap(() => console.log('Startup service completed')),
        catchError(error => {
          console.error('Startup service error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * 初始化應用程序
   */
  private initializeApp(): Observable<void> {
    console.log('Starting application initialization...');
    
    // 檢查用戶認證狀態
    const tokenData = this.tokenService.get();
    
    if (!tokenData?.token) {
      // 用戶未認證，設置基本應用數據
      return this.initializeUnauthenticatedApp();
    } else {
      // 用戶已認證，設置用戶數據
      return this.initializeAuthenticatedApp(tokenData);
    }
  }

  /**
   * 初始化未認證的應用程序
   */
  private initializeUnauthenticatedApp(): Observable<void> {
    console.log('Initializing unauthenticated app');
    
    const app = {
      name: 'NG-AC',
      description: 'Angular DDD project with Firebase authentication',
      year: new Date().getFullYear()
    };

    // 設置應用信息
    this.settingService.setApp(app);
    
    // 設置基本權限（允許訪問登錄頁面）
    this.aclService.setFull(false);
    this.aclService.setRole(['guest']);
    
    // 設置基本菜單（僅顯示登錄相關）
    this.menuService.add([
      {
        text: 'Authentication',
        group: true,
        children: [
          {
            text: 'Login',
            link: '/passport/login',
            icon: 'login'
          },
          {
            text: 'Register',
            link: '/passport/register',
            icon: 'user-add'
          }
        ]
      }
    ]);

    // 設置頁面標題
    this.titleService.suffix = app.name;
    
    return of(void 0);
  }

  /**
   * 初始化已認證的應用程序
   */
  private initializeAuthenticatedApp(tokenData: any): Observable<void> {
    console.log('Initializing authenticated app');
    
    const app = {
      name: 'NG-AC',
      description: 'Angular DDD project with Firebase authentication',
      year: new Date().getFullYear()
    };

    // 設置應用信息
    this.settingService.setApp(app);
    
    // 從 token 數據構建用戶信息
    const user = {
      name: tokenData['name'] || tokenData['displayName'] || 'User',
      avatar: tokenData['avatar'] || tokenData['photoURL'] || './assets/tmp/img/avatar.jpg',
      email: tokenData['email'] || 'user@example.com',
      token: tokenData.token,
      uid: tokenData['uid'] || tokenData['sub'] || 'unknown'
    };

    // 設置用戶信息
    this.settingService.setUser(user);
    
    // 設置權限（已認證用戶）
    this.aclService.setFull(true);
    this.aclService.setRole(['user', 'admin']);
    
    // 設置菜單
    this.setupAuthenticatedMenu();
    
    // 設置頁面標題
    this.titleService.suffix = app.name;
    
    return of(void 0);
  }

  /**
   * 設置已認證用戶的菜單
   */
  private setupAuthenticatedMenu(): void {
    const menu = [
      {
        text: 'Main',
        group: true,
        children: [
          {
            text: 'Dashboard',
            link: '/dashboard',
            icon: 'appstore'
          }
        ]
      },
      {
        text: 'User',
        group: true,
        children: [
          {
            text: 'Profile',
            link: '/user/profile',
            icon: 'user'
          },
          {
            text: 'Settings',
            link: '/user/settings',
            icon: 'setting'
          }
        ]
      }
    ];

    this.menuService.add(menu);
  }

  /**
   * 從數據庫加載用戶詳細信息（未來擴展）
   */
  private loadUserFromDatabase(uid: string): Observable<any> {
    // 這裡可以集成 Firebase Firestore 或其他數據庫
    // 目前返回 null，表示使用基本用戶信息
    return of(null);
  }
} 