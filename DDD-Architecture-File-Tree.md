# DDD Architecture File Tree Documentation

## 🏗️ Domain-Driven Design (DDD) Architecture Overview

This document provides a comprehensive file tree structure of the new DDD architecture implemented in the Angular application.

## 📁 Complete File Tree Structure

```
src/app/
├── README-DDD.md                    # DDD Architecture Documentation
├── app.component.ts                  # Main App Component
├── app.config.ts                     # App Configuration
├── app.html                          # App Template
├── app.less                          # App Styles
├── app.routes.ts                     # Main Routes
├── app.ts                            # App Entry Point
├── icons-provider.ts                 # Icon Provider Configuration
│
├── domain/                           # 🎯 Domain Layer (Core Business Logic)
│   ├── index.ts                      # Domain Layer Exports
│   ├── aggregate-root.ts             # Base Aggregate Root Class
│   │
│   ├── entities/                     # Domain Entities
│   │   ├── base-entity.ts            # Base Entity Class
│   │   ├── aggregate-root.ts         # Aggregate Root Base Class
│   │   ├── user.entity.ts            # User Domain Entity
│   │   ├── account.entity.ts         # Account Domain Entity
│   │   ├── transaction.entity.ts     # Transaction Domain Entity
│   │   ├── auth.entity.ts            # Authentication Entity
│   │   ├── role.entity.ts            # Role Entity
│   │   ├── permission.entity.ts      # Permission Entity
│   │   └── tab.entity.ts             # Tab Entity
│   │
│   ├── value-objects/                # Value Objects
│   │   ├── index.ts                  # Value Objects Exports
│   │   ├── README.md                 # Value Objects Documentation
│   │   │
│   │   ├── authentication/           # Authentication Value Objects
│   │   │   ├── email.value-object.ts # Email Value Object
│   │   │   ├── display-name.value-object.ts # Display Name Value Object
│   │   │   ├── firebase-auth-error.value-object.ts # Firebase Auth Error
│   │   │   ├── auth-method.value-object.ts # Auth Method Value Object
│   │   │   ├── auth-provider.value-object.ts # Auth Provider Value Object
│   │   │   ├── firebase-uid.value-object.ts # Firebase UID Value Object
│   │   │   ├── password.value-object.ts # Password Value Object
│   │   │   ├── photo-url.value-object.ts # Photo URL Value Object
│   │   │   ├── session-id.value-object.ts # Session ID Value Object
│   │   │   └── user-id.value-object.ts # User ID Value Object
│   │   │
│   │   ├── account/                  # Account Value Objects
│   │   │   ├── money.value-object.ts # Money Value Object
│   │   │   ├── currency.value-object.ts # Currency Value Object
│   │   │   ├── account-type.value-object.ts # Account Type Value Object
│   │   │   ├── account-name.value-object.ts # Account Name Value Object
│   │   │   ├── account-number.value-object.ts # Account Number Value Object
│   │   │   └── account-status.value-object.ts # Account Status Value Object
│   │   │
│   │   ├── authorization/            # Authorization Value Objects
│   │   │   ├── permission.value-object.ts # Permission Value Object
│   │   │   ├── permission-group.value-object.ts # Permission Group Value Object
│   │   │   ├── permission-set.value-object.ts # Permission Set Value Object
│   │   │   ├── role.value-object.ts # Role Value Object
│   │   │   └── role-set.value-object.ts # Role Set Value Object
│   │   │
│   │   ├── device/                   # Device Value Objects
│   │   │   ├── device-info.value-object.ts # Device Info Value Object
│   │   │   ├── geo-location.value-object.ts # Geo Location Value Object
│   │   │   ├── login-context.value-object.ts # Login Context Value Object
│   │   │   ├── login-source.value-object.ts # Login Source Value Object
│   │   │   └── user-agent.value-object.ts # User Agent Value Object
│   │   │
│   │   ├── status/                   # Status Value Objects
│   │   │   ├── is-anonymous.value-object.ts # Is Anonymous Value Object
│   │   │   ├── is-email-verified.value-object.ts # Is Email Verified Value Object
│   │   │   ├── user-status.value-object.ts # User Status Value Object
│   │   │   └── verification-status.value-object.ts # Verification Status Value Object
│   │   │
│   │   └── token/                    # Token Value Objects
│   │       ├── jwt-token.value-object.ts # JWT Token Value Object
│   │       ├── refresh-token.value-object.ts # Refresh Token Value Object
│   │       ├── token-expires-at.value-object.ts # Token Expires At Value Object
│   │       └── token-type.value-object.ts # Token Type Value Object
│   │
│   ├── services/                     # Domain Services
│   │   ├── user-domain.service.ts    # User Domain Service
│   │   ├── account-domain.service.ts # Account Domain Service
│   │   ├── transaction-domain.service.ts # Transaction Domain Service
│   │   ├── auth-domain.service.ts    # Authentication Domain Service
│   │   ├── authorization-domain.service.ts # Authorization Domain Service
│   │   └── tab-domain.service.ts     # Tab Domain Service
│   │
│   ├── repositories/                 # Repository Interfaces
│   │   ├── repository-tokens.ts      # Repository Injection Tokens
│   │   ├── user.repository.ts        # User Repository Interface
│   │   ├── account.repository.ts     # Account Repository Interface
│   │   ├── transaction.repository.ts # Transaction Repository Interface
│   │   ├── auth.repository.ts        # Authentication Repository Interface
│   │   ├── role.repository.ts        # Role Repository Interface
│   │   └── permission.repository.ts  # Permission Repository Interface
│   │
│   ├── events/                       # Domain Events
│   │   ├── index.ts                  # Events Exports
│   │   ├── domain-event.ts           # Base Domain Event
│   │   ├── user-events.ts            # User Domain Events
│   │   ├── account-events.ts         # Account Domain Events
│   │   ├── transaction-events.ts     # Transaction Domain Events
│   │   ├── auth-events.ts            # Authentication Domain Events
│   │   ├── role-events.ts            # Role Domain Events
│   │   └── permission-events.ts      # Permission Domain Events
│   │
│   ├── exceptions/                   # Domain Exceptions
│   │   └── (domain exception classes)
│   │
│   ├── specifications/               # Domain Specifications
│   │   └── (domain specification classes)
│   │
│   ├── factories/                    # Domain Factories
│   │   └── (domain factory classes)
│   │
│   └── aggregates/                   # Domain Aggregates
│       └── (domain aggregate classes)
│
├── application/                      # 🚀 Application Layer (Orchestration)
│   ├── index.ts                      # Application Layer Exports
│   │
│   ├── services/                     # Application Services
│   │   ├── user-application.service.ts      # User Application Service
│   │   ├── account-application.service.ts   # Account Application Service
│   │   ├── transaction-application.service.ts # Transaction Application Service
│   │   ├── auth-application.service.ts      # Authentication Application Service
│   │   ├── unified-auth.service.ts          # Unified Authentication Service
│   │   ├── unified-authentication.service.ts # Unified Authentication Service (Alt)
│   │   ├── simplified-auth.service.ts       # Simplified Authentication Service
│   │   ├── tab-application.service.ts       # Tab Application Service
│   │   └── error-handler.service.ts         # Error Handler Service
│   │
│   └── dto/                         # Data Transfer Objects
│       ├── user.dto.ts               # User DTOs
│       ├── account.dto.ts            # Account DTOs
│       └── transaction.dto.ts        # Transaction DTOs
│
├── infrastructure/                   # 🔧 Infrastructure Layer (Data & External Services)
│   ├── index.ts                      # Infrastructure Layer Exports
│   │
│   ├── repositories/                 # Repository Implementations
│   │   ├── firebase-user.repository.ts      # Firebase User Repository
│   │   ├── firebase-account.repository.ts   # Firebase Account Repository
│   │   ├── firebase-transaction.repository.ts # Firebase Transaction Repository
│   │   ├── firebase-auth.repository.ts      # Firebase Auth Repository
│   │   ├── mock-user.repository.ts           # Mock User Repository
│   │   ├── mock-account.repository.ts       # Mock Account Repository
│   │   └── mock-transaction.repository.ts   # Mock Transaction Repository
│   │
│   ├── services/                     # Infrastructure Services
│   │   ├── firebase-auth.service.ts  # Firebase Authentication Service
│   │   ├── i18n.service.ts           # Internationalization Service
│   │   ├── startup.service.ts        # Application Startup Service
│   │   └── tab-reuse-strategy.service.ts # Tab Reuse Strategy Service
│   │
│   ├── adapters/                     # External Service Adapters
│   │   ├── delon-auth.adapter.ts     # Delon Auth Adapter
│   │   └── firebase-auth.adapter.ts  # Firebase Auth Adapter
│   │
│   ├── guards/                       # Route Guards
│   │   └── (empty - guards in interface layer)
│   │
│   ├── interceptors/                 # HTTP Interceptors
│   │   ├── ddd-auth.interceptor.ts   # DDD Authentication Interceptor
│   │   ├── refresh-token.ts          # Token Refresh Interceptor
│   │   └── helper.ts                 # Interceptor Helper Utilities
│   │
│   ├── event-handlers/               # Event Handlers
│   │   └── (domain event handlers)
│   │
│   ├── messaging/                    # Messaging Services
│   │   └── (messaging implementations)
│   │
│   └── di/                          # Dependency Injection
│       └── repository.providers.ts   # Repository Provider Configuration
│
├── interface/                        # 🎨 Interface Layer (UI & API)
│   ├── index.ts                      # Interface Layer Exports
│   │
│   ├── components/                   # UI Components
│   │   ├── dashboard.component.ts    # Dashboard Component
│   │   ├── dashboard.component.html  # Dashboard Template
│   │   ├── dashboard.component.less  # Dashboard Styles
│   │   ├── welcome.component.ts      # Welcome Component
│   │   ├── welcome.component.html    # Welcome Template
│   │   ├── ddd-layout.component.ts   # DDD Layout Component
│   │   ├── ddd-test.component.ts     # DDD Test Component
│   │   ├── account-list.component.ts # Account List Component
│   │   ├── account-center.component.ts # Account Center Component
│   │   ├── account-settings.component.ts # Account Settings Component
│   │   ├── user-list.component.ts    # User List Component
│   │   └── transaction-list.component.ts # Transaction List Component
│   │
│   │   ├── auth/                     # Authentication Components
│   │   │   ├── login.component.ts    # Login Component
│   │   │   ├── login.component.html  # Login Template
│   │   │   ├── login.component.less  # Login Styles
│   │   │   ├── register.component.ts # Register Component
│   │   │   ├── register.component.html # Register Template
│   │   │   ├── register.component.less # Register Styles
│   │   │   ├── callback.component.ts # OAuth Callback Component
│   │   │   ├── anonymous-login.component.ts # Anonymous Login
│   │   │   ├── email-login.component.ts # Email Login
│   │   │   ├── email-login-form.component.ts # Email Login Form
│   │   │   ├── email-register-form.component.ts # Email Register Form
│   │   │   ├── email-reset-form.component.ts # Email Reset Form
│   │   │   ├── google-auth.component.ts # Google Auth Component
│   │   │   ├── lock.component.ts     # Lock Screen Component
│   │   │   ├── lock.component.html   # Lock Template
│   │   │   ├── lock.component.less   # Lock Styles
│   │   │   ├── profile.component.ts  # Profile Component
│   │   │   ├── register-result.component.ts # Register Result
│   │   │   ├── register-result.component.html # Register Result Template
│   │   │   └── simplified-anonymous-login.component.ts # Simplified Anonymous Login
│   │   │
│   │   ├── user/                     # User Management Components
│   │   │   ├── user-list.component.ts # User List Component
│   │   │   ├── user-detail.component.ts # User Detail Component
│   │   │   └── user-form.component.ts # User Form Component
│   │   │
│   │   ├── account/                  # Account Management Components
│   │   │   ├── account-list.component.ts # Account List Component
│   │   │   ├── account-detail.component.ts # Account Detail Component
│   │   │   └── account-form.component.ts # Account Form Component
│   │   │
│   │   ├── transaction/              # Transaction Management Components
│   │   │   ├── transaction-list.component.ts # Transaction List Component
│   │   │   ├── transaction-detail.component.ts # Transaction Detail Component
│   │   │   └── transaction-form.component.ts # Transaction Form Component
│   │   │
│   │   ├── layout/                   # Layout Components
│   │   │   ├── basic.component.ts    # Basic Layout Component
│   │   │   ├── passport/             # Passport Layout Components
│   │   │   │   ├── passport.component.ts # Passport Component
│   │   │   │   └── passport.component.less # Passport Styles
│   │   │   └── widgets/              # Layout Widget Components
│   │   │       ├── clear-storage.component.ts # Clear Storage Widget
│   │   │       ├── fullscreen.component.ts # Fullscreen Widget
│   │   │       ├── i18n.component.ts # i18n Widget
│   │   │       ├── search.component.ts # Search Widget
│   │   │       └── user.component.ts # User Widget
│   │   │
│   │   ├── navigation/               # Navigation Components
│   │   │   └── nav.component.ts      # Navigation Component
│   │   │
│   │   ├── exception/                # Exception/Error Components
│   │   │   ├── exception.component.ts # Exception Component
│   │   │   └── trigger.component.ts  # Trigger Component
│   │   │
│   │   ├── tab/                      # Tab Components
│   │   │   ├── tab.component.ts      # Tab Component
│   │   │   └── tab.component.less    # Tab Styles
│   │   │
│   │   └── widgets/                  # Reusable Widget Components
│   │       ├── ddd-header-i18n.component.ts # Header i18n Widget
│   │       ├── ddd-header-user.component.ts # Header User Widget
│   │       ├── ddd-header-fullscreen.component.ts # Header Fullscreen Widget
│   │       ├── ddd-header-clear-storage.component.ts # Header Clear Storage Widget
│   │       └── ddd-header-search.component.ts # Header Search Widget
│   │
│   ├── routes/                       # Routing Configuration
│   │   ├── index.ts                  # Routes Exports
│   │   └── ddd-routes.ts             # DDD Routes Configuration
│   │
│   ├── guards/                       # Route Guards
│   │   ├── auth.guard.ts             # Authentication Guard
│   │   ├── role.guard.ts             # Role-based Access Guard
│   │   └── start-page.guard.ts       # Start Page Guard
│   │
│   ├── interceptors/                 # HTTP Interceptors
│   │   ├── auth.interceptor.ts       # Authentication Interceptor
│   │   └── error.interceptor.ts      # Error Handling Interceptor
│   │
│   ├── directives/                   # Custom Directives
│   │   ├── loading.directive.ts      # Loading Directive
│   │   └── permission.directive.ts   # Permission Directive
│   │
│   ├── pipes/                        # Custom Pipes
│   │   ├── currency.pipe.ts          # Currency Formatting Pipe
│   │   └── status.pipe.ts            # Status Display Pipe
│   │
│   └── mappers/                      # Data Mappers
│       └── (data mapping utilities)
│
└── shared/                           # 🔄 Shared Layer (Cross-cutting Concerns)
    ├── index.ts                      # Shared Layer Exports
    ├── shared.module.ts              # Shared Module Configuration
    ├── shared-delon.module.ts        # Delon Shared Module
    ├── shared-imports.ts             # Shared Imports
    ├── shared-zorro.module.ts        # Zorro Shared Module
    │
    ├── cell-widget/                  # Cell Widget Components
    │   └── index.ts                  # Cell Widget Exports
    │
    ├── st-widget/                    # ST Widget Components
    │   ├── index.ts                  # ST Widget Exports
    │   └── README.md                 # ST Widget Documentation
    │
    ├── json-schema/                  # JSON Schema Components
    │   ├── index.ts                  # JSON Schema Exports
    │   ├── README.md                 # JSON Schema Documentation
    │   └── test/                     # JSON Schema Tests
    │       └── test.widget.ts        # Test Widget
    │
    ├── constants/                    # Shared Constants
    │   └── (constant definitions)
    │
    └── utils/                        # Shared Utilities
        └── (utility functions)
```

## 🎯 Layer Responsibilities

### Domain Layer (`/domain`)
- **Entities**: Core business objects with identity and lifecycle
- **Value Objects**: Immutable objects representing concepts (organized by domain)
- **Domain Services**: Business logic that doesn't belong to entities
- **Repository Interfaces**: Data access contracts
- **Domain Events**: Business events and their handlers
- **Aggregates**: Aggregate roots and aggregate boundaries
- **Factories**: Object creation logic
- **Specifications**: Business rule specifications
- **Exceptions**: Domain-specific exceptions

### Application Layer (`/application`)
- **Application Services**: Orchestrate domain operations
- **DTOs**: Data transfer objects for external communication
- **Use Cases**: Application-specific business logic
- **Error Handling**: Centralized error management

### Infrastructure Layer (`/infrastructure`)
- **Repository Implementations**: Concrete data access implementations
- **External Services**: Third-party service integrations
- **Adapters**: External service adapters
- **Dependency Injection**: Configuration and providers
- **Cross-cutting Concerns**: Logging, caching, etc.
- **Event Handlers**: Domain event handlers
- **Messaging**: Message bus implementations

### Interface Layer (`/interface`)
- **Components**: UI components and templates
- **Routes**: Navigation and routing configuration
- **Guards**: Route protection and access control
- **Interceptors**: HTTP request/response processing
- **Directives**: Custom DOM manipulation
- **Pipes**: Data transformation utilities
- **Mappers**: Data mapping utilities

### Shared Layer (`/shared`)
- **Common Components**: Reusable UI components
- **Utilities**: Shared helper functions
- **Configuration**: Common settings and constants
- **Widgets**: Specialized UI widgets
- **Constants**: Shared constant definitions

## 🔧 Technology Integration

### Firebase Integration
- All Firebase operations use `@angular/fire`
- Repository implementations handle Firestore operations
- Authentication integrates with `@delon/auth`
- Adapters provide clean separation between Firebase and domain

### ng-zorro-antd Integration
- UI components use ng-zorro-antd components
- Consistent design patterns and user experience
- Responsive and accessible components

### @delon/* Package Integration
- `@delon/auth`: Authentication and authorization
- `@delon/form`: Form handling and validation
- `@delon/cache`: Caching strategies
- `@delon/acl`: Access control lists
- `@delon/chart`: Charting capabilities
- `@delon/abc`: Business components
- `@delon/util`: Utility functions

## 📊 Implementation Status

### ✅ Completed Features
- [x] Complete DDD architecture implementation
- [x] All domain entities (User, Account, Transaction, Auth, Role, Permission, Tab)
- [x] Comprehensive value objects organized by domain
- [x] Domain services for all entities
- [x] Repository interfaces and implementations
- [x] Application services with comprehensive DTOs
- [x] Firebase and Mock repository implementations
- [x] UI components for all entities
- [x] Authentication system with multiple providers
- [x] Route guards and interceptors
- [x] Comprehensive testing setup
- [x] Dependency injection configuration
- [x] External service adapters
- [x] Error handling services
- [x] Tab management system

### 🔄 Current Status
- All core DDD layers are implemented
- Firebase integration is complete with adapters
- UI components are functional
- Testing framework is in place
- Documentation is comprehensive
- Value objects are well-organized by domain
- Authentication system supports multiple providers

## 🚀 Key Benefits

### Cursor AI-Friendly
- Standard TypeScript patterns
- Clear separation of concerns
- Simple DTOs and interfaces
- Familiar Angular patterns
- Well-organized value objects

### Maintainable Code
- Clear business logic organization
- Testable components
- Scalable architecture
- Consistent patterns
- Domain-driven organization

### Technology Integration
- Leverages existing ng-zorro-antd components
- Integrates with @delon/* ecosystem
- Uses @angular/fire for Firebase operations
- Maintains existing authentication patterns
- Clean adapter pattern for external services

This DDD implementation provides a solid foundation for building scalable, maintainable Angular applications with clear separation of concerns and excellent developer experience. 