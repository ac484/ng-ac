# Enhanced Development Guidelines

## Overview

This document provides comprehensive development guidelines for the NG-AC project, combining architectural patterns with practical implementation practices.

## Project Structure Guidelines

### 1. Domain-Driven Design Implementation

#### Domain Module Structure
Each domain should follow this structure:
```
domain-name/
├── application/
│   ├── commands/          # State-changing operations
│   ├── queries/           # Read-only operations
│   └── services/          # Application services
├── domain/
│   ├── entities/          # Domain entities
│   ├── value-objects/     # Immutable values
│   ├── aggregates/        # Transaction boundaries
│   └── repositories/      # Data access interfaces
├── infrastructure/
│   ├── repositories/      # Repository implementations
│   ├── services/          # External services
│   └── adapters/          # External system adapters
└── presentation/
    ├── components/        # Domain-specific UI
    ├── pages/             # Page components
    └── routes/            # Domain routing
```

#### Implementation Rules
1. **Domain Isolation**: Keep domains independent
2. **Interface Contracts**: Use interfaces for cross-domain communication
3. **Event-Driven**: Use domain events for loose coupling
4. **Repository Pattern**: Abstract data access

### 2. Shared Module Guidelines

#### Shared Application Layer
```typescript
// Command Bus Pattern
export class CommandBus {
  private handlers = new Map<string, ICommandHandler>();

  register<T extends ICommand>(commandType: string, handler: ICommandHandler<T>): void {
    this.handlers.set(commandType, handler);
  }

  async execute<T>(command: ICommand): Promise<T> {
    const handler = this.handlers.get(command.constructor.name);
    if (!handler) {
      throw new Error(`No handler registered for command: ${command.constructor.name}`);
    }
    return handler.handle(command);
  }
}

// Event Bus Pattern
export class EventBus {
  private handlers = new Map<string, IEventHandler[]>();

  subscribe<T extends IDomainEvent>(eventType: string, handler: IEventHandler<T>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  publish(event: IDomainEvent): void {
    const handlers = this.handlers.get(event.constructor.name) || [];
    handlers.forEach(handler => handler.handle(event));
  }
}
```

#### Shared Domain Layer
```typescript
// Base Entity
export abstract class BaseEntity<TId> {
  protected constructor(public readonly id: TId) {}

  equals(other: BaseEntity<TId>): boolean {
    return this.id === other.id;
  }

  abstract validate(): boolean;
}

// Base Aggregate Root
export abstract class BaseAggregateRoot<TId> extends BaseEntity<TId> {
  private _domainEvents: IDomainEvent[] = [];
  private _version: number = 0;

  protected addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  get domainEvents(): IDomainEvent[] {
    return [...this._domainEvents];
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  incrementVersion(): void {
    this._version++;
  }

  get version(): number {
    return this._version;
  }
}

// Value Object Base
export abstract class ValueObject<T> {
  protected constructor(protected readonly value: T) {}

  equals(other: ValueObject<T>): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return String(this.value);
  }
}
```

## Code Organization Standards

### 1. File Naming Conventions

#### Components
```typescript
// Component files
user-list.component.ts
user-list.component.html
user-list.component.less
user-list.component.spec.ts

// Component class
export class UserListComponent extends BaseComponent {
  // Implementation
}
```

#### Services
```typescript
// Service files
user.service.ts
user.service.spec.ts

// Service class
export class UserService extends BaseService {
  // Implementation
}
```

#### Models
```typescript
// Entity files
user.entity.ts
user-profile.entity.ts

// Value object files
email.value-object.ts
phone.value-object.ts

// Repository interface files
user-repository.interface.ts
```

### 2. Import Organization

#### Import Order
```typescript
// 1. Angular imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// 2. Third-party libraries
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

// 3. ng-alain imports
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

// 4. Shared imports
import { BaseComponent } from '@shared/presentation/base.component';
import { UserService } from '@shared/application/user.service';

// 5. Domain imports
import { User } from '@domain/user/domain/entities/user.entity';
import { UserRepository } from '@domain/user/domain/repositories/user-repository.interface';

// 6. Relative imports
import { UserListComponent } from './user-list.component';
```

### 3. Component Structure

#### Component Template
```typescript
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent extends BaseComponent implements OnInit, OnDestroy {
  // Properties
  users$: Observable<User[]> = this.userService.getUsers();
  loading$ = new BehaviorSubject<boolean>(false);

  // Constructor
  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private router: Router
  ) {
    super();
  }

  // Lifecycle hooks
  ngOnInit(): void {
    this.loadUsers();
  }

  // Public methods
  loadUsers(): void {
    this.loading$.next(true);
    this.users$ = this.userService.getUsers().pipe(
      finalize(() => this.loading$.next(false)),
      takeUntil(this.destroy$)
    );
  }

  editUser(user: User): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  deleteUser(user: User): void {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.message.success('User deleted successfully');
        this.loadUsers();
      },
      error: (error) => {
        this.message.error('Failed to delete user');
        console.error('Delete user error:', error);
      }
    });
  }
}
```

## Authentication Integration

### 1. @delon/auth Integration

#### Authentication Service
```typescript
// auth.service.ts
@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  constructor(
    private http: _HttpClient,
    private tokenService: TokenService,
    private authService: AuthService as any
  ) {
    super();
  }

  login(credentials: LoginCredentials): Observable<LoginResult> {
    return this.http.post<LoginResult>('/auth/login', credentials).pipe(
      tap(result => {
        this.tokenService.set(result.token);
        this.authService.login(result);
      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/auth/logout').pipe(
      tap(() => {
        this.tokenService.clear();
        this.authService.logout();
      }),
      catchError(this.handleError)
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>('/auth/me').pipe(
      catchError(this.handleError)
    );
  }
}
```

#### Route Guards
```typescript
// auth.guard.ts
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: state.url }
          });
          return false;
        }
        return true;
      })
    );
  }
}
```

### 2. Firebase Integration

#### Firebase Configuration
```typescript
// firebase-config.ts
export const firebaseConfig = {
  apiKey: environment.firebase.apiKey,
  authDomain: environment.firebase.authDomain,
  projectId: environment.firebase.projectId,
  storageBucket: environment.firebase.storageBucket,
  messagingSenderId: environment.firebase.messagingSenderId,
  appId: environment.firebase.appId,
  measurementId: environment.firebase.measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
```

#### Firebase Repository Implementation
```typescript
// firebase-user-repository.ts
@Injectable()
export class FirebaseUserRepository implements UserRepository {
  private readonly collection = 'users';

  constructor(private firestore: Firestore) {}

  async findById(id: string): Promise<User | null> {
    const docRef = doc(this.firestore, this.collection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return User.fromFirestore(docSnap.data(), docSnap.id);
    }
    return null;
  }

  async save(user: User): Promise<void> {
    const docRef = doc(this.firestore, this.collection, user.id);
    await setDoc(docRef, user.toFirestore());
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.firestore, this.collection, id);
    await deleteDoc(docRef);
  }

  async findAll(): Promise<User[]> {
    const q = query(collection(this.firestore, this.collection));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => 
      User.fromFirestore(doc.data(), doc.id)
    );
  }
}
```

## Error Handling Patterns

### 1. Global Error Handling

#### Error Interceptor
```typescript
// error.interceptor.ts
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private message: NzMessageService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 401:
              this.router.navigate(['/auth/login']);
              errorMessage = 'Unauthorized access';
              break;
            case 403:
              errorMessage = 'Access forbidden';
              break;
            case 404:
              errorMessage = 'Resource not found';
              break;
            case 500:
              errorMessage = 'Internal server error';
              break;
            default:
              errorMessage = error.error?.message || errorMessage;
          }
        }

        this.message.error(errorMessage);
        return throwError(() => error);
      })
    );
  }
}
```

### 2. Domain-Specific Error Handling

#### Domain Exceptions
```typescript
// domain-exceptions.ts
export class DomainException extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class UserNotFoundException extends DomainException {
  constructor(userId: string) {
    super(`User with id ${userId} not found`, 'USER_NOT_FOUND');
  }
}

export class InvalidEmailException extends DomainException {
  constructor(email: string) {
    super(`Invalid email format: ${email}`, 'INVALID_EMAIL');
  }
}
```

#### Error Handling in Services
```typescript
// user.service.ts
@Injectable()
export class UserService extends BaseService {
  constructor(
    private userRepository: UserRepository,
    private message: NzMessageService
  ) {
    super();
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new UserNotFoundException(id);
      }
      return user;
    } catch (error) {
      if (error instanceof DomainException) {
        this.message.error(error.message);
      } else {
        this.message.error('Failed to retrieve user');
        console.error('Get user error:', error);
      }
      throw error;
    }
  }
}
```

## Testing Guidelines

### 1. Unit Testing

#### Component Testing
```typescript
// user-list.component.spec.ts
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let message: jasmine.SpyObj<NzMessageService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser']);
    const messageSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: NzMessageService, useValue: messageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    message = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    const mockUsers = [new User('1', 'John', 'john@example.com')];
    userService.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users$).toBeDefined();
  });

  it('should delete user successfully', () => {
    const user = new User('1', 'John', 'john@example.com');
    userService.deleteUser.and.returnValue(of(void 0));

    component.deleteUser(user);

    expect(userService.deleteUser).toHaveBeenCalledWith('1');
    expect(message.success).toHaveBeenCalledWith('User deleted successfully');
  });
});
```

#### Service Testing
```typescript
// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;
  let userRepository: jasmine.SpyObj<UserRepository>;
  let message: jasmine.SpyObj<NzMessageService>;

  beforeEach(() => {
    const userRepositorySpy = jasmine.createSpyObj('UserRepository', ['findById', 'save', 'delete']);
    const messageSpy = jasmine.createSpyObj('NzMessageService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: userRepositorySpy },
        { provide: NzMessageService, useValue: messageSpy }
      ]
    });

    service = TestBed.inject(UserService);
    userRepository = TestBed.inject(UserRepository) as jasmine.SpyObj<UserRepository>;
    message = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user by id successfully', async () => {
    const mockUser = new User('1', 'John', 'john@example.com');
    userRepository.findById.and.returnValue(Promise.resolve(mockUser));

    const result = await service.getUserById('1');

    expect(result).toEqual(mockUser);
    expect(userRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should throw UserNotFoundException when user not found', async () => {
    userRepository.findById.and.returnValue(Promise.resolve(null));

    await expectAsync(service.getUserById('1')).toBeRejectedWith(UserNotFoundException);
  });
});
```

### 2. Integration Testing

#### Repository Testing
```typescript
// firebase-user-repository.spec.ts
describe('FirebaseUserRepository', () => {
  let repository: FirebaseUserRepository;
  let firestore: jasmine.SpyObj<Firestore>;

  beforeEach(() => {
    const firestoreSpy = jasmine.createSpyObj('Firestore', ['collection', 'doc']);
    TestBed.configureTestingModule({
      providers: [
        FirebaseUserRepository,
        { provide: Firestore, useValue: firestoreSpy }
      ]
    });

    repository = TestBed.inject(FirebaseUserRepository);
    firestore = TestBed.inject(Firestore) as jasmine.SpyObj<Firestore>;
  });

  it('should find user by id', async () => {
    const mockUserData = { name: 'John', email: 'john@example.com' };
    const mockDocSnap = {
      exists: () => true,
      data: () => mockUserData,
      id: '1'
    };

    spyOn(getDoc, 'getDoc').and.returnValue(Promise.resolve(mockDocSnap as any));

    const result = await repository.findById('1');

    expect(result).toBeDefined();
    expect(result?.id).toBe('1');
  });
});
```

## Performance Optimization

### 1. Change Detection Strategy

#### OnPush Strategy
```typescript
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  users$ = new BehaviorSubject<User[]>([]);

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users$.next(users);
    });
  }
}
```

### 2. Lazy Loading

#### Route-Based Lazy Loading
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./domain/user/presentation/user.routes')
      .then(m => m.USER_ROUTES)
  }
];
```

#### Component Lazy Loading
```typescript
// user-detail.component.ts
@Component({
  selector: 'app-user-detail',
  template: `
    <ng-container *ngIf="user$ | async as user">
      <app-user-form [user]="user"></app-user-form>
    </ng-container>
  `
})
export class UserDetailComponent {
  user$ = this.route.data.pipe(
    map(data => data['user'])
  );

  constructor(private route: ActivatedRoute) {}
}
```

### 3. Virtual Scrolling

#### Large List Optimization
```typescript
// user-list.component.html
<cdk-virtual-scroll-viewport itemSize="50" class="user-list">
  <div *cdkVirtualFor="let user of users$ | async" class="user-item">
    <span>{{ user.name }}</span>
    <span>{{ user.email }}</span>
  </div>
</cdk-virtual-scroll-viewport>
```

## Security Guidelines

### 1. Input Validation

#### Form Validation
```typescript
// user-form.component.ts
@Component({
  selector: 'app-user-form',
  template: `
    <form nz-form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>Name</nz-form-label>
        <nz-form-control [nzSpan]="14" nzErrorTip="Please input name!">
          <input nz-input formControlName="name" placeholder="Please input name" />
        </nz-form-control>
      </nz-form-item>
      
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>Email</nz-form-label>
        <nz-form-control [nzSpan]="14" nzErrorTip="Please input valid email!">
          <input nz-input formControlName="email" placeholder="Please input email" />
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class UserFormComponent {
  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    if (this.userForm.valid) {
      // Submit form
    }
  }
}
```

### 2. XSS Prevention

#### Content Sanitization
```typescript
// safe-html.pipe.ts
@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
```

### 3. CSRF Protection

#### HTTP Interceptor
```typescript
// csrf.interceptor.ts
@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.getCsrfToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          'X-CSRF-Token': token
        }
      });
    }

    return next.handle(request);
  }

  private getCsrfToken(): string | null {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
  }
}
```

## Documentation Standards

### 1. Code Documentation

#### JSDoc Comments
```typescript
/**
 * Service for managing user operations
 * @description Handles CRUD operations for users including authentication
 */
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  /**
   * Retrieves a user by their unique identifier
   * @param id - The unique identifier of the user
   * @returns Observable of the user or null if not found
   * @throws UserNotFoundException when user is not found
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new user
   * @param userData - The user data to create
   * @returns Observable of the created user
   * @throws ValidationException when user data is invalid
   */
  createUser(userData: CreateUserDto): Observable<User> {
    return this.http.post<User>('/api/users', userData).pipe(
      catchError(this.handleError)
    );
  }
}
```

### 2. API Documentation

#### OpenAPI/Swagger
```typescript
// user.controller.ts
@Controller('users')
export class UserController {
  /**
   * @summary Get user by ID
   * @description Retrieves a user by their unique identifier
   * @param id - User ID
   * @returns User object
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }
}
```

## Deployment Guidelines

### 1. Environment Configuration

#### Environment Files
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  firebase: {
    apiKey: 'dev-api-key',
    authDomain: 'dev-project.firebaseapp.com',
    projectId: 'dev-project-id'
  }
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.production.com',
  firebase: {
    apiKey: 'prod-api-key',
    authDomain: 'prod-project.firebaseapp.com',
    projectId: 'prod-project-id'
  }
};
```

### 2. Build Optimization

#### Production Build
```bash
# Build for production
npm run build

# Analyze bundle
npm run analyze

# Test production build
npm run test:prod
```

### 3. CI/CD Pipeline

#### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
          channelId: live
```

---

*This document provides comprehensive development guidelines and should be updated as the project evolves.* 