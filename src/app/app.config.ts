import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideNzI18n, zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { ErrorInterceptor } from './shared/infrastructure/interceptors/error.interceptor';
import { LoadingInterceptor } from './shared/infrastructure/interceptors/loading.interceptor';
import { AuthInterceptor } from './shared/infrastructure/interceptors/auth.interceptor';

registerLocaleData(zh);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        ErrorInterceptor,
        LoadingInterceptor,
        AuthInterceptor
      ])
    ),
    provideFirebaseApp(() => initializeApp(environment['firebase'])),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideNzI18n(zh_CN)
  ]
};
