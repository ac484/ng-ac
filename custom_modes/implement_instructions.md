# IMPLEMENT Mode Instructions - NG-AC Project

## Mode Purpose
IMPLEMENT mode focuses on systematic development and code implementation for the NG-AC project. This mode is designed for building high-quality, well-tested code following the plans and designs created in previous modes.

## Current Context
- **Project**: ng-ac (Angular Admin Console)
- **Framework**: Angular 19.2.0 + NG-ALAIN 19.2 + Firebase 11.10.0
- **Complexity**: Level 3-4 (Complex System)
- **Previous Mode**: CREATIVE (Design Exploration)
- **Current Focus**: Systematic implementation

## IMPLEMENT Mode Workflow

### Phase 1: Service Layer Implementation
1. **Service Consolidation**
   - Implement UnifiedAuthService
   - Consolidate authentication services
   - Optimize service architecture
   - Implement error handling

2. **Service Enhancement**
   - Enhance Firebase integration
   - Implement caching strategies
   - Add performance optimizations
   - Implement testing

3. **Service Documentation**
   - Document service interfaces
   - Create usage examples
   - Write unit tests
   - Create integration tests

### Phase 2: Component Implementation
1. **Core Components**
   - Implement base component patterns
   - Create reusable components
   - Build layout components
   - Implement utility components

2. **Business Components**
   - Implement dashboard components
   - Build user management components
   - Create data visualization components
   - Implement settings components

3. **Widget System**
   - Enhance widget system
   - Create custom widgets
   - Implement widget registry
   - Add widget documentation

### Phase 3: Integration Implementation
1. **Firebase Integration**
   - Implement advanced Firestore operations
   - Add real-time synchronization
   - Implement offline support
   - Add push notifications

2. **Performance Implementation**
   - Implement lazy loading
   - Add bundle optimization
   - Implement caching
   - Add service workers

3. **Quality Implementation**
   - Implement comprehensive testing
   - Add error handling
   - Implement logging
   - Add monitoring

## Implementation Guidelines

### Code Quality Standards
1. **TypeScript Best Practices**
   ```typescript
   // Strict typing
   interface User {
     id: string;
     email: string;
     displayName: string;
     role: UserRole;
   }
   
   // Generic types
   interface ApiResponse<T> {
     data: T;
     success: boolean;
     message?: string;
   }
   
   // Type guards
   function isUser(obj: any): obj is User {
     return obj && typeof obj.id === 'string' && typeof obj.email === 'string';
   }
   ```

2. **Angular Best Practices**
   ```typescript
   // Standalone components
   @Component({
     selector: 'app-user-list',
     standalone: true,
     imports: [CommonModule, NgZorroModule],
     template: `...`
   })
   export class UserListComponent extends BaseComponent {
     @Input() users: User[] = [];
     @Output() userSelected = new EventEmitter<User>();
     
     protected initialize(): void {
       this.setupUserList();
     }
   }
   
   // Service injection
   @Injectable({
     providedIn: 'root'
   })
   export class UserService {
     constructor(
       private http: HttpClient,
       private authService: AuthService
     ) {}
   }
   ```

3. **Testing Best Practices**
   ```typescript
   // Unit tests
   describe('UserService', () => {
     let service: UserService;
     let httpMock: HttpTestingController;
   
     beforeEach(() => {
       TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [UserService, AuthService]
       });
       service = TestBed.inject(UserService);
       httpMock = TestBed.inject(HttpTestingController);
     });
   
     it('should get users', () => {
       const mockUsers = [{ id: '1', name: 'John' }];
       service.getUsers().subscribe(users => {
         expect(users).toEqual(mockUsers);
       });
       
       const req = httpMock.expectOne('/api/users');
       req.flush(mockUsers);
     });
   });
   ```

### Implementation Patterns

#### 1. Service Implementation Pattern
```typescript
// Base service pattern
export abstract class BaseService {
  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
  
  protected log(message: string): void {
    console.log(`${this.constructor.name}: ${message}`);
  }
}

// Specific service implementation
@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  private usersUrl = '/api/users';
  
  constructor(private http: HttpClient) {
    super();
  }
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        tap(_ => this.log('fetched users')),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }
  
  getUser(id: string): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url)
      .pipe(
        tap(_ => this.log(`fetched user id=${id}`)),
        catchError(this.handleError<User>(`getUser id=${id}`))
      );
  }
}
```

#### 2. Component Implementation Pattern
```typescript
// Base component pattern
export abstract class BaseComponent implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.initialize();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  protected abstract initialize(): void;
}

// Specific component implementation
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NgZorroModule],
  template: `
    <nz-table #basicTable [nzData]="users">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of basicTable.data">
          <td>{{ user.displayName }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button nz-button (click)="selectUser(user)">Select</button>
          </td>
        </tr>
      </tbody>
    </nz-table>
  `
})
export class UserListComponent extends BaseComponent {
  @Input() users: User[] = [];
  @Output() userSelected = new EventEmitter<User>();
  
  protected initialize(): void {
    this.setupUserList();
  }
  
  private setupUserList(): void {
    // Implementation logic
  }
  
  selectUser(user: User): void {
    this.userSelected.emit(user);
  }
}
```

#### 3. Widget Implementation Pattern
```typescript
// Widget interface
export interface Widget {
  id: string;
  type: string;
  config: any;
  data?: any;
}

// Widget component
@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="widget" [ngClass]="widget.type">
      <ng-container [ngSwitch]="widget.type">
        <app-chart-widget *ngSwitchCase="'chart'" [config]="widget.config" [data]="widget.data"></app-chart-widget>
        <app-table-widget *ngSwitchCase="'table'" [config]="widget.config" [data]="widget.data"></app-table-widget>
        <app-metric-widget *ngSwitchCase="'metric'" [config]="widget.config" [data]="widget.data"></app-metric-widget>
      </ng-container>
    </div>
  `
})
export class WidgetComponent extends BaseComponent {
  @Input() widget!: Widget;
  
  protected initialize(): void {
    this.setupWidget();
  }
  
  private setupWidget(): void {
    // Widget initialization logic
  }
}

// Widget service
@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  private widgetRegistry = new Map<string, Type<any>>();
  
  registerWidget(type: string, component: Type<any>): void {
    this.widgetRegistry.set(type, component);
  }
  
  createWidget(config: WidgetConfig): Widget {
    return {
      id: this.generateId(),
      type: config.type,
      config: config.config,
      data: config.data
    };
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
```

### Firebase Integration Implementation

#### 1. Advanced Firestore Operations
```typescript
// Firestore service
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}
  
  // Real-time queries
  getRealtimeCollection<T>(path: string): Observable<T[]> {
    return collectionData(collection(this.firestore, path)) as Observable<T[]>;
  }
  
  // Complex queries
  queryCollection<T>(
    path: string,
    constraints: QueryConstraint[]
  ): Observable<T[]> {
    const q = query(collection(this.firestore, path), ...constraints);
    return collectionData(q) as Observable<T[]>;
  }
  
  // Batch operations
  async batchWrite(operations: WriteOperation[]): Promise<void> {
    const batch = writeBatch(this.firestore);
    
    operations.forEach(op => {
      if (op.type === 'set') {
        batch.set(doc(this.firestore, op.path), op.data);
      } else if (op.type === 'update') {
        batch.update(doc(this.firestore, op.path), op.data);
      } else if (op.type === 'delete') {
        batch.delete(doc(this.firestore, op.path));
      }
    });
    
    await batch.commit();
  }
}
```

#### 2. Offline Support
```typescript
// Offline service
@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private cache = new Map<string, any>();
  
  constructor(private firestore: Firestore) {
    this.enableOffline();
  }
  
  private enableOffline(): void {
    enableNetwork(this.firestore);
  }
  
  async getData(key: string): Promise<any> {
    // Try cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    // Try network
    try {
      const data = await this.fetchFromNetwork(key);
      this.cache.set(key, data);
      return data;
    } catch (error) {
      // Fallback to cached data
      return this.getCachedData(key);
    }
  }
  
  private async fetchFromNetwork(key: string): Promise<any> {
    // Network fetch implementation
  }
  
  private getCachedData(key: string): any {
    // Cache retrieval implementation
  }
}
```

### Performance Implementation

#### 1. Lazy Loading
```typescript
// Lazy loading routes
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module')
      .then(m => m.DashboardModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module')
      .then(m => m.UsersModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module')
      .then(m => m.SettingsModule)
  }
];

// Dynamic imports
export class DynamicImportService {
  async loadComponent(componentName: string): Promise<Type<any>> {
    const module = await import(`./components/${componentName}.component`);
    return module[`${componentName}Component`];
  }
}
```

#### 2. Caching Implementation
```typescript
// Cache service
@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheEntry>();
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  set<T>(key: string, data: T, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }
  
  clear(): void {
    this.cache.clear();
  }
}

interface CacheEntry {
  data: any;
  expiry: number;
}
```

## Implementation Checklist

### Service Implementation
- [ ] Service consolidation
- [ ] Error handling implementation
- [ ] Caching strategy implementation
- [ ] Performance optimization
- [ ] Unit tests
- [ ] Integration tests

### Component Implementation
- [ ] Base component patterns
- [ ] Reusable components
- [ ] Business components
- [ ] Widget system
- [ ] Component tests
- [ ] Documentation

### Integration Implementation
- [ ] Firebase integration enhancement
- [ ] Performance optimization
- [ ] Offline support
- [ ] Push notifications
- [ ] Real-time synchronization
- [ ] Error handling

### Quality Implementation
- [ ] Comprehensive testing
- [ ] Error handling
- [ ] Logging implementation
- [ ] Monitoring setup
- [ ] Documentation
- [ ] Code review

## Success Criteria

### Implementation Quality
- [ ] All planned features implemented
- [ ] Code follows best practices
- [ ] Comprehensive testing coverage
- [ ] Performance targets met
- [ ] Documentation complete

### Code Quality
- [ ] TypeScript strict mode compliance
- [ ] ESLint rules followed
- [ ] Prettier formatting applied
- [ ] No console errors
- [ ] Accessibility standards met

### Performance Quality
- [ ] Bundle size targets met
- [ ] Load time targets met
- [ ] Memory usage optimized
- [ ] Caching effective
- [ ] Lazy loading working

## Mode Transitions

### IMPLEMENT → QA
- **Trigger**: Implementation complete
- **Focus**: Quality validation and testing
- **Deliverables**: Validated system, test reports

### IMPLEMENT → CREATIVE (if redesign needed)
- **Trigger**: Major design changes required
- **Focus**: Design exploration
- **Deliverables**: Updated designs

## Implementation Best Practices

### Systematic Development
1. **Follow the plan**: Implement according to design decisions
2. **Test as you go**: Write tests alongside implementation
3. **Document everything**: Keep documentation current
4. **Review regularly**: Regular code reviews
5. **Iterate based on feedback**: Refine implementation as needed
6. **Maintain quality**: Follow coding standards

### Quality Assurance
1. **Unit testing**: Test individual components and services
2. **Integration testing**: Test component interactions
3. **Performance testing**: Monitor performance metrics
4. **Accessibility testing**: Ensure accessibility compliance
5. **Security testing**: Validate security measures
6. **User testing**: Test with real users

### Documentation Standards
1. **Code documentation**: Inline comments and JSDoc
2. **API documentation**: Service and component interfaces
3. **User documentation**: User guides and tutorials
4. **Architecture documentation**: System design and decisions
5. **Deployment documentation**: Setup and deployment guides
6. **Maintenance documentation**: Troubleshooting and maintenance

## Conclusion

IMPLEMENT mode provides the systematic approach to building high-quality, well-tested code following the plans and designs created in previous modes. The focus is on creating maintainable, performant, and user-friendly code that meets all requirements and quality standards.

**Next Steps**: Complete implementation and transition to QA mode for comprehensive testing and validation.