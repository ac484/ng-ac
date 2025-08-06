# 📚 NG-AC 開發文檔

## 🎯 概述

歡迎來到 NG-AC 專案的開發文檔中心。本專案採用 Domain-Driven Design (DDD) 架構和極簡主義設計原則，致力於建立一個清晰、高效、可維護的企業級 Angular 應用。

---

## 📖 核心文檔

### 🏗️ 架構與設計

| 文檔 | 描述 | 適用對象 |
|------|------|----------|
| [DDD 開發規範與標準](./DDD_DEVELOPMENT_STANDARDS.md) | 完整的 DDD 架構規範、極簡主義設計原則和開發標準 | 所有開發者 |
| [極簡主義設計原則](./MINIMALIST_DESIGN_PRINCIPLES.md) | 詳細的極簡主義設計指南和最佳實踐範例 | 所有開發者 |
| [架構決策記錄](./ARCHITECTURE_DECISIONS.md) | 重要架構決策的背景、理由和影響 | 架構師、技術負責人 |

### 🛠️ 開發指南

| 文檔 | 描述 | 適用對象 |
|------|------|----------|
| [功能開發指南](./FEATURE_DEVELOPMENT_GUIDELINES.md) | 新功能模組的開發流程和規範 | 功能開發者 |
| [共享層架構說明](../src/app/shared/README.md) | 共享層的組織結構和使用方式 | 所有開發者 |

---

## 🎯 設計原則

### 極簡主義設計 (Minimalist Design)

我們的核心設計理念是**極簡主義**，具體體現在：

#### ✅ 核心原則
- **避免過度工程** - 不為設計而設計，專注解決實際問題
- **避免不必要的依賴** - 只引入真正需要的套件和抽象
- **樣式優先使用 ng-zorro-antd** - 充分利用現有組件庫，不重複造輪子
- **專注核心邏輯** - 將精力投入在業務邏輯而非技術炫技
- **清晰邊界** - 每個模組、類別、方法都有明確的職責

#### 🔍 即時檢查
- **每次生成後立即檢查** - 確保代碼符合預期流程與業務規則
- **避免錯誤累積** - 發現問題立即修正，不要拖延
- **業務規則驗證** - 確保實現符合領域專家的期望
- **架構一致性檢查** - 驗證是否遵循 DDD 分層原則

---

## 🏛️ DDD 架構概覽

### 四層架構

```
┌─────────────────┐
│   Presentation  │ ← UI 組件、頁面、路由
├─────────────────┤
│ Infrastructure  │ ← 外部服務、資料庫、API
├─────────────────┤
│   Application   │ ← 用例、DTO、應用服務
├─────────────────┤
│     Domain      │ ← 實體、值物件、領域服務
└─────────────────┘
```

**依賴規則**: Domain ← Application ← Infrastructure ← Presentation

### 目錄結構

```
src/app/
├── shared/                    # 跨領域共享
│   ├── domain/               # 共享領域原語
│   ├── application/          # 共享應用服務
│   ├── infrastructure/       # 共享基礎設施
│   └── presentation/         # 共享 UI 組件
├── domain/                   # 業務領域
│   ├── user/                # 用戶領域
│   ├── auth/                # 認證領域
│   ├── dashboard/           # 儀表板領域
│   └── [feature]/           # 其他業務領域
├── app.component.ts
├── app.config.ts
└── main.ts
```

---

## 🚀 快速開始

### 新開發者入門

1. **閱讀核心文檔**
   - 先閱讀 [DDD 開發規範與標準](./DDD_DEVELOPMENT_STANDARDS.md)
   - 理解 [極簡主義設計原則](./MINIMALIST_DESIGN_PRINCIPLES.md)
   - 了解 [架構決策記錄](./ARCHITECTURE_DECISIONS.md)

2. **熟悉專案結構**
   - 查看 [共享層架構說明](../src/app/shared/README.md)
   - 了解現有領域模組的組織方式

3. **開發第一個功能**
   - 按照 [功能開發指南](./FEATURE_DEVELOPMENT_GUIDELINES.md) 進行
   - 遵循極簡主義原則
   - 使用 ng-zorro-antd 組件

### 開發檢查清單

每次開發新功能時，請檢查：

#### 🏗️ 架構檢查
- [ ] 是否遵循 DDD 分層原則
- [ ] 依賴方向是否正確 (Domain ← Application ← Infrastructure ← Presentation)
- [ ] 是否有循環依賴

#### 🎯 極簡主義檢查
- [ ] 是否避免了過度工程
- [ ] 是否重複使用了 ng-zorro-antd 組件
- [ ] 是否有不必要的抽象
- [ ] 每個類別是否職責單一

#### 💻 代碼品質檢查
- [ ] TypeScript 類型是否完整
- [ ] 是否使用 OnPush 變更檢測
- [ ] 是否使用 Standalone Components
- [ ] 錯誤處理是否充分
- [ ] 是否有適當的測試覆蓋

#### 📋 業務邏輯檢查
- [ ] 業務規則是否正確實現
- [ ] 領域事件是否適當發布
- [ ] 異常處理是否符合業務需求
- [ ] 是否符合用戶需求

---

## 🛠️ 技術棧

### 核心技術
- **框架**: Angular 19
- **語言**: TypeScript (嚴格模式)
- **UI 庫**: ng-zorro-antd
- **後端**: Firebase (Auth, Firestore)
- **架構**: Domain-Driven Design (DDD)

### 開發工具
- **MCP 服務**: 自動化代碼生成
- **Context7**: 實時查閱官方文件
- **ESLint**: 代碼規範檢查
- **Prettier**: 代碼格式化
- **Jest**: 單元測試

---

## 📋 開發流程

### 1. 需求分析
- 理解業務需求
- 識別領域邊界
- 設計領域模型

### 2. 架構設計
- 確定層級職責
- 設計接口和依賴
- 遵循極簡主義原則

### 3. 實現開發
- 按照 DDD 分層實現
- 使用 ng-zorro-antd 組件
- 遵循命名規範

### 4. 測試驗證
- 編寫單元測試
- 進行集成測試
- 驗證業務邏輯

### 5. 代碼審查
- 檢查架構一致性
- 驗證極簡主義原則
- 確保代碼品質

---

## 🎨 UI/UX 指南

### ng-zorro-antd 使用原則

#### ✅ 推薦做法
```typescript
// 使用現有組件
@Component({
  template: `
    <nz-table [nzData]="users">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of users">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </tbody>
    </nz-table>
  `,
  imports: [NzTableModule]
})
export class UserListComponent {}
```

#### ❌ 避免做法
```typescript
// 不要重複造輪子
@Component({
  template: `
    <div class="custom-table">
      <!-- 大量自定義 HTML 和 CSS -->
    </div>
  `,
  styles: [`
    /* 數百行自定義樣式 */
  `]
})
export class CustomTableComponent {} // ❌ 不必要
```

### 響應式設計
- 採用 Mobile-First 策略
- 使用 ng-zorro-antd 的響應式工具
- 確保在各種設備上的良好體驗

---

## 🧪 測試策略

### 測試金字塔
```
    E2E Tests
   ──────────
  Integration Tests
 ────────────────────
Unit Tests (Domain & Application)
```

### 測試重點
1. **Domain Layer** - 業務邏輯和規則
2. **Application Layer** - 用例協調
3. **Infrastructure Layer** - 外部集成
4. **Presentation Layer** - 用戶交互

---

## 📈 性能優化

### 關鍵指標
- **Core Web Vitals** - LCP, FID, CLS
- **Bundle Size** - 控制打包體積
- **Runtime Performance** - 內存和 CPU 使用

### 優化策略
- 使用 OnPush 變更檢測
- 實施懶加載
- 優化 Bundle 分割
- 使用 Virtual Scrolling

---

## 🔐 安全考慮

### 多層安全策略
1. **認證層** - Firebase Auth
2. **授權層** - 基於角色的訪問控制
3. **數據層** - Firestore 安全規則
4. **傳輸層** - HTTPS 和安全標頭
5. **客戶端層** - 輸入驗證和 XSS 防護

---

## 🤝 貢獻指南

### 提交代碼前
1. 閱讀相關文檔
2. 遵循開發規範
3. 編寫測試
4. 通過代碼審查

### 代碼審查重點
- 架構一致性
- 極簡主義原則
- 代碼品質
- 業務邏輯正確性

---

## 📞 支援與協助

### 文檔問題
如果發現文檔有誤或需要補充，請：
1. 創建 Issue 描述問題
2. 提供改進建議
3. 提交 Pull Request

### 技術問題
遇到技術問題時：
1. 先查閱相關文檔
2. 搜索已有的 Issue
3. 向團隊成員求助
4. 記錄解決方案

---

## 📅 文檔維護

### 更新頻率
- **核心文檔**: 隨架構變更及時更新
- **開發指南**: 每月檢查和更新
- **最佳實踐**: 根據實際經驗持續改進

### 版本控制
- 重要變更記錄版本號
- 保持向後兼容性
- 提供遷移指南

---

**版本**: 1.0.0  
**最後更新**: 2024年12月  
**維護者**: NG-AC Development Team

---

> 💡 **提示**: 這些文檔是活的文檔，會隨著專案的發展而持續更新。建議定期回顧以獲取最新的開發規範和最佳實踐。