import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, Injectable, Provider, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import type { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, zip, of, catchError, map } from 'rxjs';

import { I18NService } from './i18n.service';

/**
 * Infrastructure Service: Application Startup
 *
 * Used for application startup to get basic data like menu data, user data, etc.
 * This service belongs to the Infrastructure layer as it handles external dependencies
 * and technical concerns like HTTP requests, routing, and service initialization.
 */
export function provideStartup(): Provider[] {
  return [
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: (startupService: StartupService) => () => startupService.load(),
      deps: [StartupService],
      multi: true
    }
  ];
}

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  private menuService = inject(MenuService);
  private settingService = inject(SettingsService);
  private tokenService = inject(DA_SERVICE_TOKEN);
  private aclService = inject(ACLService);
  private titleService = inject(TitleService);
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private i18n = inject<I18NService>(ALAIN_I18N_TOKEN);

  // If http request allows anonymous access, you need to add `ALLOW_ANONYMOUS`:
  // this.httpClient.get('/app', { context: new HttpContext().set(ALLOW_ANONYMOUS, true) })
  private appData$ = this.httpClient.get('./assets/tmp/app-data.json').pipe(
    catchError((res: NzSafeAny) => {
      console.warn(`StartupService.load: Network request failed`, res);
      setTimeout(() => this.router.navigateByUrl(`/exception/500`));
      return of({});
    })
  );

  /**
   * Handle application data configuration
   * Sets up application settings, user information, ACL permissions, and menu data
   */
  private handleAppData(res: NzSafeAny): void {
    // Application information: including site name, description, year
    this.settingService.setApp(res.app);
    // User information: including name, avatar, email address
    this.settingService.setUser(res.user);
    // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
    this.aclService.setFull(true);
    // Menu data, https://ng-alain.com/theme/menu
    this.menuService.add(res.menu ?? []);
    // Can be set page suffix title, https://ng-alain.com/theme/title
    this.titleService.suffix = res.app?.name;
  }

  /**
   * Load application data via HTTP
   * Fetches language data and application data from server
   */
  private viaHttp(): Observable<void> {
    const defaultLang = this.i18n.defaultLang;
    return zip(this.i18n.loadLangData(defaultLang), this.appData$).pipe(
      map(([langData, appData]: [Record<string, string>, NzSafeAny]) => {
        // setting language data
        this.i18n.use(defaultLang, langData);
        this.handleAppData(appData);
      })
    );
  }

  /**
   * Load application data via mock I18n
   * Uses mock internationalization data for development
   */
  private viaMockI18n(): Observable<void> {
    const defaultLang = this.i18n.defaultLang;
    return this.i18n.loadLangData(defaultLang).pipe(
      map((langData: NzSafeAny) => {
        this.i18n.use(defaultLang, langData);
        this.viaMock();
      })
    );
  }

  /**
   * Load application data via mock
   * Provides mock data for development environment
   */
  private viaMock(): Observable<void> {
    // const tokenData = this.tokenService.get();
    // if (!tokenData.token) {
    //   this.router.navigateByUrl(this.tokenService.login_url!);
    //   return;
    // }

    // Mock data for development
    const app: any = {
      name: `DDD Application`,
      description: `Domain-Driven Design implementation with ng-zorro-antd & @delon/*`
    };
    const user: any = {
      name: 'Admin',
      avatar: './assets/tmp/img/avatar.jpg',
      email: 'admin@ddd-app.com',
      token: '123456789'
    };

    // Application information: including site name, description, year
    this.settingService.setApp(app);
    // User information: including name, avatar, email address
    this.settingService.setUser(user);
    // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
    this.aclService.setFull(true);
    // Menu data, https://ng-alain.com/theme/menu
    this.menuService.add([
      {
        text: 'DDD Modules',
        group: true,
        children: [
          {
            text: 'Dashboard',
            link: '/dashboard',
            icon: { type: 'icon', value: 'dashboard' }
          },
          {
            text: 'Users',
            link: '/users',
            icon: { type: 'icon', value: 'user' }
          },
          {
            text: 'Accounts',
            link: '/accounts',
            icon: { type: 'icon', value: 'bank' }
          },
          {
            text: 'Transactions',
            link: '/transactions',
            icon: { type: 'icon', value: 'transaction' }
          },
          {
            text: 'Contracts',
            link: '/contracts',
            icon: { type: 'icon', value: 'file-text' }
          },
          {
            text: 'Principal',
            link: '/principal',
            icon: { type: 'icon', value: 'team' }
          }
        ]
      }
    ]);
    // Can be set page suffix title, https://ng-alain.com/theme/title
    this.titleService.suffix = app.name;

    return of(void 0);
  }

  /**
   * Load application startup data
   * Main method called during application initialization
   */
  load(): Observable<void> {
    // http
    // return this.viaHttp();
    // mock: Don't use it in a production environment. ViaMock is just to simulate some data to make the scaffolding work normally
    // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
    return this.viaMockI18n();
  }
}
