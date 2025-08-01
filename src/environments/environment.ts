// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const ip = 'localhost';
const port = '4201';
export const localUrl = `http://${ip}:${port}`;

export const environment = {
  production: false,

  // Firebase 配置
  firebase: {
    apiKey: "AIzaSyCmWn3NJBClxZeJHsg-eaEaqA3bdB9bzOQ",
    authDomain: "ng-acc.firebaseapp.com",
    projectId: "ng-acc",
    storageBucket: "ng-acc.firebasestorage.app",
    messagingSenderId: "289956121604",
    appId: "1:289956121604:web:4dd9d608a2db962aeaf951",
    measurementId: "G-6YM5S9LCNV"
  },

  // 應用程式配置
  app: {
    name: 'NG-AC Admin',
    version: '1.0.0'
  },

  // API 配置
  api: {
    baseUrl: localUrl,
    timeout: 30000,
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },

  // 路由配置
  useHash: false,

  // 攔截器配置
  interceptorFns: [],

  // 額外提供者
  providers: []
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
