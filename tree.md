src/app/
├── shared/                          # Cross-cutting concerns
│   ├── domain/                      # Shared domain primitives
│   │   ├── base-entity.ts
│   │   ├── base-aggregate-root.ts
│   │   ├── value-object.ts
│   │   ├── domain-event.ts
│   │   ├── specification.ts
│   │   └── exceptions/
│   │       ├── domain.exception.ts
│   │       └── application.exception.ts
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
│   └── ui/                         # Shared UI components
│       ├── layout/
│       │   ├── header/
│       │   │   ├── header.component.ts
│       │   │   ├── header.component.html
│       │   │   └── header.component.less
│       │   ├── sidebar/
│       │   │   ├── sidebar.component.ts
│       │   │   ├── sidebar.component.html
│       │   │   └── sidebar.component.less
│       │   ├── footer/
│       │   │   ├── footer.component.ts
│       │   │   ├── footer.component.html
│       │   │   └── footer.component.less
│       │   └── main-layout/
│       │       ├── main-layout.component.ts
│       │       ├── main-layout.component.html
│       │       └── main-layout.component.less
│       ├── common/
│       │   ├── loading/
│       │   │   ├── loading.component.ts
│       │   │   ├── loading.component.html
│       │   │   └── loading.component.less
│       │   ├── error-display/
│       │   │   ├── error-display.component.ts
│       │   │   ├── error-display.component.html
│       │   │   └── error-display.component.less
│       │   └── confirmation-dialog/
│       │       ├── confirmation-dialog.component.ts
│       │       ├── confirmation-dialog.component.html
│       │       └── confirmation-dialog.component.less
│       └── pipes/
│           ├── safe-html.pipe.ts
│           ├── truncate.pipe.ts
│           └── date-format.pipe.ts
├── domains/                        # Business domains
│   ├── user/                       # User domain
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── user.entity.ts
│   │   │   │   └── user.entity.spec.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── user-id.vo.ts
│   │   │   │   ├── user-id.vo.spec.ts
│   │   │   │   ├── email.vo.ts
│   │   │   │   ├── email.vo.spec.ts
│   │   │   │   ├── user-profile.vo.ts
│   │   │   │   └── user-profile.vo.spec.ts
│   │   │   ├── repositories/
│   │   │   │   └── user.repository.ts
│   │   │   ├── services/
│   │   │   │   ├── user-domain.service.ts
│   │   │   │   └── user-domain.service.spec.ts
│   │   │   ├── events/
│   │   │   │   ├── user-created.event.ts
│   │   │   │   ├── user-updated.event.ts
│   │   │   │   ├── user-email-verified.event.ts
│   │   │   │   └── user-profile-updated.event.ts
│   │   │   ├── specifications/
│   │   │   │   ├── user-email-unique.spec.ts
│   │   │   │   └── user-can-be-deleted.spec.ts
│   │   │   └── exceptions/
│   │   │       ├── user-not-found.exception.ts
│   │   │       ├── invalid-email.exception.ts
│   │   │       └── user-email-already-exists.exception.ts
│   │   ├── application/
│   │   │   ├── services/
│   │   │   │   ├── user-application.service.ts
│   │   │   │   ├── user-application.service.spec.ts
│   │   │   │   ├── user-query.service.ts
│   │   │   │   └── user-query.service.spec.ts
│   │   │   ├── dto/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── create-user.command.ts
│   │   │   │   │   ├── update-user.command.ts
│   │   │   │   │   ├── verify-user-email.command.ts
│   │   │   │   │   └── delete-user.command.ts
│   │   │   │   ├── queries/
│   │   │   │   │   ├── get-user-by-id.query.ts
│   │   │   │   │   ├── get-users-list.query.ts
│   │   │   │   │   └── search-users.query.ts
│   │   │   │   └── responses/
│   │   │   │       ├── user.response.ts
│   │   │   │       ├── user-list.response.ts
│   │   │   │       └── create-user.response.ts
│   │   │   ├── handlers/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── create-user.handler.ts
│   │   │   │   │   ├── update-user.handler.ts
│   │   │   │   │   └── verify-user-email.handler.ts
│   │   │   │   ├── queries/
│   │   │   │   │   ├── get-user-by-id.handler.ts
│   │   │   │   │   └── get-users-list.handler.ts
│   │   │   │   └── events/
│   │   │   │       ├── user-created.handler.ts
│   │   │   │       └── user-email-verified.handler.ts
│   │   │   └── use-cases/
│   │   │       ├── create-user.use-case.ts
│   │   │       ├── update-user-profile.use-case.ts
│   │   │       ├── verify-user-email.use-case.ts
│   │   │       └── delete-user.use-case.ts
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   │   ├── user-firebase.repository.ts
│   │   │   │   ├── user-firebase.repository.spec.ts
│   │   │   │   ├── user-cache.repository.ts
│   │   │   │   └── user-read-model.repository.ts
│   │   │   ├── mappers/
│   │   │   │   ├── user.mapper.ts
│   │   │   │   └── user.mapper.spec.ts
│   │   │   ├── adapters/
│   │   │   │   ├── email-service.adapter.ts
│   │   │   │   └── notification-service.adapter.ts
│   │   │   └── config/
│   │   │       └── user-module.config.ts
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── user-list/
│   │       │   │   ├── user-list.component.ts
│   │       │   │   ├── user-list.component.html
│   │       │   │   ├── user-list.component.less
│   │       │   │   └── user-list.component.spec.ts
│   │       │   ├── user-form/
│   │       │   │   ├── user-form.component.ts
│   │       │   │   ├── user-form.component.html
│   │       │   │   ├── user-form.component.less
│   │       │   │   └── user-form.component.spec.ts
│   │       │   ├── user-detail/
│   │       │   │   ├── user-detail.component.ts
│   │       │   │   ├── user-detail.component.html
│   │       │   │   ├── user-detail.component.less
│   │       │   │   └── user-detail.component.spec.ts
│   │       │   └── user-search/
│   │       │       ├── user-search.component.ts
│   │       │       ├── user-search.component.html
│   │       │       ├── user-search.component.less
│   │       │       └── user-search.component.spec.ts
│   │       ├── pages/
│   │       │   ├── user-management/
│   │       │   │   ├── user-management.component.ts
│   │       │   │   ├── user-management.component.html
│   │       │   │   ├── user-management.component.less
│   │       │   │   └── user-management.component.spec.ts
│   │       │   ├── user-profile/
│   │       │   │   ├── user-profile.component.ts
│   │       │   │   ├── user-profile.component.html
│   │       │   │   ├── user-profile.component.less
│   │       │   │   └── user-profile.component.spec.ts
│   │       │   └── user-settings/
│   │       │       ├── user-settings.component.ts
│   │       │       ├── user-settings.component.html
│   │       │       ├── user-settings.component.less
│   │       │       └── user-settings.component.spec.ts
│   │       ├── guards/
│   │       │   ├── user-exists.guard.ts
│   │       │   └── user-owner.guard.ts
│   │       ├── resolvers/
│   │       │   ├── user.resolver.ts
│   │       │   └── user-list.resolver.ts
│   │       └── user.routes.ts
│   ├── auth/                       # Authentication domain
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── auth-session.entity.ts
│   │   │   │   └── auth-token.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── session-id.vo.ts
│   │   │   │   ├── auth-provider.vo.ts
│   │   │   │   └── token.vo.ts
│   │   │   ├── repositories/
│   │   │   │   └── auth-session.repository.ts
│   │   │   ├── services/
│   │   │   │   ├── auth-domain.service.ts
│   │   │   │   └── password-policy.service.ts
│   │   │   ├── events/
│   │   │   │   ├── user-logged-in.event.ts
│   │   │   │   ├── user-logged-out.event.ts
│   │   │   │   └── session-expired.event.ts
│   │   │   └── exceptions/
│   │   │       ├── invalid-credentials.exception.ts
│   │   │       ├── session-expired.exception.ts
│   │   │       └── unauthorized-access.exception.ts
│   │   ├── application/
│   │   │   ├── services/
│   │   │   │   ├── auth-application.service.ts
│   │   │   │   └── session-management.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── login.command.ts
│   │   │   │   │   ├── logout.command.ts
│   │   │   │   │   ├── register.command.ts
│   │   │   │   │   └── refresh-token.command.ts
│   │   │   │   └── responses/
│   │   │   │       ├── auth.response.ts
│   │   │   │       └── session.response.ts
│   │   │   ├── handlers/
│   │   │   │   ├── login.handler.ts
│   │   │   │   ├── logout.handler.ts
│   │   │   │   └── register.handler.ts
│   │   │   └── use-cases/
│   │   │       ├── login-with-email.use-case.ts
│   │   │       ├── login-with-google.use-case.ts
│   │   │       ├── login-anonymously.use-case.ts
│   │   │       ├── logout.use-case.ts
│   │   │       └── register.use-case.ts
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   │   └── auth-firebase.repository.ts
│   │   │   ├── adapters/
│   │   │   │   ├── firebase-auth.adapter.ts
│   │   │   │   ├── google-auth.adapter.ts
│   │   │   │   └── jwt-token.adapter.ts
│   │   │   └── config/
│   │   │       └── auth-module.config.ts
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── login-form/
│   │       │   │   ├── login-form.component.ts
│   │       │   │   ├── login-form.component.html
│   │       │   │   ├── login-form.component.less
│   │       │   │   └── login-form.component.spec.ts
│   │       │   ├── register-form/
│   │       │   │   ├── register-form.component.ts
│   │       │   │   ├── register-form.component.html
│   │       │   │   ├── register-form.component.less
│   │       │   │   └── register-form.component.spec.ts
│   │       │   └── auth-status/
│   │       │       ├── auth-status.component.ts
│   │       │       ├── auth-status.component.html
│   │       │       ├── auth-status.component.less
│   │       │       └── auth-status.component.spec.ts
│   │       ├── pages/
│   │       │   ├── login/
│   │       │   │   ├── login.component.ts
│   │       │   │   ├── login.component.html
│   │       │   │   ├── login.component.less
│   │       │   │   └── login.component.spec.ts
│   │       │   ├── register/
│   │       │   │   ├── register.component.ts
│   │       │   │   ├── register.component.html
│   │       │   │   ├── register.component.less
│   │       │   │   └── register.component.spec.ts
│   │       │   ├── callback/
│   │       │   │   ├── callback.component.ts
│   │       │   │   ├── callback.component.html
│   │       │   │   ├── callback.component.less
│   │       │   │   └── callback.component.spec.ts
│   │       │   └── forgot-password/
│   │       │       ├── forgot-password.component.ts
│   │       │       ├── forgot-password.component.html
│   │       │       ├── forgot-password.component.less
│   │       │       └── forgot-password.component.spec.ts
│   │       └── auth.routes.ts
│   ├── contract/                   # Contract domain (future)
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   ├── events/
│   │   │   └── exceptions/
│   │   ├── application/
│   │   │   ├── services/
│   │   │   ├── dto/
│   │   │   ├── handlers/
│   │   │   └── use-cases/
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   ├── mappers/
│   │   │   └── adapters/
│   │   └── presentation/
│   │       ├── components/
│   │       ├── pages/
│   │       └── contract.routes.ts
│   └── dashboard/                  # Dashboard domain
│       ├── domain/
│       │   ├── entities/
│       │   │   ├── dashboard-widget.entity.ts
│       │   │   └── dashboard-layout.entity.ts
│       │   ├── value-objects/
│       │   │   ├── widget-config.vo.ts
│       │   │   └── layout-config.vo.ts
│       │   ├── repositories/
│       │   │   └── dashboard.repository.ts
│       │   └── services/
│       │       └── dashboard-domain.service.ts
│       ├── application/
│       │   ├── services/
│       │   │   ├── dashboard-application.service.ts
│       │   │   └── widget-management.service.ts
│       │   ├── dto/
│       │   │   ├── commands/
│       │   │   │   ├── create-widget.command.ts
│       │   │   │   └── update-layout.command.ts
│       │   │   └── responses/
│       │   │       ├── dashboard.response.ts
│       │   │       └── widget.response.ts
│       │   └── use-cases/
│       │       ├── load-dashboard.use-case.ts
│       │       └── customize-dashboard.use-case.ts
│       ├── infrastructure/
│       │   ├── repositories/
│       │   │   └── dashboard-firebase.repository.ts
│       │   └── adapters/
│       │       └── analytics.adapter.ts
│       └── presentation/
│           ├── components/
│           │   ├── dashboard-grid/
│           │   │   ├── dashboard-grid.component.ts
│           │   │   ├── dashboard-grid.component.html
│           │   │   ├── dashboard-grid.component.less
│           │   │   └── dashboard-grid.component.spec.ts
│           │   ├── widget-container/
│           │   │   ├── widget-container.component.ts
│           │   │   ├── widget-container.component.html
│           │   │   ├── widget-container.component.less
│           │   │   └── widget-container.component.spec.ts
│           │   └── widget-library/
│           │       ├── chart-widget/
│           │       ├── table-widget/
│           │       ├── metric-widget/
│           │       └── calendar-widget/
│           ├── pages/
│           │   └── dashboard/
│           │       ├── dashboard.component.ts
│           │       ├── dashboard.component.html
│           │       ├── dashboard.component.less
│           │       └── dashboard.component.spec.ts
│           └── dashboard.routes.ts
├── app.component.ts                # Root component
├── app.config.ts                   # Application configuration
├── app.routes.ts                   # Main routing configuration
└── main.ts                         # Application bootstrap

