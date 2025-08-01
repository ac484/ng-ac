# Project Context - NG-AC Angular + ng-alain

## Project Overview
**Name**: ng-ac (Angular Admin Console)  
**Type**: Enterprise Admin Dashboard  
**Framework**: Angular 19.2.0 + NG-ALAIN 19.2  
**Backend**: Firebase 11.10.0 (Complete Integration)  
**Complexity**: Level 3-4 (Complex System)

## Technical Architecture

### Core Technology Stack
```typescript
// Framework & Libraries
Angular: 19.2.0 (Latest LTS)
NG-ALAIN: 19.2 (Enterprise Admin Framework)
NG-ZORRO: 19.2.1 (Ant Design Components)
Firebase: 11.10.0 (Complete Backend Integration)
TypeScript: 5.7.2 (Strict Mode)

// Development Tools
ESLint + Prettier + Stylelint
Husky + lint-staged
Karma + Jasmine
Source Map Explorer
pnpm (Package Manager)
```

### Project Structure
```
ng-ac/
├── src/app/
│   ├── core/                    # Core services
│   │   ├── auth/               # Firebase authentication (9 files)
│   │   ├── i18n/               # Internationalization
│   │   ├── net/                # HTTP interceptors
│   │   └── startup/            # Application startup
│   ├── layout/                 # Layout components
│   │   ├── basic/              # Main layout with widgets
│   │   ├── blank/              # Minimal layout
│   │   └── passport/           # Authentication layout
│   ├── routes/                 # Route definitions
│   │   ├── dashboard/          # Dashboard component
│   │   ├── exception/          # Error pages
│   │   └── passport/           # Auth pages
│   └── shared/                 # Shared modules
│       ├── cell-widget/        # Custom cell widgets
│       ├── st-widget/          # ST table widgets
│       └── components/         # Shared components
├── memory-bank/                # Memory Bank system
├── custom_modes/               # Mode documentation
└── optimization-journey/       # Optimization documentation
```

## Firebase Integration Status

### Configured Services
```typescript
// Firebase Configuration
Project ID: ng-acc
App ID: 1:289956121604:web:4dd9d608a2db962aeaf951
Storage Bucket: ng-acc.firebasestorage.app
Auth Domain: ng-acc.firebaseapp.com
Messaging Sender ID: 289956121604
Measurement ID: G-6YM5S9LCNV
reCAPTCHA Site Key: 6LdMz5YrAAAAAJE130XrD8SxJ3Ijn2ZATV-BQQwo

// Services Status
✅ Authentication with reCAPTCHA
✅ Firestore Database
✅ Analytics with screen/user tracking
✅ Storage for file management
✅ Functions for serverless operations
✅ Messaging for notifications
✅ Performance monitoring
✅ Remote config for feature flags
✅ Vertex AI for ML capabilities
✅ App Check with reCAPTCHA security
```

### Authentication System
```typescript
// Auth Service Architecture
src/app/core/auth/
├── firebase-auth-adapter.service.ts    // Firebase adapter
├── auth-state-manager.service.ts       // State management
├── firebase-token.interceptor.ts       // Token handling
├── firebase-auth.guard.ts             // Route protection
├── session-manager.service.ts          // Session management
├── token-sync.service.ts              // Token synchronization
├── firebase-error-handler.service.ts   // Error handling
├── auth.types.ts                      // Type definitions
└── index.ts                           // Public API
```

## Development Environment

### Build Configuration
```json
{
  "scripts": {
    "start": "ng s -o",
    "build": "pnpm run ng-high-memory build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "analyze": "pnpm run ng-high-memory build -- --source-map",
    "analyze:view": "pnpm exec source-map-explorer dist/**/*.js",
    "ng-high-memory": "node --max_old_space_size=8000 ./node_modules/@angular/cli/bin/ng"
  }
}
```

### Quality Tools
```json
{
  "lint-staged": {
    "(src)/**/*.{html,ts}": ["eslint --fix"],
    "(src)/**/*.less": ["pnpm run lint:style"]
  }
}
```

## Current Features

### Core Functionality
- ✅ **Authentication**: Token-based with refresh mechanism
- ✅ **Internationalization**: Multi-language support (zh-CN, zh-TW, en-US)
- ✅ **Theming**: Default, Dark, Compact themes
- ✅ **Layout System**: Basic, Blank, Passport layouts
- ✅ **Route Guards**: Navigation protection and access control
- ✅ **SSR**: Server-Side Rendering enabled
- ✅ **Analytics**: Screen and user tracking
- ✅ **Security**: App Check with reCAPTCHA

### Widget System
```typescript
// Header Widgets
- HeaderSearchComponent
- HeaderFullScreenComponent
- HeaderClearStorageComponent
- HeaderI18nComponent
- HeaderUserComponent

// Layout Widgets
- LayoutDefaultModule
- SettingDrawerModule
- ThemeBtnComponent
```

### Shared Modules
```typescript
// Delon Modules
- PageHeaderModule
- STModule (Simple Table)
- SEModule (Simple Edit)
- SVModule (Simple View)
- DelonFormModule

// Zorro Modules
- NzFormModule, NzGridModule, NzButtonModule
- NzInputModule, NzAlertModule, NzProgressModule
- NzSelectModule, NzAvatarModule, NzCardModule
- NzDropDownModule, NzPopconfirmModule, NzTableModule
- NzPopoverModule, NzDrawerModule, NzModalModule
- NzTabsModule, NzToolTipModule, NzIconModule
- NzCheckboxModule, NzSpinModule
```

## User Requirements

### Core Requirements
1. **不要破壞現有功能** (Don't break existing functionality)
2. **請主動簡化、合併、移除冗餘，並重構為最佳實踐** (Actively simplify, merge, remove redundancy, and refactor to best practices)
3. **每次產生都要主動 collapse、refactor for minimalism and best practice** (Always actively collapse and refactor for minimalism and best practice)

### Technical Requirements
- **分層** (Layering): Proper separation of concerns
- **型別** (Types): Enhanced TypeScript usage
- **事件** (Events): Proper event handling
- **UI/Service分離** (UI/Service separation): Clean architecture

## Optimization Opportunities

### High Priority
1. **Service Layer Consolidation**
   - Simplify 9 auth service files
   - Merge related functionality
   - Improve separation of concerns

2. **Component Architecture**
   - Create reusable component patterns
   - Optimize widget system
   - Enhance type safety

3. **Code Simplification**
   - Remove redundant modules
   - Consolidate similar functionality
   - Implement best practices

### Medium Priority
1. **Performance Optimization**
   - Bundle size reduction
   - Lazy loading implementation
   - Caching strategy

2. **Widget System Enhancement**
   - Expand custom widgets
   - Improve reusability
   - Better documentation

3. **Mock Data Organization**
   - Structure mock data better
   - Improve testing capabilities
   - Enhance development workflow

## Technical Debt Assessment

### Low Debt Areas
- ✅ Modern Angular practices
- ✅ Comprehensive testing setup
- ✅ Quality tools (ESLint, Prettier, Stylelint)
- ✅ Firebase integration
- ✅ Internationalization

### Medium Debt Areas
- 🔄 Auth service complexity (9 files)
- 🔄 Widget system optimization
- 🔄 Bundle size optimization
- 🔄 Mock data organization

### High Debt Areas
- 🔄 Service layer consolidation needed
- 🔄 Component reusability improvements
- 🔄 Performance optimization opportunities

## Development Workflow

### Current Mode
- **Mode**: VAN (Vehicle Analysis & Navigation)
- **Phase**: Analysis Complete
- **Next Mode**: PLAN (Architecture Planning)
- **Complexity Level**: Level 3-4 (Complex System)

### Mode Progression
```
VAN (Analysis) → PLAN (Architecture) → CREATIVE (Design) → IMPLEMENT (Development) → QA (Validation)
```

### Memory Bank System
```typescript
// Memory Bank Files
memory-bank/
├── memory.json              // Project state tracking
├── activeContext.md         // Current focus
├── projectbrief.md          // Project foundation
└── tasks.md                 // Task tracking
```

## Key Insights

### Strengths
- ✅ Well-structured enterprise foundation
- ✅ Comprehensive Firebase integration
- ✅ Modern Angular practices with SSR
- ✅ Complete development toolchain
- ✅ Quality gates and testing setup

### Opportunities
- 🔄 Service layer simplification
- 🔄 Component architecture improvements
- 🔄 Performance optimization
- 🔄 Code consolidation and best practices

### Risks
- ⚠️ Service complexity may impact maintainability
- ⚠️ Bundle size could affect performance
- ⚠️ Widget system needs optimization

## Ready for Enhancement

The NG-AC project is well-positioned for systematic improvement while maintaining all existing functionality. The foundation is solid with modern Angular practices, comprehensive Firebase integration, and enterprise-grade development tools.

**Next Steps**:
1. **PLAN Mode**: Architecture planning and component design
2. **CREATIVE Mode**: Design exploration and innovation
3. **IMPLEMENT Mode**: Systematic development
4. **QA Mode**: Quality validation and testing

**Success Criteria**:
- Maintain all existing functionality
- Improve code organization and maintainability
- Enhance performance and user experience
- Implement best practices and standards