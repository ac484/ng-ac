# Technology Stack Detailed Analysis

## Overview

This document provides a comprehensive analysis of the NG-AC project's technology stack, including dependencies, configurations, and integration patterns.

## Core Framework Stack

### Angular 20.0.0
**Purpose**: Core application framework

#### Key Features
- **Standalone Components**: Modern Angular architecture
- **Signals**: Reactive state management
- **Control Flow**: New template syntax
- **Deferrable Views**: Performance optimization
- **Server-Side Rendering**: SSR capabilities

#### Configuration
```typescript
// angular.json
{
  "projects": {
    "ng-ac": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/ng-ac",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.less"],
            "scripts": []
          }
        }
      }
    }
  }
}
```

### ng-alain 20.0.0
**Purpose**: Enterprise UI framework built on Angular

#### Key Components
- **@delon/theme**: Theme system and layout
- **@delon/abc**: ABC components (tables, forms, etc.)
- **@delon/form**: Form components and validation
- **@delon/auth**: Authentication framework
- **@delon/acl**: Access control list
- **@delon/util**: Utility functions
- **@delon/mock**: Mock data generation
- **@delon/chart**: Chart components

#### Configuration
```typescript
// app.config.ts
import { provideAlain } from '@delon/theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAlain({
      config: {
        auth: { login_url: '/auth/login' }
      },
      defaultLang,
      icons: [...ICONS_AUTO, ...ICONS]
    })
  ]
};
```

### ng-zorro-antd 20.0.0
**Purpose**: Ant Design components for Angular

#### Key Components
- **Layout**: Grid system and layout components
- **Navigation**: Menu, breadcrumb, tabs
- **Data Entry**: Forms, inputs, selectors
- **Data Display**: Tables, lists, cards
- **Feedback**: Modals, notifications, messages
- **Other**: Icons, buttons, dividers

#### Configuration
```typescript
// app.config.ts
import { provideNzConfig, provideNzI18n } from 'ng-zorro-antd';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNzConfig(ngZorroConfig),
    provideNzI18n(zorroLang),
    provideNzIcons(ICONS_AUTO)
  ]
};
```

## Backend Integration

### Firebase 10.0.0
**Purpose**: Backend as a Service (BaaS)

#### Services Used
- **Authentication**: User management
- **Firestore**: NoSQL database
- **Functions**: Serverless functions
- **Storage**: File storage
- **Analytics**: Usage analytics
- **Performance**: Performance monitoring
- **Messaging**: Push notifications
- **Remote Config**: Feature flags
- **Vertex AI**: AI/ML services

#### Configuration
```typescript
// app.config.ts
const firebaseProviders: Array<Provider | EnvironmentProviders> = [
  provideFirebaseApp(() => initializeApp(environment['firebase'])),
  provideAuth_alias(() => getAuth()),
  provideAnalytics(() => getAnalytics()),
  provideAppCheck(() => {
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
```

### @angular/fire 20.0.0
**Purpose**: Firebase Angular integration

#### Key Features
- **Type Safety**: Full TypeScript support
- **Reactive**: RxJS integration
- **Offline Support**: Offline data persistence
- **Security**: Built-in security features

## Development Tools

### TypeScript 5.8.2
**Purpose**: Type-safe JavaScript

#### Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": false,
    "lib": ["ES2022", "dom"],
    "module": "ES2022",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### ESLint 9.31.0
**Purpose**: Code linting and quality

#### Configuration
```javascript
// eslint.config.mjs
export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      '@angular-eslint': angularEslint,
      'import': importPlugin,
      'prefer-arrow': preferArrowPlugin,
      'jsdoc': jsdocPlugin,
      'prettier': prettierPlugin,
      'unused-imports': unusedImportsPlugin
    },
    rules: {
      // Linting rules configuration
    }
  }
];
```

### Prettier 3.6.2
**Purpose**: Code formatting

#### Configuration
```javascript
// .prettierrc.js
module.exports = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'none',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf'
};
```

### Stylelint 16.22.0
**Purpose**: CSS/Less linting

#### Configuration
```javascript
// stylelint.config.mjs
export default [
  {
    files: ['**/*.less'],
    extends: [
      'stylelint-config-standard',
      'stylelint-config-clean-order'
    ],
    plugins: [
      'stylelint-declaration-block-no-ignored-properties'
    ],
    rules: {
      // Stylelint rules configuration
    }
  }
];
```

## Testing Framework

### Karma 6.4.0
**Purpose**: Test runner

#### Configuration
```javascript
// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/ng-ac'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
```

### Jasmine 5.7.0
**Purpose**: Testing framework

#### Key Features
- **BDD**: Behavior-driven development
- **Matchers**: Rich assertion library
- **Spies**: Mock and spy functionality
- **Async Testing**: Promise and async support

## Build and Development Tools

### Angular CLI 20.0.0
**Purpose**: Angular development tools

#### Key Commands
```bash
# Development
ng serve -o          # Start development server
ng build             # Build for production
ng test              # Run tests
ng e2e               # Run end-to-end tests

# Code Generation
ng generate component # Generate components
ng generate service   # Generate services
ng generate module    # Generate modules
ng generate pipe      # Generate pipes
ng generate directive # Generate directives

# Analysis
ng build --source-map # Build with source maps
ng analyze            # Analyze bundle size
```

### Husky 9.1.7
**Purpose**: Git hooks

#### Configuration
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

### Lint-staged 16.1.2
**Purpose**: Run linters on staged files

#### Configuration
```json
// package.json
{
  "lint-staged": {
    "(src)/**/*.{html,ts}": [
      "eslint --fix"
    ],
    "(src)/**/*.less": [
      "npm run lint:style"
    ]
  }
}
```

## Additional Libraries

### RxJS 7.8.0
**Purpose**: Reactive programming

#### Key Features
- **Observables**: Stream-based programming
- **Operators**: Data transformation
- **Subjects**: Multicast observables
- **Schedulers**: Async execution control

### Lodash 4.17.21
**Purpose**: Utility functions

#### Key Features
- **Array Methods**: Array manipulation
- **Object Methods**: Object utilities
- **String Methods**: String utilities
- **Math Methods**: Mathematical operations

### UUID 11.1.0
**Purpose**: Unique identifier generation

#### Usage
```typescript
import { v4 as uuidv4 } from 'uuid';

const id = uuidv4(); // Generate unique ID
```

### Screenfull 6.0.2
**Purpose**: Fullscreen API wrapper

#### Usage
```typescript
import screenfull from 'screenfull';

if (screenfull.isEnabled) {
  screenfull.request();
}
```

## Performance Optimization

### Memory Optimization
```json
// package.json
{
  "scripts": {
    "ng-high-memory": "node --max_old_space_size=8000 ./node_modules/@angular/cli/bin/ng",
    "build": "npm run ng-high-memory build"
  }
}
```

### Bundle Analysis
```json
// package.json
{
  "scripts": {
    "analyze": "npm run ng-high-memory build -- --source-map",
    "analyze:view": "source-map-explorer dist/**/*.js"
  }
}
```

## Environment Configuration

### Development Environment
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  useHash: false,
  firebase: {
    apiKey: 'your-api-key',
    authDomain: 'your-auth-domain',
    projectId: 'your-project-id',
    storageBucket: 'your-storage-bucket',
    messagingSenderId: 'your-messaging-sender-id',
    appId: 'your-app-id',
    measurementId: 'your-measurement-id'
  },
  interceptorFns: [],
  providers: []
};
```

### Production Environment
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  useHash: true,
  firebase: {
    // Production Firebase config
  },
  interceptorFns: [],
  providers: []
};
```

## Security Configuration

### App Check
```typescript
// app.config.ts
provideAppCheck(() => {
  const provider = new ReCaptchaEnterpriseProvider('6Lfet5crAAAAAFDXayzMocp-GhB88FewdQ8Z9E69');
  return initializeAppCheck(undefined, { 
    provider, 
    isTokenAutoRefreshEnabled: true 
  });
})
```

### Authentication Interceptors
```typescript
// app.config.ts
provideHttpClient(
  withInterceptors([
    ...(environment.interceptorFns ?? []), 
    authSimpleInterceptor, 
    errorInterceptor
  ])
)
```

## Internationalization

### Locale Configuration
```typescript
// app.config.ts
import zh from '@angular/common/locales/zh';
import { default as ngLang } from '@angular/common/locales/zh-Hant';
import { zh_TW as delonLang } from '@delon/theme';
import { zh_TW as zorroLang } from 'ng-zorro-antd/i18n';
import { zhTW as dateLang } from 'date-fns/locale';

const defaultLang: AlainProvideLang = {
  abbr: 'zh-Hant',
  ng: ngLang,
  zorro: zorroLang,
  date: dateLang,
  delon: delonLang
};
```

## Development Workflow

### Scripts Overview
```json
// package.json
{
  "scripts": {
    "start": "ng s -o",
    "build": "npm run ng-high-memory build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "test-coverage": "ng test --code-coverage --watch=false",
    "lint": "npm run lint:ts && npm run lint:style",
    "lint:ts": "npx eslint --cache --fix",
    "lint:style": "npx stylelint \"src/**/*.less\" --fix",
    "theme": "ng-alain-plugin-theme -t=themeCss",
    "icon": "ng g ng-alain:plugin icon"
  }
}
```

### Development Commands
```bash
# Start development
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Generate theme
npm run theme

# Generate icons
npm run icon
```

## Deployment Configuration

### Firebase Hosting
```json
// firebase.json
{
  "hosting": {
    "public": "dist/ng-ac",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Proxy Configuration
```javascript
// proxy.conf.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  );
};
```

## Monitoring and Analytics

### Firebase Analytics
```typescript
// app.config.ts
provideAnalytics(() => getAnalytics()),
ScreenTrackingService,
UserTrackingService
```

### Performance Monitoring
```typescript
// app.config.ts
providePerformance(() => getPerformance())
```

## Future Considerations

### Potential Upgrades
- **Angular 21**: Latest Angular features
- **Firebase 11**: Latest Firebase features
- **ng-alain 21**: Latest ng-alain features
- **TypeScript 6**: Latest TypeScript features

### Performance Optimizations
- **Service Workers**: Offline capabilities
- **PWA**: Progressive Web App features
- **SSR**: Server-side rendering
- **Micro-frontends**: Scalable architecture

### Security Enhancements
- **Content Security Policy**: XSS prevention
- **HTTPS**: Secure communication
- **Input Validation**: Data sanitization
- **Rate Limiting**: API protection

---

*This document provides comprehensive guidance on the technology stack and should be updated as dependencies evolve.* 