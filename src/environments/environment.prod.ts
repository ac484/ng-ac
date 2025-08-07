import { Environment } from '@delon/theme';

import { firebaseAuthInterceptor } from '../app/domains/auth/infrastructure/interceptors/firebase-auth.interceptor';

export const environment = {
  production: true,
  useHash: true,
  api: {
    baseUrl: './',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
  interceptorFns: [firebaseAuthInterceptor]
} as Environment;
