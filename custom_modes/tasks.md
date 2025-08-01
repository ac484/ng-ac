# Firebase Auth 與 ng-alain/delon 認證系統整合任務

## 任務概述
整合 Firebase Auth 與 ng-alain/delon 的認證系統，確保無重複代碼，保持 ng-alain 的原有認證流程，並支援完整的 token 管理機制。

## 核心目標
- Firebase Auth 作為底層認證提供者
- 支援 Alain 的 interceptor 和 guard 系統
- 自動處理 Firebase ID Token
- 支援 token 刷新機制
- 統一的認證狀態管理

## 任務分解

### 階段 1: 分析現有認證系統
**狀態**: 🔄 進行中
**優先級**: 高
**預計時間**: 2-3 小時

#### 1.1 分析當前認證架構
- [ ] 分析 `DA_SERVICE_TOKEN` 的使用方式
- [ ] 檢查 `authSimpleInterceptor` 的實現
- [ ] 分析 `refresh-token.ts` 的 token 刷新邏輯
- [ ] 檢查 `login.component.ts` 的認證流程
- [ ] 分析 `default.interceptor.ts` 的 HTTP 攔截邏輯

#### 1.2 識別整合點
- [ ] 識別 Firebase Auth 與 Alain Token Service 的整合點
- [ ] 分析現有的 token 存儲機制
- [ ] 檢查認證狀態同步需求
- [ ] 識別需要修改的組件和服務

### 階段 2: 建立 Firebase Auth 服務
**狀態**: ⏳ 待開始
**優先級**: 高
**預計時間**: 4-5 小時

#### 2.1 建立 Firebase Auth 適配器
```typescript
// src/app/core/auth/firebase-auth.service.ts
@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  // Firebase Auth 狀態管理
  // ID Token 獲取和刷新
  // 用戶狀態同步
}
```

#### 2.2 實現認證狀態監聽
- [ ] 監聽 Firebase Auth 狀態變化
- [ ] 自動同步到 Alain Token Service
- [ ] 處理認證狀態變化事件

#### 2.3 實現 ID Token 管理
- [ ] 獲取 Firebase ID Token
- [ ] 自動刷新過期 token
- [ ] 處理 token 錯誤情況

### 階段 3: 整合 Alain Token Service
**狀態**: ⏳ 待開始
**優先級**: 高
**預計時間**: 3-4 小時

#### 3.1 建立 Token 適配器
```typescript
// src/app/core/auth/firebase-token-adapter.service.ts
@Injectable({ providedIn: 'root' })
export class FirebaseTokenAdapterService {
  // 將 Firebase ID Token 轉換為 Alain Token 格式
  // 處理 token 存儲和檢索
  // 管理 token 過期時間
}
```

#### 3.2 修改 Alain Token Service 配置
- [ ] 配置自定義 token 提供者
- [ ] 整合 Firebase token 刷新機制
- [ ] 保持與現有 interceptor 的兼容性

#### 3.3 實現統一的認證狀態管理
- [ ] 同步 Firebase 用戶狀態到 Alain
- [ ] 處理用戶登出邏輯
- [ ] 管理認證狀態持久化

### 階段 4: 更新認證組件
**狀態**: ⏳ 待開始
**優先級**: 中
**預計時間**: 3-4 小時

#### 4.1 更新登錄組件
```typescript
// src/app/routes/passport/login/login.component.ts
// 整合 Firebase Auth 登錄
// 保持現有的 UI 和驗證邏輯
// 支援多種登錄方式
```

#### 4.2 實現 Firebase 登錄方法
- [ ] 電子郵件/密碼登錄
- [ ] Google 登錄整合
- [ ] 其他社交登錄選項
- [ ] 錯誤處理和用戶反饋

#### 4.3 更新註冊組件
- [ ] Firebase 用戶註冊
- [ ] 電子郵件驗證
- [ ] 密碼重置功能

### 階段 5: 更新 HTTP 攔截器
**狀態**: ⏳ 待開始
**優先級**: 高
**預計時間**: 2-3 小時

#### 5.1 修改 default.interceptor.ts
```typescript
// src/app/core/net/default.interceptor.ts
// 整合 Firebase ID Token 到請求頭
// 處理 token 刷新邏輯
// 保持與現有錯誤處理的兼容性
```

#### 5.2 實現 Firebase Token 攔截器
- [ ] 自動添加 Firebase ID Token 到請求頭
- [ ] 處理 token 過期情況
- [ ] 整合現有的錯誤處理邏輯

#### 5.3 更新 token 刷新機制
- [ ] 使用 Firebase token 刷新
- [ ] 保持與 Alain refresh 機制的兼容性
- [ ] 處理刷新失敗的情況

### 階段 6: 更新路由守衛
**狀態**: ⏳ 待開始
**優先級**: 中
**預計時間**: 2-3 小時

#### 6.1 檢查現有守衛
- [ ] 分析 `authSimpleCanActivate` 的使用
- [ ] 檢查 `startPageGuard` 的實現
- [ ] 確保與 Firebase Auth 的兼容性

#### 6.2 更新認證守衛
- [ ] 整合 Firebase Auth 狀態檢查
- [ ] 保持現有的路由保護邏輯
- [ ] 處理認證失敗的重定向

### 階段 7: 配置和測試
**狀態**: ⏳ 待開始
**優先級**: 高
**預計時間**: 3-4 小時

#### 7.1 更新應用配置
```typescript
// src/app/app.config.ts
// 配置 Firebase Auth 提供者
// 整合自定義認證服務
// 保持現有配置的兼容性
```

#### 7.2 環境配置
- [ ] 更新開發環境配置
- [ ] 更新生產環境配置
- [ ] 配置 Firebase 項目設置

#### 7.3 測試認證流程
- [ ] 測試登錄流程
- [ ] 測試 token 刷新
- [ ] 測試登出流程
- [ ] 測試路由保護
- [ ] 測試錯誤處理

### 階段 8: 文檔和清理
**狀態**: ⏳ 待開始
**優先級**: 低
**預計時間**: 1-2 小時

#### 8.1 更新文檔
- [ ] 更新認證系統文檔
- [ ] 記錄整合架構
- [ ] 提供使用指南

#### 8.2 代碼清理
- [ ] 移除重複代碼
- [ ] 優化性能
- [ ] 確保代碼質量

## 技術架構

### 整合架構圖 