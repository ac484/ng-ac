import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { default as ngLang } from '@angular/common/locales/zh';
import { ApplicationConfig, EnvironmentProviders, Provider } from '@angular/core';
import { getAI, provideAI } from '@angular/fire/ai';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getAuth, provideAuth as provideAuth_alias } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withHashLocation,
  RouterFeatures,
  withViewTransitions
} from '@angular/router';
import { I18NService, defaultInterceptor, provideBindAuthRefresh, provideStartup } from '@core';
import { provideCellWidgets } from '@delon/abc/cell';
import { provideSTWidgets } from '@delon/abc/st';
import { authSimpleInterceptor, provideAuth } from '@delon/auth';
import { provideSFConfig } from '@delon/form';
import { AlainProvideLang, provideAlain, zh_CN as delonLang } from '@delon/theme';
import { AlainConfig } from '@delon/util/config';
import { environment } from '@env/environment';
import { CELL_WIDGETS, SF_WIDGETS, ST_WIDGETS } from '@shared';
import { zhCN as dateLang } from 'date-fns/locale';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { zh_CN as zorroLang } from 'ng-zorro-antd/i18n';

import { ICONS } from '../style-icons';
import { ICONS_AUTO } from '../style-icons-auto';
import { AUTH_PROVIDERS } from './domains/auth/auth.providers';
import { BUSINESS_PARTNER_PROVIDERS } from './domains/business-partner/business-partner.providers';
import { CONTRACT_MANAGEMENT_PROVIDERS } from './domains/contract-management';
import { routes } from './routes/routes';

const defaultLang: AlainProvideLang = {
  abbr: 'zh-CN',
  ng: ngLang,
  zorro: zorroLang,
  date: dateLang,
  delon: delonLang
};

const alainConfig: AlainConfig = {
  st: { modal: { size: 'lg' } },
  pageHeader: { homeI18n: 'home' },
  lodop: {
    license: `A59B099A586B3851E0F0D7FDBF37B603`,
    licenseA: `C94CEE276DB2187AE6B65D56B3FC2848`
  },
  auth: { login_url: '/passport/login' }
};

const ngZorroConfig: NzConfig = {};

const routerFeatures: RouterFeatures[] = [
  withComponentInputBinding(),
  withViewTransitions(),
  withInMemoryScrolling({ scrollPositionRestoration: 'top' })
];
if (environment.useHash) routerFeatures.push(withHashLocation());

const providers: Array<Provider | EnvironmentProviders> = [
  provideHttpClient(withInterceptors([...(environment.interceptorFns ?? []), authSimpleInterceptor, defaultInterceptor])),
  provideAnimations(),
  provideRouter(routes, ...routerFeatures),
  provideAlain({ config: alainConfig, defaultLang, i18nClass: I18NService, icons: [...ICONS_AUTO, ...ICONS] }),
  provideNzConfig(ngZorroConfig),
  provideAuth(),
  provideCellWidgets(...CELL_WIDGETS),
  provideSTWidgets(...ST_WIDGETS),
  provideSFConfig({ widgets: SF_WIDGETS }),
  provideStartup(),
  ...CONTRACT_MANAGEMENT_PROVIDERS,
  ...BUSINESS_PARTNER_PROVIDERS,
  ...AUTH_PROVIDERS,
  ...(environment.providers || [])
];

// If you use `@delon/auth` to refresh the token, additional registration `provideBindAuthRefresh` is required
if (environment.api?.refreshTokenEnabled && environment.api.refreshTokenType === 'auth-refresh') {
  providers.push(provideBindAuthRefresh());
}

export const appConfig: ApplicationConfig = {
  providers: [
    ...providers,
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
    provideAI(() => getAI())
  ]
};
