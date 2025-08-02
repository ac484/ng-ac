import { DOCUMENT, registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import zh from '@angular/common/locales/zh';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, RouteReuseStrategy, TitleStrategy, withComponentInputBinding, withHashLocation, withInMemoryScrolling, withPreloading } from '@angular/router';

// Firebase 相關導入
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai';


import { DashboardOutline, FormOutline, MenuFoldOutline, MenuUnfoldOutline } from '@ant-design/icons-angular/icons';
import { appRoutes } from '@app/app-routing';
import interceptors from '@app/core/services/interceptors';
import { CustomPageTitleResolverService } from '@core/services/common/custom-page-title-resolver.service';
import { InitThemeService } from '@core/services/common/init-theme.service';
import { LoadAliIconCdnService } from '@core/services/common/load-ali-icon-cdn.service';
import { SimpleReuseStrategy } from '@core/services/common/reuse-strategy';
import { ScrollService } from '@core/services/common/scroll.service';
import { SelectivePreloadingStrategyService } from '@core/services/common/selective-preloading-strategy.service';
import { SubLockedStatusService } from '@core/services/common/sub-locked-status.service';
import { SubWindowWithService } from '@core/services/common/sub-window-with.service';
import { ThemeSkinService } from '@core/services/common/theme-skin.service';
import { StartupService } from '@core/startup/startup.service';
import { FirebaseInitService } from '@core/services/firebase/firebase-init.service';
import { environment } from '@env/environment';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline];

registerLocaleData(zh);

export function StartupServiceFactory(startupService: StartupService) {
  return () => startupService.load();
}

export function LoadAliIconCdnFactory(loadAliIconCdnService: LoadAliIconCdnService) {
  return () => loadAliIconCdnService.load();
}

export function InitThemeServiceFactory(initThemeService: InitThemeService) {
  return async (): Promise<void> => await initThemeService.initTheme();
}

// 监听锁屏状态
export function InitLockedStatusServiceFactory(subLockedStatusService: SubLockedStatusService) {
  return () => subLockedStatusService.initLockedStatus();
}

// 开启监听屏幕宽度
export function SubWindowWithServiceFactory(subWindowWithService: SubWindowWithService) {
  return () => subWindowWithService.subWindowWidth();
}

// Firebase App Check 初始化
export function FirebaseInitServiceFactory(firebaseInitService: FirebaseInitService) {
  return async (): Promise<void> => {
    try {
      await firebaseInitService.initializeAppCheck();
    } catch (error) {
      // 在開發環境中，App Check 錯誤不應該阻止應用啟動
      if (!environment.production) {
        console.warn('🔥 開發環境中 App Check 初始化失敗，繼續啟動應用:', error);
        return;
      }
      // 生產環境中重新拋出錯誤
      throw error;
    }
  };
}

const APPINIT_PROVIDERS = [
  // Firebase App Check 初始化 - 必須在其他 Firebase 服務之前初始化
  {
    provide: APP_INITIALIZER,
    useFactory: FirebaseInitServiceFactory,
    deps: [FirebaseInitService],
    multi: true
  },
  // 项目启动
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true
  },
  // load阿里图标库cdn
  {
    provide: APP_INITIALIZER,
    useFactory: LoadAliIconCdnFactory,
    deps: [LoadAliIconCdnService],
    multi: true
  },
  // 初始化锁屏服务
  {
    provide: APP_INITIALIZER,
    useFactory: InitLockedStatusServiceFactory,
    deps: [SubLockedStatusService],
    multi: true
  },
  // 初始化主题
  {
    provide: APP_INITIALIZER,
    useFactory: InitThemeServiceFactory,
    deps: [InitThemeService],
    multi: true
  },
  // 初始化监听屏幕宽度服务
  {
    provide: APP_INITIALIZER,
    useFactory: SubWindowWithServiceFactory,
    deps: [SubWindowWithService],
    multi: true
  },
  // 初始化暗黑模式还是default模式的css
  {
    provide: APP_INITIALIZER,
    useFactory: (themeService: ThemeSkinService) => () => {
      return themeService.loadTheme();
    },
    deps: [ThemeSkinService],
    multi: true
  }
];

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy, deps: [DOCUMENT, ScrollService] }, // 路由复用
    {
      provide: TitleStrategy, // 相关资料：https://dev.to/brandontroberts/setting-page-titles-natively-with-the-angular-router-393j
      useClass: CustomPageTitleResolverService // 自定义路由切换时，浏览器title的显示，在ng14以上支持。旧版本使用方式请看我的github v16tag以下版本代码
    },
    { provide: NZ_I18N, useValue: zh_CN }, // zorro国际化
    { provide: NZ_ICONS, useValue: icons }, // zorro图标
    provideRouter(
      appRoutes, // 路由
      withPreloading(SelectivePreloadingStrategyService), // 自定义模块预加载
      // withViewTransitions({
      //   skipInitialTransition: true
      // }), // 路由切换过渡，ng17新增实验性特性参考资料https://netbasal.com/angular-v17s-view-transitions-navigate-in-elegance-f2d48fd8ceda
      withInMemoryScrolling({
        scrollPositionRestoration: 'top'
      }),
      ...(environment.useHash ? [withHashLocation()] : []), // 根據環境配置決定是否使用哈希路由
      withComponentInputBinding() // 开启路由参数绑定到组件的输入属性,ng16新增特性
    ),
    importProvidersFrom(NzDrawerModule, NzModalModule),
    ...interceptors, // http拦截器
    ...APPINIT_PROVIDERS, // 项目启动之前，需要调用的一系列方法
    provideAnimationsAsync(), // 开启延迟加载动画，ng17新增特性，如果想要项目启动时就加载动画，可以使用provideAnimations()
    provideHttpClient(withInterceptorsFromDi()),

    // Firebase 配置 - 使用完整的 Firebase 配置對象
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // Firebase 核心服务
    provideAuth(() => getAuth()), // 认证服务
    provideAnalytics(() => getAnalytics()), // 分析服务
    ScreenTrackingService, // 屏幕追踪服务
    UserTrackingService, // 用户追踪服务

    // Firebase App Check 強制模式 - 開發和生產環境都啟用
    provideAppCheck(() => {
      const provider = new ReCaptchaEnterpriseProvider(environment.recaptcha.siteKey);
      return initializeAppCheck(undefined, {
        provider,
        isTokenAutoRefreshEnabled: true
      });
    }),

    // Firebase 数据和功能服务
    provideFirestore(() => getFirestore()), // Firestore 数据库
    provideFunctions(() => getFunctions()), // 云端函数
    provideMessaging(() => getMessaging()), // 推送通知
    providePerformance(() => getPerformance()), // 性能监控
    provideStorage(() => getStorage()), // 文件存储
    provideRemoteConfig(() => getRemoteConfig()), // 远程配置
    provideVertexAI(() => getVertexAI()) // Vertex AI 服務

  ]
};