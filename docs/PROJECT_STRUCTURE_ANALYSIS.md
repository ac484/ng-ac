# NG-AC Project Structure Analysis

## Project Overview

**Project Name**: ng-ac  
**Framework**: Angular 20 + ng-alain 20  
**Architecture**: Domain-Driven Design (DDD)  
**Authentication**: @delon/auth + Firebase  
**UI Framework**: ng-zorro-antd  

## Root Directory Structure

```
ng-ac/
├── src/                          # Main source code
├── ng-alain-master-參考用專案/    # Reference project
├── docs/                         # Documentation
├── commands/                     # Development commands
├── public/                       # Static assets
├── dist/                         # Build output
├── node_modules/                 # Dependencies
├── .angular/                     # Angular CLI cache
├── .husky/                       # Git hooks
├── .vscode/                      # VS Code settings
├── .cursor/                      # Cursor IDE settings
├── .kiro/                        # Kiro settings
└── Configuration files
```

## Source Code Structure (src/)

### Main Application Files
- `main.ts` - Application entry point
- `index.html` - Main HTML template
- `styles.less` - Global styles
- `style-icons.ts` - Icon definitions
- `style-icons-auto.ts` - Auto-generated icons
- `typings.d.ts` - TypeScript declarations

### App Structure (src/app/)
```
src/app/
├── app.component.ts              # Root component
├── app.config.ts                 # Application configuration
├── app.routes.ts                 # Main routing
├── domain/                       # Domain modules (DDD)
│   ├── auth/                     # Authentication domain
│   ├── dashboard/                # Dashboard domain
│   ├── user/                     # User management domain
│   └── contract-management/      # Contract management domain
└── shared/                       # Shared modules
    ├── application/              # Application services
    ├── domain/                   # Shared domain models
    ├── infrastructure/           # Infrastructure services
    └── presentation/             # Shared UI components
```

## Domain-Driven Design Structure

### Domain Modules (src/app/domain/)
Each domain follows the DDD pattern with these layers:

```
domain-name/
├── application/                  # Application services
│   ├── commands/                 # Command handlers
│   ├── queries/                  # Query handlers
│   └── services/                 # Application services
├── domain/                       # Domain models
│   ├── entities/                 # Domain entities
│   ├── value-objects/            # Value objects
│   ├── aggregates/               # Aggregates
│   └── repositories/             # Repository interfaces
├── infrastructure/               # Infrastructure implementation
│   ├── repositories/             # Repository implementations
│   ├── services/                 # External services
│   └── adapters/                 # External system adapters
└── presentation/                 # UI components
    ├── components/               # Domain-specific components
    ├── pages/                    # Page components
    └── routes/                   # Domain routing
```

### Shared Modules (src/app/shared/)
```
shared/
├── application/                  # Cross-cutting application concerns
│   ├── command-bus.ts           # Command bus
│   ├── event-bus.ts             # Event bus
│   ├── query-bus.ts             # Query bus
│   ├── unit-of-work.ts          # Unit of work pattern
│   └── interfaces/               # Application interfaces
├── domain/                       # Shared domain models
│   ├── base-aggregate-root.ts   # Base aggregate root
│   ├── base-entity.ts           # Base entity
│   ├── domain-event.ts          # Domain events
│   └── value-objects/           # Shared value objects
├── infrastructure/               # Shared infrastructure
│   ├── firebase-config.ts       # Firebase configuration
│   ├── firebase-unit-of-work.ts # Firebase UoW implementation
│   ├── base-repository.ts       # Base repository
│   ├── guards/                  # Route guards
│   ├── interceptors/            # HTTP interceptors
│   └── services/                # Shared services
└── presentation/                 # Shared UI components
    ├── layout/                  # Layout components
    ├── common/                  # Common components
    ├── directives/              # Shared directives
    └── pipes/                   # Shared pipes
```

## Technology Stack Analysis

### Core Dependencies
- **Angular**: 20.0.0 (Latest)
- **ng-alain**: 20.0.0 (Enterprise UI framework)
- **ng-zorro-antd**: 20.0.0 (Ant Design for Angular)
- **Firebase**: 10.0.0 (Backend as a Service)
- **@angular/fire**: 20.0.0 (Firebase Angular integration)

### Key Libraries
- **@delon/auth**: Authentication framework
- **@delon/abc**: ABC components
- **@delon/form**: Form components
- **@delon/theme**: Theme system
- **@delon/util**: Utility functions
- **@delon/mock**: Mock data
- **@delon/chart**: Chart components

### Development Tools
- **TypeScript**: 5.8.2
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Stylelint**: CSS/Less linting
- **Husky**: Git hooks
- **Karma/Jasmine**: Testing

## Configuration Files

### Angular Configuration
- `angular.json` - Angular CLI configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig.app.json` - App-specific TypeScript config
- `tsconfig.spec.json` - Test TypeScript config

### Code Quality
- `eslint.config.mjs` - ESLint configuration
- `stylelint.config.mjs` - Stylelint configuration
- `.prettierrc.js` - Prettier configuration
- `.editorconfig` - Editor configuration

### Build & Development
- `proxy.conf.js` - Development proxy
- `firebase.json` - Firebase configuration
- `ng-alain.json` - ng-alain configuration

## Environment Configuration

### Environment Files
- `src/environments/environment.ts` - Development environment
- `src/environments/environment.prod.ts` - Production environment

### Key Environment Variables
- Firebase configuration
- API endpoints
- Feature flags
- Build optimizations

## Routing Structure

### Main Routes (app.routes.ts)
```typescript
routes: [
  {
    path: 'auth',
    loadChildren: () => import('./domain/auth/presentation/auth.routes')
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authJWTCanActivate],
    children: [
      { path: '', redirectTo: 'dashboard' },
      { path: 'dashboard', loadChildren: () => import('./domain/dashboard/presentation/dashboard.routes') },
      { path: 'users', loadChildren: () => import('./domain/user/presentation/user.routes') }
    ]
  }
]
```

## Authentication Architecture

### Authentication Flow
1. **@delon/auth** - Primary authentication framework
2. **Firebase Auth** - Backend authentication service
3. **JWT Tokens** - Token-based authentication
4. **Route Guards** - Protected routes

### Key Components
- `authJWTCanActivate` - JWT authentication guard
- `authSimpleInterceptor` - HTTP interceptor for auth
- `errorInterceptor` - Error handling interceptor

## Firebase Integration

### Firebase Services
- **Authentication** - User management
- **Firestore** - NoSQL database
- **Functions** - Serverless functions
- **Storage** - File storage
- **Analytics** - Usage analytics
- **Performance** - Performance monitoring
- **Messaging** - Push notifications
- **Remote Config** - Feature flags
- **Vertex AI** - AI/ML services

### Configuration
- Environment-based Firebase config
- App Check with reCAPTCHA Enterprise
- Automatic token refresh

## Development Workflow

### Scripts (package.json)
```json
{
  "start": "ng s -o",
  "build": "npm run ng-high-memory build",
  "test": "ng test",
  "lint": "npm run lint:ts && npm run lint:style",
  "theme": "ng-alain-plugin-theme -t=themeCss",
  "icon": "ng g ng-alain:plugin icon"
}
```

### Code Quality
- **ESLint** - TypeScript/JavaScript linting
- **Stylelint** - CSS/Less linting
- **Prettier** - Code formatting
- **Husky** - Pre-commit hooks
- **Lint-staged** - Staged file linting

## Build Configuration

### Memory Optimization
- High memory build script for large applications
- Source map analysis capabilities
- Bundle analysis tools

### Development Features
- Hot Module Replacement (HMR)
- Development proxy configuration
- Environment-specific builds

## Testing Strategy

### Testing Framework
- **Karma** - Test runner
- **Jasmine** - Testing framework
- **@delon/testing** - ng-alain testing utilities

### Test Coverage
- Unit tests with code coverage
- Component testing
- Service testing

## Documentation Structure

### Documentation Files
- `README.md` - Project overview
- `ARCHITECTURE_DECISIONS.md` - Architecture decisions
- `DDD_DEVELOPMENT_STANDARDS.md` - DDD standards
- `FEATURE_DEVELOPMENT_GUIDELINES.md` - Development guidelines
- `MINIMALIST_DESIGN_PRINCIPLES.md` - Design principles
- `VALIDATION_REPORT.md` - Project validation

## Key Architectural Patterns

### Domain-Driven Design
- **Bounded Contexts** - Clear domain boundaries
- **Aggregates** - Transactional boundaries
- **Entities** - Domain objects with identity
- **Value Objects** - Immutable domain values
- **Repositories** - Data access abstraction
- **Domain Events** - Domain state changes

### CQRS Pattern
- **Commands** - State-changing operations
- **Queries** - Read-only operations
- **Command Bus** - Command routing
- **Query Bus** - Query routing

### Clean Architecture
- **Presentation Layer** - UI components
- **Application Layer** - Use cases
- **Domain Layer** - Business logic
- **Infrastructure Layer** - External concerns

## Development Standards

### Code Organization
- Feature-based folder structure
- Shared code in shared modules
- Domain-specific code in domain modules
- Clear separation of concerns

### Naming Conventions
- **Files**: kebab-case
- **Components**: PascalCase
- **Services**: PascalCase
- **Interfaces**: PascalCase with 'I' prefix
- **Constants**: UPPER_SNAKE_CASE

### Import Organization
- Angular imports first
- Third-party libraries
- Internal modules
- Relative imports last

## Performance Considerations

### Bundle Optimization
- Lazy loading for feature modules
- Tree shaking for unused code
- Code splitting strategies
- Memory optimization for large builds

### Runtime Performance
- OnPush change detection strategy
- TrackBy functions for ngFor
- Virtual scrolling for large lists
- Lazy loading of components

## Security Considerations

### Authentication
- JWT token validation
- Route protection
- HTTP interceptor for auth headers
- App Check for Firebase security

### Data Validation
- Input validation
- Output sanitization
- XSS prevention
- CSRF protection

## Deployment Strategy

### Build Process
- Environment-specific builds
- Production optimizations
- Asset optimization
- Bundle analysis

### Firebase Hosting
- Static file hosting
- CDN distribution
- SSL certificates
- Custom domains

## Monitoring and Analytics

### Firebase Analytics
- User behavior tracking
- Performance monitoring
- Error reporting
- Custom events

### Application Monitoring
- Error boundaries
- Performance metrics
- User experience tracking
- Business metrics

## Future Considerations

### Scalability
- Micro-frontend architecture potential
- Service worker implementation
- Progressive Web App features
- Internationalization support

### Maintainability
- Comprehensive documentation
- Automated testing
- Code quality tools
- Regular dependency updates

---

*This document serves as a comprehensive reference for the NG-AC project structure and should be updated as the project evolves.* 