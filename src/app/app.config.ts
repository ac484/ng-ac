import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import zh from '@angular/common/locales/zh';
import { default as ngLang } from '@angular/common/locales/zh-Hant';
import { ApplicationConfig, EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';
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
import { authSimpleInterceptor, provideAuth } from '@delon/auth';
import { provideSFConfig } from '@delon/form';
import { AlainProvideLang, provideAlain, zh_TW as delonLang } from '@delon/theme';
import { AlainConfig } from '@delon/util/config';
import { environment } from '../environments/environment';
import { zhTW as dateLang } from 'date-fns/locale';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { zh_TW as zorroLang, provideNzI18n } from 'ng-zorro-antd/i18n';

import { routes } from './app.routes';
import { ICONS } from '../style-icons';
import { ICONS_AUTO } from '../style-icons-auto';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai';
import { errorInterceptor } from './shared/infrastructure/interceptors/error.interceptor';
import { UnitOfWork } from './shared/application/unit-of-work';
import { FirebaseUnitOfWork } from './shared/infrastructure/firebase-unit-of-work';
import { SimpleReuseStrategy } from './shared/infrastructure/reuse-strategy';
import { CONTRACT_EXTRACTION_PROVIDERS } from './domain/contract-extraction/infrastructure/providers';



registerLocaleData(zh);

const defaultLang: AlainProvideLang = {
    abbr: 'zh-Hant',
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
    auth: { login_url: '/auth/login' }
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
        initializeApp(environment['firebase'])
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
            withInterceptors([...(environment.interceptorFns ?? []), authSimpleInterceptor, errorInterceptor])
        ),
        provideAnimations(),
        provideAnimationsAsync(),
        provideRouter(routes, ...routerFeatures),
        { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy },

        // ng-zorro-antd providers
        provideNzIcons(ICONS_AUTO),
        provideNzI18n(zorroLang),
        provideNzConfig(ngZorroConfig),

        // ng-alain providers
        provideAlain({ config: alainConfig, defaultLang, icons: [...ICONS_AUTO, ...ICONS] }),
        provideAuth(),
        provideSFConfig(),

        // Forms module
        importProvidersFrom(FormsModule),

        // Firebase providers
        ...firebaseProviders,



        // Unit of Work
        { provide: UnitOfWork, useClass: FirebaseUnitOfWork },

        // Domain providers
        ...CONTRACT_EXTRACTION_PROVIDERS,

        // Environment specific providers
        ...(environment.providers || [])
    ]
};
