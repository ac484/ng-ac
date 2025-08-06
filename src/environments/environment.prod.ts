import { Environment } from '@delon/theme';

export const environment = {
  production: true,
  useHash: true,
  api: {
    baseUrl: './',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
  firebase: {
    projectId: 'ng-acc',
    appId: '1:289956121604:web:4dd9d608a2db962aeaf951',
    storageBucket: 'ng-acc.firebasestorage.app',
    apiKey: 'AIzaSyCmWn3NJBClxZeJHsg-eaEaqA3bdB9bzOQ',
    authDomain: 'ng-acc.firebaseapp.com',
    messagingSenderId: '289956121604',
    measurementId: 'G-6YM5S9LCNV'
  }
} as Environment;
