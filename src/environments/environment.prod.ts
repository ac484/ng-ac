export const ip = '1.117.181.242';
export const port = '80';
export const localUrl = `http://${ip}:${port}/api`;

export const environment = {
  production: true,

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
  useHash: true,

  // 攔截器配置
  interceptorFns: [],

  // 額外提供者
  providers: []
};
