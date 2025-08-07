# Design Document

## Overview

This design document outlines the comprehensive restructuring of the business-partner domain to achieve optimal DDD compliance, performance optimization using Angular 20+ features, and seamless integration with ng-zorro-antd components. The design emphasizes extreme minimalism, avoiding over-engineering while ensuring all functionality is preserved and enhanced.

The restructure will transform the current implementation into a modern, signal-driven architecture that leverages the latest Angular patterns while maintaining backward compatibility and ensuring no field display issues.

## Architecture

### Layer Architecture (DDD Compliance)

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Components    │  │     Pages       │  │   Guards    │ │
│  │   - Smart/Dumb  │  │   - Routing     │  │ - Resolvers │ │
│  │   - OnPush      │  │   - Lazy Load   │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Repositories   │  │    Mappers      │  │  Adapters   │ │
│  │  - Firebase     │  │  - Entity ↔ DTO │  │ - External  │ │
│  │  - Cache        │  │  - Immutable    │  │   Services  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Use Cases     │  │      DTOs       │  │  Services   │ │
│  │  - Commands     │  │  - Commands     │  │ - Facades   │ │
│  │  - Queries      │  │  - Responses    │  │ - Signals   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │    Entities     │  │  Value Objects  │  │ Repositories│ │
│  │  - Aggregates   │  │  - Immutable    │  │ - Interfaces│ │
│  │  - Immutable    │  │  - Validation   │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Signal-Driven State Management

```typescript
// Application Service with Signals
class CompanyApplicationService {
  // Private signals for internal state
  private readonly companiesSignal = signal<CompanyResponseDto[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  
  // Public computed signals for components
  readonly companies = computed(() => this.companiesSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());
  readonly hasCompanies = computed(() => this.companies().length > 0);
  readonly filteredCompanies = computed(() => 
    this.companies().filter(c => c.companyName.includes(this.searchQuery()))
  );
}
```

## Components and Interfaces

### Smart vs Dumb Component Architecture

#### Smart Components (Container Components)
- **CompanyManagementPageComponent**: Main container, handles routing and high-level state
- **CompanyListContainerComponent**: Manages company list state and operations

#### Dumb Components (Presentation Components)
- **CompanyListComponent**: Pure display of company data with events
- **CompanyFormComponent**: Reusable form for create/edit operations
- **ContactInlineEditComponent**: Inline contact editing functionality
- **CompanyStatusTagComponent**: Status display with proper colors
- **EmptyStateComponent**: Reusable empty state display

### Component Interface Design

```typescript
// Smart Component
@Component({
  selector: 'app-company-list-container',
  template: `
    <app-company-list
      [companies]="companyService.companies()"
      [loading]="companyService.loading()"
      [error]="companyService.error()"
      (searchChanged)="onSearch($event)"
      (companyCreate)="onCreateCompany($event)"
      (companyUpdate)="onUpdateCompany($event)"
      (companyDelete)="onDeleteCompany($event)"
      (contactUpdate)="onUpdateContact($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyListContainerComponent {
  constructor(protected readonly companyService: CompanyApplicationService) {}
}

// Dumb Component
@Component({
  selector: 'app-company-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['companies', 'loading', 'error'],
  outputs: ['searchChanged', 'companyCreate', 'companyUpdate', 'companyDelete', 'contactUpdate']
})
export class CompanyListComponent {
  @Input() companies: CompanyResponseDto[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  
  @Output() searchChanged = new EventEmitter<string>();
  @Output() companyCreate = new EventEmitter<CreateCompanyDto>();
  @Output() companyUpdate = new EventEmitter<{id: string, data: UpdateCompanyDto}>();
  @Output() companyDelete = new EventEmitter<string>();
  @Output() contactUpdate = new EventEmitter<ContactUpdateEvent>();
}
```

### Performance-Optimized Table Design

```typescript
@Component({
  template: `
    <nz-table 
      #companyTable
      [nzData]="companies"
      [nzVirtualScroll]="true"
      [nzVirtualItemSize]="54"
      [nzVirtualMaxBufferPx]="500"
      [nzVirtualMinBufferPx]="300"
      [nzShowPagination]="false"
      [nzScroll]="{ y: '400px' }"
      [nzLoading]="loading">
      
      <thead>
        <tr>
          <th nzWidth="50px"></th>
          <th nzSortKey="companyName">公司名稱</th>
          <th nzSortKey="businessRegistrationNumber">統一編號</th>
          <th nzSortKey="status">合作狀態</th>
          <th>電話</th>
          <th nzWidth="120px">操作</th>
        </tr>
      </thead>
      
      <tbody>
        @for (company of companyTable.data; track company.id) {
          <tr>
            <td [nzExpand]="expandSet().has(company.id)" 
                (nzExpandChange)="onExpandChange(company.id, $event)">
            </td>
            <td>{{ company.companyName }}</td>
            <td>{{ company.businessRegistrationNumber }}</td>
            <td>
              <app-company-status-tag [status]="company.status" />
            </td>
            <td>{{ company.businessPhone }}</td>
            <td>
              <nz-button-group nzSize="small">
                <button nz-button nzType="default" (click)="editCompany.emit(company)">
                  <span nz-icon nzType="edit"></span>
                </button>
                <button nz-button nzType="default" nzDanger 
                        nz-popconfirm nzPopconfirmTitle="確定要刪除嗎？"
                        (nzOnConfirm)="deleteCompany.emit(company.id)">
                  <span nz-icon nzType="delete"></span>
                </button>
              </nz-button-group>
            </td>
          </tr>
          
          @if (expandSet().has(company.id)) {
            <tr>
              <td colspan="6">
                @defer (when expandSet().has(company.id)) {
                  <app-contact-management 
                    [contacts]="company.contacts"
                    [companyId]="company.id"
                    (contactUpdate)="contactUpdate.emit($event)"
                  />
                } @placeholder {
                  <nz-spin nzSize="small"></nz-spin>
                }
              </td>
            </tr>
          }
        }
      </tbody>
    </nz-table>
  `
})
```

## Data Models

### Domain Entity Design (Immutable)

```typescript
export class Company extends BaseAggregateRoot<CompanyId> {
  private constructor(
    id: CompanyId,
    private readonly props: CompanyProps
  ) {
    super(id);
  }

  static create(props: CreateCompanyProps): Company {
    const companyProps: CompanyProps = {
      ...props,
      contacts: props.contacts.map(c => Contact.create(c)),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return new Company(CompanyId.generate(), companyProps);
  }

  // Immutable update methods
  updateBasicInfo(info: Partial<BasicCompanyInfo>): Company {
    return new Company(this.id, {
      ...this.props,
      ...info,
      updatedAt: new Date()
    });
  }

  addContact(contact: Contact): Company {
    return new Company(this.id, {
      ...this.props,
      contacts: [...this.props.contacts, contact],
      updatedAt: new Date()
    });
  }

  updateContact(index: number, contact: Contact): Company {
    const newContacts = [...this.props.contacts];
    newContacts[index] = contact;
    
    return new Company(this.id, {
      ...this.props,
      contacts: newContacts,
      updatedAt: new Date()
    });
  }

  removeContact(index: number): Company {
    return new Company(this.id, {
      ...this.props,
      contacts: this.props.contacts.filter((_, i) => i !== index),
      updatedAt: new Date()
    });
  }

  // Getters for accessing properties
  get companyName(): string { return this.props.companyName; }
  get businessRegistrationNumber(): string { return this.props.businessRegistrationNumber; }
  get status(): CompanyStatus { return this.props.status; }
  get contacts(): readonly Contact[] { return this.props.contacts; }
  // ... other getters
}
```

### Value Object Design

```typescript
export class CompanyStatus extends ValueObject<{ value: CompanyStatusEnum }> {
  private constructor(value: CompanyStatusEnum) {
    super({ value });
  }

  static create(value: CompanyStatusEnum): CompanyStatus {
    if (!Object.values(CompanyStatusEnum).includes(value)) {
      throw new InvalidCompanyStatusError(value);
    }
    return new CompanyStatus(value);
  }

  get value(): CompanyStatusEnum {
    return this.props.value;
  }

  isActive(): boolean {
    return this.props.value === CompanyStatusEnum.Active;
  }

  isBlacklisted(): boolean {
    return this.props.value === CompanyStatusEnum.Blacklisted;
  }

  getDisplayColor(): string {
    switch (this.props.value) {
      case CompanyStatusEnum.Active: return 'green';
      case CompanyStatusEnum.Inactive: return 'orange';
      case CompanyStatusEnum.Blacklisted: return 'red';
      default: return 'default';
    }
  }
}
```

### DTO Design with Validation

```typescript
export interface CreateCompanyDto {
  readonly companyName: string;
  readonly businessRegistrationNumber: string;
  readonly status: CompanyStatusEnum;
  readonly address: string;
  readonly businessPhone: string;
  readonly fax?: string;
  readonly website?: string;
  readonly contractCount: number;
  readonly latestContractDate: string | null;
  readonly partnerSince: string;
  readonly cooperationScope?: string;
  readonly businessModel?: string;
  readonly creditScore: number;
  readonly riskLevel: RiskLevelEnum;
  readonly reviewHistory?: string;
  readonly blacklistReason?: string;
  readonly contacts: readonly CreateContactDto[];
}

export interface CompanyResponseDto {
  readonly id: string;
  readonly companyName: string;
  readonly businessRegistrationNumber: string;
  readonly status: CompanyStatusEnum;
  readonly address: string;
  readonly businessPhone: string;
  readonly fax: string;
  readonly website: string;
  readonly contractCount: number;
  readonly latestContractDate: string | null;
  readonly partnerSince: string;
  readonly cooperationScope: string;
  readonly businessModel: string;
  readonly creditScore: number;
  readonly riskLevel: RiskLevelEnum;
  readonly reviewHistory: string;
  readonly blacklistReason: string | null;
  readonly contacts: readonly ContactResponseDto[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
```

## Error Handling

### Centralized Error Management

```typescript
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  private readonly errorSignal = signal<AppError | null>(null);
  
  readonly currentError = computed(() => this.errorSignal());
  
  handleError(error: unknown): void {
    const appError = this.mapToAppError(error);
    this.errorSignal.set(appError);
    
    // Show user-friendly message
    this.messageService.error(appError.userMessage);
    
    // Log technical details
    console.error('Application Error:', appError);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  private mapToAppError(error: unknown): AppError {
    if (error instanceof DomainError) {
      return new AppError(error.message, error.code, error);
    }
    
    if (error instanceof HttpErrorResponse) {
      return new AppError(
        'Network error occurred',
        'NETWORK_ERROR',
        error
      );
    }
    
    return new AppError(
      'An unexpected error occurred',
      'UNKNOWN_ERROR',
      error
    );
  }
}
```

### Domain-Specific Errors

```typescript
export class CompanyNotFoundError extends DomainError {
  constructor(companyId: string) {
    super(`Company with ID ${companyId} not found`, 'COMPANY_NOT_FOUND');
  }
}

export class InvalidCompanyStatusError extends DomainError {
  constructor(status: string) {
    super(`Invalid company status: ${status}`, 'INVALID_COMPANY_STATUS');
  }
}

export class ContactValidationError extends DomainError {
  constructor(field: string, value: string) {
    super(`Invalid contact ${field}: ${value}`, 'CONTACT_VALIDATION_ERROR');
  }
}
```

## Testing Strategy

### Unit Testing Approach

#### Domain Layer Testing
```typescript
describe('Company Entity', () => {
  describe('create', () => {
    it('should create company with valid data', () => {
      const props = createValidCompanyProps();
      const company = Company.create(props);
      
      expect(company.companyName).toBe(props.companyName);
      expect(company.isValid()).toBe(true);
    });

    it('should throw error with invalid data', () => {
      const props = createInvalidCompanyProps();
      
      expect(() => Company.create(props)).toThrow(CompanyValidationError);
    });
  });

  describe('updateContact', () => {
    it('should return new instance with updated contact', () => {
      const company = createTestCompany();
      const newContact = createTestContact();
      
      const updatedCompany = company.updateContact(0, newContact);
      
      expect(updatedCompany).not.toBe(company);
      expect(updatedCompany.contacts[0]).toBe(newContact);
    });
  });
});
```

#### Application Layer Testing
```typescript
describe('CompanyApplicationService', () => {
  let service: CompanyApplicationService;
  let mockRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new CompanyApplicationService(mockRepository);
  });

  describe('createCompany', () => {
    it('should create company and update signal', async () => {
      const dto = createValidCompanyDto();
      const company = createTestCompany();
      mockRepository.create.mockResolvedValue(company);

      await service.createCompany(dto);

      expect(service.companies()).toContain(jasmine.objectContaining({
        id: company.id.value
      }));
    });
  });
});
```

#### Component Testing
```typescript
describe('CompanyListComponent', () => {
  let component: CompanyListComponent;
  let fixture: ComponentFixture<CompanyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompanyListComponent]
    });
    
    fixture = TestBed.createComponent(CompanyListComponent);
    component = fixture.componentInstance;
  });

  it('should display companies', () => {
    component.companies = [createTestCompanyDto()];
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);
  });

  it('should emit search event', () => {
    spyOn(component.searchChanged, 'emit');
    
    component.onSearch('test');
    
    expect(component.searchChanged.emit).toHaveBeenCalledWith('test');
  });
});
```

### Integration Testing

```typescript
describe('Company Management Integration', () => {
  let service: CompanyApplicationService;
  let repository: CompanyFirebaseRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompanyApplicationService,
        { provide: COMPANY_REPOSITORY, useClass: CompanyFirebaseRepository }
      ]
    });
    
    service = TestBed.inject(CompanyApplicationService);
    repository = TestBed.inject(COMPANY_REPOSITORY);
  });

  it('should create and retrieve company', async () => {
    const dto = createValidCompanyDto();
    
    await service.createCompany(dto);
    const companies = await service.getAllCompanies().toPromise();
    
    expect(companies).toContain(jasmine.objectContaining({
      companyName: dto.companyName
    }));
  });
});
```

### E2E Testing Strategy

```typescript
describe('Company Management E2E', () => {
  it('should create new company with contacts', () => {
    cy.visit('/business-partners');
    cy.get('[data-cy=add-company-btn]').click();
    
    // Fill company form
    cy.get('[data-cy=company-name]').type('Test Company');
    cy.get('[data-cy=registration-number]').type('12345678');
    
    // Add contact
    cy.get('[data-cy=add-contact-btn]').click();
    cy.get('[data-cy=contact-name]').type('John Doe');
    cy.get('[data-cy=contact-email]').type('john@test.com');
    
    cy.get('[data-cy=save-company-btn]').click();
    
    // Verify company appears in list
    cy.get('[data-cy=company-list]').should('contain', 'Test Company');
  });
});
```

## Performance Optimization Details

### Virtual Scrolling Implementation

```typescript
@Component({
  template: `
    <nz-table 
      [nzData]="companies()"
      [nzVirtualScroll]="true"
      [nzVirtualItemSize]="itemSize()"
      [nzVirtualMaxBufferPx]="maxBuffer()"
      [nzVirtualMinBufferPx]="minBuffer()">
      <!-- table content -->
    </nz-table>
  `
})
export class CompanyListComponent {
  // Computed values for virtual scrolling optimization
  itemSize = computed(() => this.expandedRows().size > 0 ? 120 : 54);
  maxBuffer = computed(() => this.companies().length > 1000 ? 800 : 500);
  minBuffer = computed(() => this.companies().length > 1000 ? 400 : 300);
}
```

### Debounced Search Implementation

```typescript
export class CompanySearchService {
  private readonly searchSubject = new Subject<string>();
  
  readonly searchResults$ = this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => 
      query.trim() 
        ? this.companyRepository.search(query)
        : this.companyRepository.getAll()
    ),
    shareReplay(1)
  );

  search(query: string): void {
    this.searchSubject.next(query);
  }
}
```

### Memory Management

```typescript
@Component({
  // ... component config
})
export class CompanyListComponent implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  
  ngOnInit(): void {
    // Auto-cleanup subscriptions
    this.searchService.searchResults$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(results => {
        this.companies.set(results);
      });
  }
}
```

## Integration Points

### Shared Module Integration

```typescript
// business-partner.providers.ts
export const BUSINESS_PARTNER_PROVIDERS = [
  CompanyApplicationService,
  { provide: COMPANY_REPOSITORY, useClass: CompanyFirebaseRepository },
  CompanyMapper,
  ContactMapper
] as const;

// Integration with shared infrastructure
export const BUSINESS_PARTNER_CONFIG = {
  providers: [
    ...BUSINESS_PARTNER_PROVIDERS,
    ...SHARED_INFRASTRUCTURE_PROVIDERS
  ]
} as const;
```

### Route Configuration

```typescript
// business-partner.routes.ts
export const BUSINESS_PARTNER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/pages/company-management/company-management.component')
      .then(m => m.CompanyManagementComponent),
    canActivate: [authGuard],
    resolve: {
      companies: companyResolver
    }
  },
  {
    path: 'create',
    loadComponent: () => import('./presentation/pages/company-create/company-create.component')
      .then(m => m.CompanyCreateComponent),
    canActivate: [authGuard]
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./presentation/pages/company-edit/company-edit.component')
      .then(m => m.CompanyEditComponent),
    canActivate: [authGuard],
    resolve: {
      company: companyDetailResolver
    }
  }
];
```

This design ensures a clean, performant, and maintainable architecture that leverages modern Angular patterns while preserving all existing functionality.