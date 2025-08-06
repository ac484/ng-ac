# Design Document

## Overview

This design document outlines the optimization of the current DDD (Domain-Driven Design) architecture to create a cleaner, more efficient, and better organized codebase. The design focuses on establishing clear layer boundaries, implementing minimalist principles, and leveraging Angular 20 and ng-zorro-antd best practices to create a high-performance, maintainable system.

## Architecture

### Core Principles

1. **Minimalist Design**: Prioritize ng-zorro-antd components over custom implementations
2. **Clear Layer Separation**: Enforce strict dependency direction (domain ← application ← infrastructure ← presentation)
3. **High Cohesion, Low Coupling**: Maximize module independence while maintaining clear interfaces
4. **Performance First**: Implement OnPush change detection, lazy loading, and optimized patterns
5. **Consistency**: Standardized naming conventions and file organization across all domains

### Layer Architecture

Based on your current project structure, here's the complete optimized layer architecture:

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
│       │   ├── header/
│       │   ├── sidebar/
│       │   ├── footer/
│       │   └── main-layout/
│       ├── common/
│       │   ├── loading/
│       │   ├── error-display/
│       │   └── confirmation-dialog/
│       └── pipes/
│           ├── safe-html.pipe.ts
│           ├── truncate.pipe.ts
│           └── date-format.pipe.ts
├── domain/                         # Business domains (feature modules)
│   ├── user/                       # User domain
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── user.entity.ts
│   │   │   │   └── user.entity.spec.ts
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
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── create-user.use-case.ts
│   │   │   │   ├── update-user.use-case.ts
│   │   │   │   └── verify-user-email.use-case.ts
│   │   │   ├── dto/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── create-user.command.ts
│   │   │   │   │   └── update-user.command.ts
│   │   │   │   ├── queries/
│   │   │   │   │   ├── get-user-by-id.query.ts
│   │   │   │   │   └── get-users-list.query.ts
│   │   │   │   └── responses/
│   │   │   │       ├── user.response.ts
│   │   │   │       └── user-list.response.ts
│   │   │   └── services/
│   │   │       ├── user-command.service.ts
│   │   │       └── user-query.service.ts
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   │   ├── user-firebase.repository.ts
│   │   │   │   └── user-cache.repository.ts
│   │   │   ├── mappers/
│   │   │   │   └── user.mapper.ts
│   │   │   └── adapters/
│   │   │       └── email-service.adapter.ts
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── user-list/
│   │       │   ├── user-form/
│   │       │   ├── user-detail/
│   │       │   └── user-search/
│   │       ├── pages/
│   │       │   ├── user-management/
│   │       │   ├── user-profile/
│   │       │   └── user-settings/
│   │       ├── guards/
│   │       │   └── user-exists.guard.ts
│   │       ├── resolvers/
│   │       │   └── user.resolver.ts
│   │       └── user.routes.ts
│   ├── auth/                       # Authentication domain
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── auth-session.entity.ts
│   │   │   │   └── auth-token.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── session-id.vo.ts
│   │   │   │   └── auth-provider.vo.ts
│   │   │   ├── repositories/
│   │   │   │   └── auth-session.repository.ts
│   │   │   ├── services/
│   │   │   │   └── auth-domain.service.ts
│   │   │   ├── events/
│   │   │   │   ├── user-logged-in.event.ts
│   │   │   │   └── user-logged-out.event.ts
│   │   │   └── exceptions/
│   │   │       ├── invalid-credentials.exception.ts
│   │   │       └── session-expired.exception.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── login-with-email.use-case.ts
│   │   │   │   ├── login-with-google.use-case.ts
│   │   │   │   └── logout.use-case.ts
│   │   │   ├── dto/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── login.command.ts
│   │   │   │   │   └── logout.command.ts
│   │   │   │   └── responses/
│   │   │   │       └── auth.response.ts
│   │   │   └── services/
│   │   │       └── auth-application.service.ts
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   │   └── auth-firebase.repository.ts
│   │   │   └── adapters/
│   │   │       ├── firebase-auth.adapter.ts
│   │   │       └── google-auth.adapter.ts
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── login-form/
│   │       │   ├── register-form/
│   │       │   └── auth-status/
│   │       ├── pages/
│   │       │   ├── login/
│   │       │   ├── register/
│   │       │   └── forgot-password/
│   │       └── auth.routes.ts
│   ├── dashboard/                  # Dashboard domain
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── dashboard-widget.entity.ts
│   │   │   │   └── dashboard-layout.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── widget-config.vo.ts
│   │   │   │   └── layout-config.vo.ts
│   │   │   ├── repositories/
│   │   │   │   └── dashboard.repository.ts
│   │   │   └── services/
│   │   │       └── dashboard-domain.service.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── load-dashboard.use-case.ts
│   │   │   │   └── customize-dashboard.use-case.ts
│   │   │   ├── dto/
│   │   │   │   ├── commands/
│   │   │   │   │   └── update-layout.command.ts
│   │   │   │   └── responses/
│   │   │   │       └── dashboard.response.ts
│   │   │   └── services/
│   │   │       └── dashboard-application.service.ts
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   │   └── dashboard-firebase.repository.ts
│   │   │   └── adapters/
│   │   │       └── analytics.adapter.ts
│   │   └── presentation/
│   │       ├── components/
│   │       │   ├── dashboard-grid/
│   │       │   ├── widget-container/
│   │       │   └── widget-library/
│   │       │       ├── chart-widget/
│   │       │       ├── table-widget/
│   │       │       ├── metric-widget/
│   │       │       └── calendar-widget/
│   │       ├── pages/
│   │       │   └── dashboard/
│   │       └── dashboard.routes.ts
│   └── contract/                   # Contract domain (future)
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
├── app.component.ts                # Root component
├── app.config.ts                   # Application configuration
├── app.routes.ts                   # Main routing configuration
└── main.ts                         # Application bootstrap
```

## Components and Interfaces

### Shared Layer Components

#### Domain Primitives (`src/app/shared/domain/`)
- **BaseEntity**: Abstract base class for all entities with common properties
- **BaseAggregateRoot**: Extends BaseEntity with domain event capabilities
- **ValueObject**: Abstract base for immutable value objects
- **DomainEvent**: Base interface for all domain events
- **Specification**: Pattern for encapsulating business rules
- **Exceptions**: Hierarchical exception system for domain and application errors

#### Application Services (`src/app/shared/application/`)
- **UnitOfWork**: Transaction boundary management
- **EventBus**: Domain event publishing and handling
- **QueryBus**: Query handling infrastructure
- **CommandBus**: Command handling infrastructure
- **BaseUseCase**: Abstract base for all use cases

#### Infrastructure Utilities (`src/app/shared/infrastructure/`)
- **BaseRepository**: Generic Firebase repository implementation
- **FirebaseConfig**: Centralized Firebase configuration
- **HttpInterceptors**: Error handling, loading, authentication
- **Guards**: Authentication and authorization guards

#### Presentation Components (`src/app/shared/presentation/`)
- **Layout Components**: Header, sidebar, footer using ng-zorro-antd
- **Common Components**: Loading, error display, confirmation dialogs
- **Pipes**: Utility pipes for data transformation
- **Directives**: Reusable UI behavior directives

### Domain Module Structure

Each domain module follows a consistent four-layer structure:

#### Domain Layer (`domain/`)
```typescript
// Entities
export class User extends BaseAggregateRoot<UserId> {
  private constructor(
    id: UserId,
    private _email: Email,
    private _profile: UserProfile
  ) {
    super(id);
  }

  static create(email: Email, profile: UserProfile): User {
    const user = new User(UserId.generate(), email, profile);
    user.addDomainEvent(new UserCreatedEvent(user.id, email));
    return user;
  }

  changeEmail(newEmail: Email): void {
    if (!this._email.equals(newEmail)) {
      this._email = newEmail;
      this.addDomainEvent(new UserEmailChangedEvent(this.id, newEmail));
    }
  }
}

// Value Objects
export class Email extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  static create(value: string): Email {
    if (!this.isValid(value)) {
      throw new InvalidEmailException(value);
    }
    return new Email({ value });
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Repository Interfaces
export interface UserRepository extends Repository<User, UserId> {
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
}
```

#### Application Layer (`application/`)
```typescript
// Use Cases
@Injectable()
export class CreateUserUseCase extends BaseUseCase<CreateUserCommand, CreateUserResponse> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
    private readonly unitOfWork: UnitOfWork
  ) {
    super();
  }

  async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
    return await this.unitOfWork.execute(async () => {
      // Validate business rules
      const emailExists = await this.userRepository.existsByEmail(command.email);
      if (emailExists) {
        throw new UserEmailAlreadyExistsException(command.email);
      }

      // Create domain entity
      const user = User.create(command.email, command.profile);

      // Persist
      await this.userRepository.save(user);

      // Publish events
      await this.eventBus.publishAll(user.getDomainEvents());

      return CreateUserResponse.success(user.id);
    });
  }
}

// DTOs
export class CreateUserCommand {
  constructor(
    public readonly email: Email,
    public readonly profile: UserProfile
  ) {}
}

export class CreateUserResponse {
  constructor(
    public readonly success: boolean,
    public readonly userId?: UserId,
    public readonly error?: string
  ) {}

  static success(userId: UserId): CreateUserResponse {
    return new CreateUserResponse(true, userId);
  }

  static failure(error: string): CreateUserResponse {
    return new CreateUserResponse(false, undefined, error);
  }
}
```

#### Infrastructure Layer (`infrastructure/`)
```typescript
// Repository Implementation
@Injectable()
export class UserFirebaseRepository implements UserRepository {
  constructor(
    private readonly firestore: AngularFirestore,
    private readonly mapper: UserMapper
  ) {}

  async save(user: User): Promise<void> {
    const doc = this.mapper.toFirestore(user);
    await this.firestore.collection('users').doc(user.id.value).set(doc);
  }

  async findById(id: UserId): Promise<User | null> {
    const doc = await this.firestore.collection('users').doc(id.value).get().toPromise();
    return doc?.exists ? this.mapper.toDomain(doc.data()) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const query = await this.firestore
      .collection('users', ref => ref.where('email', '==', email.value))
      .get()
      .toPromise();
    
    return query?.docs.length > 0 
      ? this.mapper.toDomain(query.docs[0].data()) 
      : null;
  }
}

// Mappers
@Injectable()
export class UserMapper {
  toFirestore(user: User): any {
    return {
      id: user.id.value,
      email: user.email.value,
      profile: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName
      },
      createdAt: user.createdAt,
      updatedAt: new Date()
    };
  }

  toDomain(data: any): User {
    return User.reconstitute(
      UserId.create(data.id),
      Email.create(data.email),
      UserProfile.create(data.profile.firstName, data.profile.lastName),
      data.createdAt
    );
  }
}
```

#### Presentation Layer (`presentation/`)
```typescript
// Components using ng-zorro-antd
@Component({
  selector: 'app-user-list',
  template: `
    <nz-card [nzTitle]="'Users'" [nzExtra]="extraTemplate">
      <nz-table 
        #basicTable 
        [nzData]="users$ | async" 
        [nzLoading]="loading$ | async"
        [nzPageSize]="10"
        [nzShowPagination]="true">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of basicTable.data">
            <td>{{ user.email }}</td>
            <td>{{ user.profile.fullName }}</td>
            <td>{{ user.createdAt | date }}</td>
            <td>
              <nz-button-group>
                <button nz-button nzType="primary" nzSize="small" 
                        (click)="editUser(user.id)">
                  <nz-icon nzType="edit"></nz-icon>
                  Edit
                </button>
                <button nz-button nzType="default" nzSize="small" nzDanger
                        (click)="deleteUser(user.id)">
                  <nz-icon nzType="delete"></nz-icon>
                  Delete
                </button>
              </nz-button-group>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </nz-card>

    <ng-template #extraTemplate>
      <button nz-button nzType="primary" (click)="createUser()">
        <nz-icon nzType="plus"></nz-icon>
        Add User
      </button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule
  ]
})
export class UserListComponent implements OnInit {
  users$ = this.userQuery.users$;
  loading$ = this.userQuery.loading$;

  constructor(
    private readonly userQuery: UserQueryService,
    private readonly userCommands: UserCommandService,
    private readonly router: Router,
    private readonly modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.userQuery.loadUsers();
  }

  createUser(): void {
    this.router.navigate(['/users/create']);
  }

  editUser(userId: string): void {
    this.router.navigate(['/users', userId, 'edit']);
  }

  deleteUser(userId: string): void {
    this.modal.confirm({
      nzTitle: 'Delete User',
      nzContent: 'Are you sure you want to delete this user?',
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.userCommands.deleteUser(userId)
    });
  }
}

// Query Service
@Injectable()
export class UserQueryService {
  private readonly usersSubject = new BehaviorSubject<UserResponse[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  users$ = this.usersSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private readonly userRepository: UserRepository) {}

  async loadUsers(): Promise<void> {
    this.loadingSubject.next(true);
    try {
      const users = await this.userRepository.findAll();
      const responses = users.map(user => UserResponse.fromDomain(user));
      this.usersSubject.next(responses);
    } finally {
      this.loadingSubject.next(false);
    }
  }
}
```

## Data Models

### Domain Entities
- **User**: Core user entity with email, profile, and authentication state
- **Account**: Business account entity with financial information
- **Contract**: Contract lifecycle management (future implementation)
- **Session**: Authentication session management

### Value Objects
- **Email**: Email address with validation
- **UserId**: Strongly-typed user identifier
- **Money**: Currency and amount representation
- **Address**: Physical address information
- **DateRange**: Start and end date pairs

### Aggregates
- **UserAggregate**: User + Profile + Preferences
- **AccountAggregate**: Account + Transactions + Balances
- **ContractAggregate**: Contract + Terms + Parties (future)

## Error Handling

### Exception Hierarchy
```typescript
// Base Exceptions
export abstract class DomainException extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export abstract class ApplicationException extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Specific Exceptions
export class UserNotFoundException extends ApplicationException {
  constructor(userId: UserId) {
    super(`User with id ${userId.value} not found`, 'USER_NOT_FOUND');
  }
}

export class InvalidEmailException extends DomainException {
  constructor(email: string) {
    super(`Invalid email format: ${email}`, 'INVALID_EMAIL');
  }
}
```

### Global Error Handling
```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private readonly notification: NzNotificationService,
    private readonly logger: Logger
  ) {}

  handleError(error: any): void {
    this.logger.error('Global error:', error);

    if (error instanceof DomainException) {
      this.notification.error('Business Rule Violation', error.message);
    } else if (error instanceof ApplicationException) {
      this.notification.error('Application Error', error.message);
    } else {
      this.notification.error('Unexpected Error', 'An unexpected error occurred');
    }
  }
}
```

## Testing Strategy

### Unit Testing
- **Domain Layer**: Test entities, value objects, and domain services in isolation
- **Application Layer**: Test use cases with mocked dependencies
- **Infrastructure Layer**: Test repository implementations with Firebase emulator
- **Presentation Layer**: Test components with Angular Testing Library

### Integration Testing
- **API Integration**: Test complete request/response cycles
- **Database Integration**: Test repository implementations with real Firebase
- **Event Integration**: Test domain event publishing and handling

### Test Structure
```typescript
// Domain Entity Tests
describe('User Entity', () => {
  describe('creation', () => {
    it('should create user with valid email and profile', () => {
      const email = Email.create('test@example.com');
      const profile = UserProfile.create('John', 'Doe');
      
      const user = User.create(email, profile);
      
      expect(user.email).toEqual(email);
      expect(user.profile).toEqual(profile);
      expect(user.getDomainEvents()).toHaveLength(1);
      expect(user.getDomainEvents()[0]).toBeInstanceOf(UserCreatedEvent);
    });

    it('should throw exception with invalid email', () => {
      expect(() => Email.create('invalid-email'))
        .toThrow(InvalidEmailException);
    });
  });
});

// Use Case Tests
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: jest.Mocked<UserRepository>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockUnitOfWork: jest.Mocked<UnitOfWork>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    mockEventBus = createMockEventBus();
    mockUnitOfWork = createMockUnitOfWork();
    
    useCase = new CreateUserUseCase(mockRepository, mockEventBus, mockUnitOfWork);
  });

  it('should create user successfully', async () => {
    const command = new CreateUserCommand(
      Email.create('test@example.com'),
      UserProfile.create('John', 'Doe')
    );
    
    mockRepository.existsByEmail.mockResolvedValue(false);
    mockUnitOfWork.execute.mockImplementation(callback => callback());

    const result = await useCase.execute(command);

    expect(result.success).toBe(true);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(mockEventBus.publishAll).toHaveBeenCalled();
  });
});
```

### Performance Testing
- **Load Testing**: Test application under expected user loads
- **Memory Testing**: Monitor memory usage and detect leaks
- **Bundle Analysis**: Analyze and optimize bundle sizes
- **Change Detection**: Verify OnPush strategy effectiveness

## Implementation Guidelines

### File Organization
```
domain-name/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   └── user.entity.spec.ts
│   ├── value-objects/
│   │   ├── email.vo.ts
│   │   └── user-id.vo.ts
│   ├── repositories/
│   │   └── user.repository.ts
│   ├── services/
│   │   └── user-domain.service.ts
│   ├── events/
│   │   └── user-created.event.ts
│   └── exceptions/
│       └── user-not-found.exception.ts
├── application/
│   ├── use-cases/
│   │   ├── create-user.use-case.ts
│   │   └── create-user.use-case.spec.ts
│   ├── dto/
│   │   ├── create-user.command.ts
│   │   └── create-user.response.ts
│   └── services/
│       ├── user-command.service.ts
│       └── user-query.service.ts
├── infrastructure/
│   ├── repositories/
│   │   ├── user-firebase.repository.ts
│   │   └── user-firebase.repository.spec.ts
│   ├── mappers/
│   │   └── user.mapper.ts
│   └── config/
│       └── user-module.config.ts
└── presentation/
    ├── components/
    │   ├── user-list/
    │   └── user-form/
    ├── pages/
    │   ├── user-management/
    │   └── user-profile/
    └── user.routes.ts
```

### Naming Conventions
- **Files**: kebab-case with type suffix (e.g., `user.entity.ts`)
- **Classes**: PascalCase (e.g., `UserEntity`)
- **Methods**: camelCase (e.g., `createUser`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
- **Interfaces**: PascalCase with descriptive names (e.g., `UserRepository`)

### Dependency Injection
```typescript
// Module Configuration
@NgModule({
  providers: [
    // Use Cases
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    
    // Services
    UserCommandService,
    UserQueryService,
    
    // Repositories
    {
      provide: 'UserRepository',
      useClass: UserFirebaseRepository
    },
    
    // Mappers
    UserMapper,
    
    // Event Handlers
    UserCreatedEventHandler,
    UserUpdatedEventHandler
  ]
})
export class UserModule {}
```

### Performance Optimizations
- **OnPush Change Detection**: All components use OnPush strategy
- **Lazy Loading**: Domain modules are lazy-loaded
- **Virtual Scrolling**: Large lists use ng-zorro-antd virtual scrolling
- **Memoization**: Expensive computations are memoized
- **Bundle Splitting**: Code splitting at domain boundaries