# NG-AC 極簡主義架構文檔

## 🎯 **設計原則**

### **極簡主義設計**
- ✅ 避免過度工程與不必要的依賴
- ✅ 樣式部分多利用 ng-zorro-antd，不自己造輪子
- ✅ 專注核心邏輯與清晰邊界
- ✅ 每次生成後即刻檢查邏輯正確性

### **DDD 架構清晰邊界**

```
src/app/
├── domain/              # 領域層 - 業務核心
│   ├── user/           # 用戶領域
│   └── errors/         # 領域錯誤
├── application/         # 應用層 - 用例協調
│   ├── auth/           # 認證用例
│   ├── startup/        # 啟動服務
│   └── user/           # 用戶用例
├── infrastructure/      # 基礎設施層 - 外部依賴
│   ├── auth/           # 認證基礎設施
│   └── user/           # 用戶基礎設施
└── presentation/        # 表現層 - UI 組件
    ├── dashboard/       # 儀表板
    └── passport/        # 認證頁面
```

## 🔧 **核心組件**

### **1. 啟動服務 (StartupApplicationService)**
- **位置**: `application/startup/startup.application.service.ts`
- **職責**: 應用初始化，設置基礎配置
- **設計**: 極簡設計，只做必要的事情

```typescript
load(): Observable<void> {
  // 設置應用基本信息
  this.settingService.setApp({
    name: 'NG-AC',
    description: 'Angular DDD project'
  });

  // 檢查認證狀態並設置相應配置
  const tokenData = this.tokenService.get();
  
  if (tokenData?.token) {
    this.setupAuthenticatedUser(tokenData);
  } else {
    this.setupUnauthenticatedUser();
  }

  return of(void 0);
}
```

### **2. 認證用例 (Auth Use Cases)**
- **位置**: `application/auth/`
- **職責**: 封裝認證業務邏輯
- **設計**: 單一職責，清晰邊界

```typescript
// LoginUseCase - 只負責登錄邏輯
execute(request: LoginRequest): Observable<ITokenModel> {
  return this.authService.login(request);
}
```

### **3. Firebase 認證服務**
- **位置**: `infrastructure/auth/firebase-auth.service.ts`
- **職責**: 處理 Firebase 認證細節
- **設計**: 簡化接口，隱藏複雜性

```typescript
login(credentials: LoginRequest): Observable<ITokenModel> {
  return from(signInWithEmailAndPassword(this.auth, credentials.email, credentials.password))
    .pipe(
      switchMap((userCredential) => from(userCredential.user.getIdToken())),
      map(token => {
        const tokenModel: ITokenModel = { token, uid: this.auth.currentUser?.uid };
        this.tokenService.set(tokenModel);
        return tokenModel;
      })
    );
}
```

## 🎨 **UI 組件設計**

### **極簡主義 UI 原則**
- ✅ 使用 ng-zorro-antd 組件，不重複造輪子
- ✅ 組件職責單一，邏輯清晰
- ✅ 樣式簡潔，專注功能

### **登錄表單組件**
```typescript
// 簡化的表單邏輯
submit(): void {
  this.error = '';
  this.userName.markAsDirty();
  this.password.markAsDirty();
  
  if (this.userName.invalid || this.password.invalid) {
    return;
  }

  this.loading = true;
  const { userName, password } = this.form.value;
  
  this.loginUseCase.execute({ email: userName, password })
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: () => {
        this.message.success('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.message || 'Login failed';
        this.message.error(this.error);
      }
    });
}
```

## 🚀 **技術棧**

### **核心技術**
- **框架**: Angular 19
- **UI 庫**: ng-zorro-antd
- **認證**: Firebase Auth
- **架構**: Domain-Driven Design (DDD)

### **開發工具**
- **MCP 服務**: 自動化代碼生成
- **Context7**: 實時查閱官方文件
- **TypeScript**: 類型安全

## 📋 **開發流程**

### **1. 代碼生成**
- 使用 MCP 服務自動化生成
- 遵循 DDD 架構原則
- 保持代碼一致性

### **2. 邏輯檢查**
- 每次生成後即刻檢查邏輯正確性
- 確保代碼符合預期流程與業務規則
- 避免錯誤累積

### **3. 架構驗證**
- 確保模組邊界清晰
- 驗證依賴關係正確
- 檢查是否符合極簡主義原則

## 🎯 **目標**

### **短期目標**
- ✅ 建立清晰的 DDD 架構基礎
- ✅ 實現極簡主義設計
- ✅ 確保架構穩定、模組邊界明確

### **長期目標**
- 🔄 為後續維護與擴充提供良好基礎
- 🔄 支持高效開發流程
- 🔄 保持代碼質量與一致性

## 🔍 **質量保證**

### **代碼質量**
- ✅ TypeScript 嚴格模式
- ✅ ESLint 代碼規範
- ✅ 單元測試覆蓋

### **架構質量**
- ✅ DDD 原則遵循
- ✅ 依賴注入正確使用
- ✅ 模組邊界清晰

### **性能優化**
- ✅ 懶加載路由
- ✅ 組件按需加載
- ✅ 最小化打包體積

---

**版本**: 2.0.0  
**更新日期**: 2024年12月  
**維護者**: NG-AC Team 