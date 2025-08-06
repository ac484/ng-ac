# Angular DDD Architecture Restructure

## Overview

The `ng-ac/src/app/` directory has been restructured according to Domain-Driven Design (DDD) principles as outlined in the design document. The new structure follows a clean, layered architecture with clear separation of concerns.

## New Structure

```
src/app/
├── shared/                          # Cross-cutting concerns
│   ├── domain/                      # Shared domain primitives
│   │   ├── base-entity.ts
│   │   ├── base-aggregate-root.ts
│   │   ├── value-object.ts
│   │   ├── domain-event.ts
│   │   ├── specification.ts
│   │   └── exceptions.ts
│   ├── application/                 # Shared application services
│   │   ├── unit-of-work.ts
│   │   ├── event-bus.ts
│   │   ├── query-bus.ts
│   │   ├── command-bus.ts
│   │   └── interfaces/
│   │       ├── repository.interface.ts
│   │       ├── event-handler.interface.ts
│   │       └── use-case.interface.ts
│   ├── infrastructure/              # Shared infrastructure
│   │   ├── base-repository.ts
│   │   ├── firebase-config.ts
│   │   ├── interceptors/
│   │   │   ├── error.interceptor.ts
│   │   │   ├── loading.interceptor.ts
│   │   │   └── auth.interceptor.ts
│   │   └── guards/
│   │       ├── auth.guard.ts
│   │       └── role.guard.ts
│   └── presentation/               # Shared UI components
│       ├── layout/
│       │   └── main-layout/
│       │       └── main-layout.component.ts
│       ├── common/
│       │   ├── loading/
│       │   ├── error-display/
│       │   └── confirmation-dialog/
│       └── pipes/
│           ├── safe-html.pipe.ts
│           ├── truncate.pipe.ts
│           └── date-format.pipe.ts
├── domain/                         # Business domains
│   ├── user/                       # User domain
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── user-id.vo.ts
│   │   │   │   ├── email.vo.ts
│   │   │   │   └── user-profile.vo.ts
│   │   │   ├── repositories/
│   │   │   │   └── user.repository.ts
│   │   │   ├── services/
│   │   │   │   └── user-domain.service.ts
│   │   │   ├── events/
│   │   │   │   ├── user-created.event.ts
│   │   │   │   ├── user-updated.event.ts
│   │   │   │   └── user-email-verified.event.ts
│   │   │   ├── specifications/
│   │   │   │   └── user-email-unique.spec.ts
│   │   │   └── exceptions/
│   │   │       ├── user-not-found.exception.ts
│   │   │       └── invalid-email.exception.ts
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── user-management/
│   │       │   ├── user-create/
│   │       │   ├── user-detail/
│   │       │   └── user-edit/
│   │       └── user.routes.ts
│   ├── auth/                       # Authentication domain
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── login/
│   │       │   └── register/
│   │       └── auth.routes.ts
│   └── dashboard/                  # Dashboard domain
│       └── presentation/
│           ├── pages/
│           │   └── dashboard/
│           └── dashboard.routes.ts
├── app.component.ts                # Root component
├── app.config.ts                   # Application configuration
└── app.routes.ts                   # Main routing configuration
```

## Key Features Implemented

### 1. Shared Layer
- **Domain Primitives**: Base classes for entities, value objects, and domain events
- **Application Services**: Unit of work, event bus, command/query buses
- **Infrastructure**: Firebase configuration, HTTP interceptors, guards
- **Presentation**: Reusable UI components using ng-zorro-antd

### 2. Domain Layer (User Domain Example)
- **Entities**: User entity with business logic
- **Value Objects**: UserId, Email, UserProfile with validation
- **Domain Events**: UserCreated, UserUpdated, UserEmailVerified
- **Specifications**: Business rules (email uniqueness)
- **Exceptions**: Domain-specific error handling

### 3. Presentation Layer
- **Components**: Standalone components using ng-zorro-antd
- **Routing**: Lazy-loaded domain routes
- **Guards**: Authentication and authorization

## Architecture Principles

1. **Minimalist Design**: Uses ng-zorro-antd components over custom implementations
2. **Clear Layer Separation**: Strict dependency direction (domain ← application ← infrastructure ← presentation)
3. **High Cohesion, Low Coupling**: Module independence with clear interfaces
4. **Performance First**: OnPush change detection, lazy loading
5. **Consistency**: Standardized naming and organization

## Next Steps

1. **Complete Domain Implementation**: Implement remaining domain entities and services
2. **Application Layer**: Create use cases and DTOs for each domain
3. **Infrastructure Layer**: Implement Firebase repositories and adapters
4. **Presentation Layer**: Complete UI components with full functionality
5. **Testing**: Add unit and integration tests
6. **Documentation**: Complete API documentation and usage guides

## Migration Notes

- The old structure in `src/app/old/` has been preserved for reference
- All new components use Angular 19 standalone components
- Firebase integration is configured for authentication and Firestore
- ng-zorro-antd is used for all UI components
- TypeScript strict mode is enabled for type safety

## Benefits

- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new domains
- **Testability**: Isolated layers for unit testing
- **Performance**: Optimized change detection and lazy loading
- **Developer Experience**: Consistent patterns and tooling 