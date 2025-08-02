// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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

  // reCAPTCHA 配置
  recaptcha: {
    siteKey: '6LdMz5YrAAAAAJE130XrD8SxJ3Ijn2ZATV-BQQwo'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
