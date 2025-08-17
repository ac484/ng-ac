# 🚨 故障排除指南

## 📋 概述

本文檔提供了 ng-ac 企業級管理系統的故障排除指南，包含常見問題、解決方案、調試技巧和預防措施。

## 🔍 常見問題分類

### 1. 構建問題
- 編譯錯誤
- 依賴問題
- 配置錯誤
- 內存不足

### 2. 運行時問題
- 頁面加載失敗
- 路由問題
- API 調用失敗
- 性能問題

### 3. 部署問題
- 環境配置錯誤
- 權限問題
- 網絡問題
- 服務啟動失敗

## 🛠️ 構建問題解決

### 1. 編譯錯誤

#### 問題描述
```bash
Error: src/app/interface/users/users.component.ts:25:15
TS2322: Type 'string' is not assignable to type 'UserRole'.
```

#### 解決方案
```typescript
// ❌ 錯誤寫法
const role: UserRole = 'ADMIN'; // 字符串不能直接賦值給枚舉

// ✅ 正確寫法
const role: UserRole = UserRole.ADMIN; // 使用枚舉值
```

#### 預防措施
- 啟用嚴格模式 TypeScript 配置
- 使用 ESLint 規則檢查類型錯誤
- 定期運行 `ng build` 檢查編譯狀態

### 2. 依賴問題

#### 問題描述
```bash
Error: Cannot find module '@angular/material'
Error: Version mismatch between @angular/core and @angular/material
```

#### 解決方案
```bash
# 清理依賴
rm -rf node_modules
rm -rf package-lock.json
rm -rf pnpm-lock.yaml

# 重新安裝依賴
pnpm install

# 檢查版本兼容性
pnpm list @angular/core @angular/material
```

#### 預防措施
- 使用 `pnpm` 作為包管理器
- 定期更新依賴版本
- 檢查 Angular 版本兼容性矩陣

### 3. 內存不足

#### 問題描述
```bash
FATAL ERROR: Ineffective mark-compact near heap limit Allocation failed
```

#### 解決方案
```bash
# 增加 Node.js 內存限制
export NODE_OPTIONS="--max-old-space-size=8192"

# 或在 package.json 中配置
{
  "scripts": {
    "build": "node --max-old-space-size=8192 ./node_modules/@angular/cli/bin/ng build"
  }
}
```

#### 預防措施
- 監控系統內存使用情況
- 優化構建配置
- 使用增量構建

## 🚀 運行時問題解決

### 1. 頁面加載失敗

#### 問題描述
```bash
Error: Cannot read property 'subscribe' of undefined
Error: Cannot read property 'length' of undefined
```

#### 解決方案
```typescript
// ❌ 錯誤寫法
this.userService.users$.subscribe(users => {
  this.users = users; // users 可能為 undefined
});

// ✅ 正確寫法
this.userService.users$.pipe(
  filter(users => users !== null && users !== undefined),
  takeUntil(this.destroy$)
).subscribe(users => {
  this.users = users;
});

// 或使用安全導航操作符
this.users = this.userService.users$ ?? [];
```

#### 預防措施
- 使用 TypeScript 嚴格模式
- 添加空值檢查
- 使用 RxJS 操作符處理空值

### 2. 路由問題

#### 問題描述
```bash
Error: Cannot match any routes. URL Segment: 'users'
Error: No component factory found for UsersComponent
```

#### 解決方案
```typescript
// 檢查路由配置
const routes: Routes = [
  {
    path: 'users',
    component: UsersComponent, // 確保組件已導入
    canActivate: [AuthGuard]
  }
];

// 檢查組件導入
@Component({
  selector: 'app-users',
  standalone: true, // 確保是獨立組件
  imports: [CommonModule, MatTableModule]
})
export class UsersComponent {
  // 組件實現
}
```

#### 預防措施
- 檢查路由配置語法
- 確保組件已正確導入
- 使用路由守衛保護路由

### 3. API 調用失敗

#### 問題描述
```bash
Error: Http failure response for /api/users: 404 Not Found
Error: Http failure response for /api/users: 401 Unauthorized
```

#### 解決方案
```typescript
// 添加錯誤處理
this.userService.loadUsers().pipe(
  catchError((error: HttpErrorResponse) => {
    if (error.status === 401) {
      // 處理未授權錯誤
      this.router.navigate(['/login']);
      return EMPTY;
    } else if (error.status === 404) {
      // 處理資源不存在錯誤
      this.snackBar.open('用戶列表不存在', '關閉');
      return EMPTY;
    } else {
      // 處理其他錯誤
      this.snackBar.open('加載用戶失敗', '關閉');
      return EMPTY;
    }
  })
).subscribe(users => {
  this.users = users;
});
```

#### 預防措施
- 實現全局錯誤處理
- 添加重試機制
- 使用攔截器統一處理錯誤

## 🐳 部署問題解決

### 1. 環境配置錯誤

#### 問題描述
```bash
Error: Cannot find environment file
Error: API_BASE_URL is not defined
```

#### 解決方案
```typescript
// 檢查環境文件配置
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  enableDebug: true
};

// angular.json 配置
{
  "projects": {
    "ng-ac": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

#### 預防措施
- 檢查環境文件路徑
- 驗證環境變量配置
- 使用環境檢查工具

### 2. 權限問題

#### 問題描述
```bash
Error: EACCES: permission denied
Error: Cannot write to directory
```

#### 解決方案
```bash
# 檢查文件權限
ls -la dist/
chmod -R 755 dist/

# 檢查用戶權限
whoami
sudo chown -R $USER:$USER dist/

# 檢查目錄權限
sudo chmod 755 /var/www/html
```

#### 預防措施
- 使用正確的用戶權限
- 檢查目錄權限設置
- 使用 Docker 容器化部署

### 3. 服務啟動失敗

#### 問題描述
```bash
Error: listen EADDRINUSE: address already in use :::80
Error: Failed to start nginx
```

#### 解決方案
```bash
# 檢查端口占用
netstat -tulpn | grep :80
lsof -i :80

# 停止占用端口的服務
sudo systemctl stop nginx
sudo systemctl stop apache2

# 或更改端口配置
# nginx.conf
server {
    listen 8080; # 更改端口
    server_name example.com;
}
```

#### 預防措施
- 檢查端口占用情況
- 使用不同的端口配置
- 實現服務健康檢查

## 🔧 調試技巧

### 1. 瀏覽器開發者工具

#### Console 調試
```typescript
// 添加調試日誌
console.log('User data:', users);
console.table(users); // 表格形式顯示數組
console.group('User Management'); // 分組顯示
console.log('Loading users...');
console.groupEnd();

// 條件調試
if (environment.enableDebug) {
  console.log('Debug info:', debugData);
}
```

#### Network 調試
- 檢查 API 請求狀態
- 查看請求/響應頭
- 分析請求時間
- 檢查錯誤響應

#### Performance 調試
- 使用 Performance 面板分析性能
- 檢查內存使用情況
- 分析渲染性能
- 識別性能瓶頸

### 2. Angular 調試工具

#### Angular DevTools
```bash
# 安裝 Angular DevTools 擴展
# Chrome: Angular DevTools
# Firefox: Angular DevTools
```

#### 使用方式
- 檢查組件狀態
- 查看依賴注入
- 分析變更檢測
- 調試路由狀態

### 3. 代碼調試

#### 斷點調試
```typescript
// 在關鍵位置添加斷點
debugger;

// 或使用條件斷點
if (users.length === 0) {
  debugger; // 只在用戶列表為空時斷點
}
```

#### 日誌調試
```typescript
// 創建調試服務
@Injectable({
  providedIn: 'root'
})
export class DebugService {
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    if (environment.enableDebug) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data);
    }
  }
}
```

## 📊 性能問題診斷

### 1. 內存洩漏

#### 問題症狀
- 頁面切換後內存不釋放
- 長時間使用後性能下降
- 瀏覽器卡頓

#### 解決方案
```typescript
// 正確的訂閱管理
export class UserComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.userService.users$
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.users = users;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### 預防措施
- 使用 `takeUntil` 操作符
- 實現 `OnDestroy` 接口
- 定期檢查內存使用情況

### 2. 變更檢測問題

#### 問題症狀
- 數據更新後 UI 不刷新
- 性能下降
- 不必要的變更檢測

#### 解決方案
```typescript
// 使用 OnPush 變更檢測策略
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class UserComponent {
  // 使用信號進行狀態管理
  readonly users = signal<User[]>([]);

  updateUsers(newUsers: User[]): void {
    this.users.set(newUsers);
  }
}
```

#### 預防措施
- 使用 OnPush 策略
- 避免在模板中調用方法
- 使用純管道

### 3. 大數據渲染問題

#### 問題症狀
- 大量數據渲染卡頓
- 滾動性能差
- 內存使用過高

#### 解決方案
```typescript
// 使用虛擬滾動
@Component({
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="virtual-scroll-viewport">
      <div *cdkVirtualFor="let user of users">
        {{ user.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  `
})
export class UserListComponent {
  users = Array.from({length: 10000}, (_, i) => ({
    id: i,
    name: `User ${i}`
  }));
}
```

#### 預防措施
- 實現分頁加載
- 使用虛擬滾動
- 優化數據結構

## 🚨 錯誤監控與警報

### 1. 全局錯誤處理

#### 實現方式
```typescript
// 全局錯誤處理服務
@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  handleError(error: Error): void {
    console.error('Global error:', error);

    // 發送錯誤到監控服務
    this.sendErrorToMonitoring(error);

    // 顯示用戶友好的錯誤消息
    this.showUserFriendlyError(error);

    // 記錄錯誤日誌
    this.logError(error);
  }

  private sendErrorToMonitoring(error: Error): void {
    // 實現錯誤發送邏輯
  }

  private showUserFriendlyError(error: Error): void {
    this.snackBar.open('發生未知錯誤，請稍後重試', '關閉', {
      duration: 5000
    });
  }

  private logError(error: Error): void {
    // 實現錯誤日誌記錄
  }
}
```

#### 配置方式
```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideErrorHandler } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideErrorHandler(GlobalErrorHandler)
  ]
};
```

### 2. 性能監控

#### 實現方式
```typescript
// 性能監控服務
@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitoringService {
  constructor() {
    this.setupPerformanceMonitoring();
  }

  private setupPerformanceMonitoring(): void {
    // 監控頁面加載性能
    this.observePageLoadMetrics();

    // 監控用戶交互性能
    this.observeUserInteractionMetrics();

    // 監控資源加載性能
    this.observeResourceMetrics();
  }

  private observePageLoadMetrics(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      const metrics = {
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnection: navigation.connectEnd - navigation.connectStart,
        serverResponse: navigation.responseEnd - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        pageLoad: navigation.loadEventEnd - navigation.loadEventStart
      };

      this.sendMetrics('page_load', metrics);
    });
  }

  private sendMetrics(type: string, data: any): void {
    // 發送性能指標到監控服務
    console.log(`Performance Metric - ${type}:`, data);
  }
}
```

## 📋 故障排除檢查清單

### 構建階段檢查
- [ ] 依賴版本兼容性
- [ ] TypeScript 配置正確性
- [ ] 環境變量配置
- [ ] 構建腳本正確性

### 運行時檢查
- [ ] 組件初始化狀態
- [ ] 服務依賴注入
- [ ] 路由配置正確性
- [ ] API 接口可用性

### 部署階段檢查
- [ ] 環境配置正確性
- [ ] 文件權限設置
- [ ] 服務啟動狀態
- [ ] 網絡連接正常

### 性能檢查
- [ ] 內存使用情況
- [ ] 變更檢測頻率
- [ ] API 響應時間
- [ ] 資源加載時間

## 🔮 預防措施

### 1. 代碼質量保證
- 使用 ESLint 和 Prettier
- 實施代碼審查流程
- 編寫單元測試
- 使用 TypeScript 嚴格模式

### 2. 監控與警報
- 實現錯誤追蹤
- 設置性能監控
- 配置自動警報
- 定期健康檢查

### 3. 文檔與培訓
- 維護詳細的技術文檔
- 提供開發者培訓
- 建立知識庫
- 定期更新最佳實踐

---

**文檔版本**: 1.0.0
**最後更新**: 2024年8月
**維護者**: AI Assistant


