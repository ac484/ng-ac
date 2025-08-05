import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import zh from '@angular/common/locales/zh';
import { default as ngLang } from '@angular/common/locales/zh-Hant';
import { ApplicationConfig, EnvironmentProviders, Provider, importProvidersFrom, ErrorHandler } from '@angular/core';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getAuth, provideAuth as provideAuth_alias } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withViewTransitions, withInMemoryScrolling, withHashLocation, RouterFeatures, RouteReuseStrategy } from '@angular/router';
import { provideCellWidgets } from '@delon/abc/cell';
import { provideSTWidgets } from '@delon/abc/st';
import { authSimpleInterceptor, provideAuth } from '@delon/auth';
import { provideSFConfig } from '@delon/form';
import { AlainProvideLang, provideAlain, zh_TW as delonLang } from '@delon/theme';
import { AlainConfig } from '@delon/util/config';
import { environment } from '../environments/environment';
import { zhTW as dateLang } from 'date-fns/locale';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { zh_TW as zorroLang, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzMessage } from 'ng-zorro-antd/message';
import { provideNzModal } from 'ng-zorro-antd/modal';

import { routes } from './app.routes';
import { ICONS } from '../style-icons';
import { ICONS_AUTO } from '../style-icons-auto';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai';

import { provideRepositories } from './infrastructure/providers/repository.providers';

// Import migrated services from infrastructure layer
import { provideStartup } from './infrastructure/services/startup.service';
import { I18NService } from './infrastructure/services/i18n.service';

// DDD Tab Infrastructure
import { TabReuseStrategyService } from './infrastructure/services/tab-reuse-strategy.service';

// Global Error Handler
import { GlobalErrorHandler } from './shared/errors/global-error-handler';

registerLocaleData(zh);

const defaultLang: AlainProvideLang = {
  abbr: 'zh-Hant',
  ng: ngLang,
  zorro: zorroLang,
  date: dateLang,
  delon: delonLang
};

const alainConfig: AlainConfig = {
  auth: { login_url: '/passport/login' }
};

const ngZorroConfig: NzConfig = {};

const routerFeatures: RouterFeatures[] = [
  withComponentInputBinding(),
  withViewTransitions(),
  withInMemoryScrolling({ scrollPositionRestoration: 'top' })
];
if (environment.useHash) routerFeatures.push(withHashLocation());

// Firebase providers
const firebaseProviders: Array<Provider | EnvironmentProviders> = [
  provideFirebaseApp(() =>
    initializeApp({
      projectId: 'ng-acc',
      appId: '1:289956121604:web:4dd9d608a2db962aeaf951',
      storageBucket: 'ng-acc.firebasestorage.app',
      apiKey: 'AIzaSyCmWn3NJBClxZeJHsg-eaEaqA3bdB9bzOQ',
      authDomain: 'ng-acc.firebaseapp.com',
      messagingSenderId: '289956121604',
      measurementId: 'G-6YM5S9LCNV'
    })
  ),
  provideAuth_alias(() => getAuth()),
  provideAnalytics(() => getAnalytics()),
  ScreenTrackingService,
  UserTrackingService,
  provideAppCheck(() => {
    // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
    const provider = new ReCaptchaEnterpriseProvider('6Lfet5crAAAAAFDXayzMocp-GhB88FewdQ8Z9E69');
    return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
  }),
  provideFirestore(() => getFirestore()),
  provideFunctions(() => getFunctions()),
  provideMessaging(() => getMessaging()),
  providePerformance(() => getPerformance()),
  provideStorage(() => getStorage()),
  provideRemoteConfig(() => getRemoteConfig()),
  provideVertexAI(() => getVertexAI())
];

export const appConfig: ApplicationConfig = {
  providers: [
    // Core Angular providers
    provideHttpClient(
      withInterceptors([...(environment.interceptorFns ?? []), authSimpleInterceptor])
    ),
    provideAnimations(),
    provideAnimationsAsync(),
    provideRouter(routes, ...routerFeatures),

    // ng-zorro-antd providers
    provideNzIcons(ICONS_AUTO),
    provideNzI18n(zorroLang),
    provideNzConfig(ngZorroConfig),
    provideNzMessage(),
    provideNzModal(),

    // ng-alain providers
    provideAlain({ config: alainConfig, defaultLang, i18nClass: I18NService, icons: [...ICONS_AUTO, ...ICONS] }),
    provideAuth(),
    provideCellWidgets(),
    provideSTWidgets(),
    provideSFConfig({
      widgets: []
    }),
    provideStartup(),

    // Forms module
    importProvidersFrom(FormsModule),

    // Firebase providers
    ...firebaseProviders,

    // DDD Repository providers (unified)
    ...provideRepositories(),

    // DDD Tab Infrastructure - Route Reuse Strategy
    { provide: RouteReuseStrategy, useClass: TabReuseStrategyService },

    // Global Error Handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },

    // Environment specific providers
    ...(environment.providers || [])
  ]
};
