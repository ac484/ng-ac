# Next.js 到 Angular 代碼轉換

本目錄包含了從 Next.js 代碼轉換為 Angular 代碼的完整實現，專注於專案、合約、合作夥伴、文件和 AI 相關功能。

## 🚀 轉換概述

### 轉換範圍
- **專案管理**: 完整的專案和任務管理系統
- **合約管理**: 合約生命週期和狀態管理
- **合作夥伴**: 夥伴關係管理和績效追蹤
- **文件管理**: 文件上傳、分類和版本控制
- **AI 功能**: AI 分析、預測和洞察服務

### 技術架構
- **框架**: Angular 19.2.0
- **狀態管理**: RxJS + BehaviorSubject
- **數據持久化**: Firebase Firestore
- **架構模式**: DDD (Domain-Driven Design)
- **組件**: Standalone Components

## 📁 文件結構

```
nextjs-angular/
├── types.ts                    # 類型定義
├── base-firebase.service.ts    # Firebase 基礎服務
├── project.service.ts          # 專案服務
├── project-state.service.ts    # 專案狀態管理
├── contract.service.ts         # 合約服務
├── partner.service.ts          # 合作夥伴服務
├── document.service.ts         # 文件管理服務
├── ai.service.ts              # AI 功能服務
├── project-list.component.ts   # 專案列表組件示例
└── README.md                  # 本文件
```

## 🔧 核心服務

### 1. BaseFirebaseService
Firebase 操作的基礎服務，提供通用的 CRUD 操作：

```typescript
@Injectable({
  providedIn: 'root'
})
export class BaseFirebaseService<T extends DocumentData> {
  // 基本 CRUD 操作
  getAll(): Observable<T[]>
  getById(id: string): Observable<T | null>
  create(data: Omit<T, 'id'>): Observable<string>
  update(id: string, data: Partial<T>): Observable<void>
  delete(id: string): Observable<void>

  // 高級功能
  getPaginated(options: PaginationOptions): Observable<PaginatedResult<T>>
  subscribeToCollection(): Observable<T[]>
  batch(operations: BatchOperation[]): Observable<void>
}
```

### 2. ProjectService
專案管理的核心服務：

```typescript
@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseFirebaseService<Project> {
  // 專案操作
  getActiveProjects(): Observable<Project[]>
  getProjectStats(): Observable<ProjectStats>
  getProjectProgress(projectId: string): Observable<ProjectProgress>

  // 任務管理
  addTask(projectId: string, taskData: CreateTaskDto): Observable<void>
  updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Observable<void>

  // 搜索和過濾
  searchProjects(searchTerm: string): Observable<Project[]>
  getUpcomingDeadlines(days: number): Observable<Project[]>
}
```

### 3. ProjectStateService
專案狀態管理服務，使用 RxJS 進行響應式狀態管理：

```typescript
@Injectable({
  providedIn: 'root'
})
export class ProjectStateService {
  // 狀態流
  readonly state$ = this._state.asObservable()
  readonly projects$ = this.state$.pipe(map(state => state.projects))
  readonly loading$ = this.state$.pipe(map(state => state.loading))
  readonly error$ = this.state$.pipe(map(state => state.error))

  // 操作方法
  loadProjects(): void
  createProject(projectData: CreateProjectDto): Observable<string>
  selectProject(project: Project | null): void
}
```

## 🎯 使用方式

### 1. 注入服務

```typescript
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  template: `...`
})
export class ProjectListComponent {
  constructor(
    private projectStateService: ProjectStateService,
    private contractService: ContractService,
    private partnerService: PartnerService
  ) {}
}
```

### 2. 訂閱數據流

```typescript
export class ProjectListComponent implements OnInit {
  readonly projects$ = this.projectStateService.projects$;
  readonly loading$ = this.projectStateService.loading$;
  readonly projectStats$ = this.projectStateService.projectStats$;

  ngOnInit(): void {
    this.projectStateService.loadProjects();
  }
}
```

### 3. 在模板中使用

```html
<div class="projects-section">
  <div class="project-card" *ngFor="let project of projects$ | async">
    <h3>{{ project.title }}</h3>
    <p>{{ project.description }}</p>
    <div class="progress-bar">
      <div [style.width.%]="getTaskProgressPercentage(project.tasks)"></div>
    </div>
  </div>
</div>
```

## 🔄 從 Next.js 到 Angular 的轉換要點

### 1. 狀態管理轉換
- **Next.js**: React Context + useState/useReducer
- **Angular**: RxJS BehaviorSubject + Observable

```typescript
// Next.js (React)
const [projects, setProjects] = useState<Project[]>([]);
const [loading, setLoading] = useState(false);

// Angular
private readonly _state = new BehaviorSubject<ProjectState>({
  projects: [],
  loading: false,
  error: null
});
readonly projects$ = this.state$.pipe(map(state => state.projects));
```

### 2. 數據獲取轉換
- **Next.js**: React Query + useEffect
- **Angular**: RxJS + Angular Services

```typescript
// Next.js
const { data: projects, isLoading } = useQuery(['projects'], fetchProjects);

// Angular
readonly projects$ = this.projectService.getAll();
readonly loading$ = this.projectStateService.loading$;
```

### 3. 組件生命週期轉換
- **Next.js**: useEffect + cleanup
- **Angular**: OnInit + OnDestroy + takeUntil

```typescript
// Next.js
useEffect(() => {
  const subscription = data$.subscribe();
  return () => subscription.unsubscribe();
}, []);

// Angular
ngOnInit(): void {
  this.data$.pipe(
    takeUntil(this.destroy$)
  ).subscribe();
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## 🚀 部署和配置

### 1. 安裝依賴

```bash
# 安裝 Angular 依賴
npm install @angular/core @angular/common @angular/forms @angular/router

# 安裝 Firebase 依賴
npm install @angular/fire firebase

# 安裝 RxJS (通常已包含在 Angular 中)
npm install rxjs
```

### 2. Firebase 配置

```typescript
// app.config.ts
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    // 其他提供者...
  ]
};
```

### 3. 環境配置

```typescript
// environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: 'your-api-key',
    authDomain: 'your-domain.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-bucket.appspot.com',
    messagingSenderId: 'your-sender-id',
    appId: 'your-app-id'
  }
};
```

## 📊 性能優化

### 1. OnPush 變更檢測

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class ProjectListComponent {
  // 使用 OnPush 策略提高性能
}
```

### 2. 虛擬滾動

```typescript
// 對於長列表，使用虛擬滾動
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport itemSize="100" class="viewport">
      <div *cdkVirtualFor="let project of projects$ | async">
        {{ project.title }}
      </div>
    </cdk-virtual-scroll-viewport>
  `
})
```

### 3. 懶加載

```typescript
// 路由懶加載
const routes: Routes = [
  {
    path: 'projects',
    loadComponent: () => import('./project-list.component').then(m => m.ProjectListComponent)
  }
];
```

## 🧪 測試

### 1. 單元測試

```typescript
// project.service.spec.ts
describe('ProjectService', () => {
  let service: ProjectService;
  let mockFirestore: jasmine.SpyObj<Firestore>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Firestore', ['collection']);
    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        { provide: Firestore, useValue: spy }
      ]
    });
    service = TestBed.inject(ProjectService);
    mockFirestore = TestBed.inject(Firestore) as jasmine.SpyObj<Firestore>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

### 2. 組件測試

```typescript
// project-list.component.spec.ts
describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let mockProjectStateService: jasmine.SpyObj<ProjectStateService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProjectStateService', ['loadProjects']);
    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [
        { provide: ProjectStateService, useValue: spy }
      ]
    }).compileComponents();

    component = TestBed.createComponent(ProjectListComponent).componentInstance;
    mockProjectStateService = TestBed.inject(ProjectStateService) as jasmine.SpyObj<ProjectStateService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## 🔒 安全性考慮

### 1. Firebase 安全規則

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 專案規則
    match /projects/{projectId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.members;
    }

    // 合約規則
    match /contracts/{contractId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.auth.uid == resource.data.createdBy;
    }
  }
}
```

### 2. 輸入驗證

```typescript
// 使用 Angular 的 Reactive Forms 進行驗證
export class ProjectFormComponent {
  projectForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    value: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(private fb: FormBuilder) {}
}
```

## 📈 監控和日誌

### 1. 錯誤處理

```typescript
// 全局錯誤處理
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    console.error('An error occurred:', error);
    // 發送到錯誤監控服務
    this.errorReportingService.reportError(error);
  }
}
```

### 2. 性能監控

```typescript
// 使用 Angular 的性能監控
import { ApplicationConfig } from '@angular/core';
import { providePerformance } from '@angular/fire/performance';

export const appConfig: ApplicationConfig = {
  providers: [
    providePerformance(),
    // 其他提供者...
  ]
};
```

## 🎉 總結

本轉換實現了從 Next.js 到 Angular 的完整功能遷移，包括：

✅ **完整的服務層架構**
✅ **響應式狀態管理**
✅ **類型安全的 TypeScript 實現**
✅ **Firebase 集成**
✅ **現代 Angular 最佳實踐**
✅ **完整的錯誤處理**
✅ **性能優化考慮**
✅ **測試準備**

所有功能都經過精心設計，確保在 Angular 環境中能夠正常工作，並遵循 Angular 的最佳實踐和設計模式。
