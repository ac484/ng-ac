<!------------------------------------------------------------------------------------

# 🧩 功能開發指南 (Feature Development Guidelines)

## 📘 文件目的

本文件統一專案中新增功能模組的開發方式，採用 DDD (Domain-Driven Design) 與極簡主義設計原則，確保整體架構可維護、可擴充、易於協作與測試。

## 🔗 相關文檔

請先閱讀以下相關文檔：
- [DDD 開發規範與標準](./DDD_DEVELOPMENT_STANDARDS.md) - 完整的開發規範
- [極簡主義設計原則](./MINIMALIST_DESIGN_PRINCIPLES.md) - 設計理念和最佳實踐
- [架構決策記錄](./ARCHITECTURE_DECISIONS.md) - 重要架構決策的背景和理由

---

## 📁 功能模組目錄結構規範

每個新功能皆應以獨立模組存在於 `src/app/domain/<feature>/` 下，包含以下四層：

```
domain/
application/
infrastructure/
presentation/
```

---

## 📐 各層說明與檔案範本

### 1. `domain/` – 領域層

- **entities/**：定義核心業務實體（Entity），含行為與驗證邏輯。
- **value-objects/**：值物件，無標識、不可變，封裝領域概念。
- **repositories/**：定義儲存抽象層的介面。
- **services/**：純領域服務，封裝非實體專屬業務邏輯。
- **events/**：定義領域事件，供外部訂閱或觸發。
- **specifications/**：封裝邏輯條件規則。
- **exceptions/**：領域錯誤類型定義。

✅ 範例：
```ts
// domain/entities/contract.entity.ts
export class ContractEntity {
  ...
}
```

---

### 2. `application/` – 應用層

- **use-cases/**：應用邏輯，單一責任，如 `create-contract.use-case.ts`。
- **dto/**
  - **commands/**：輸入資料結構，用於命令操作。
  - **queries/**：查詢輸入結構。
  - **responses/**：回傳資料格式。
- **services/**：封裝 use case 呼叫邏輯（Facade Pattern）。

✅ 範例：
```ts
// application/use-cases/create-contract.use-case.ts
export class CreateContractUseCase {
  ...
}
```

---

### 3. `infrastructure/` – 基礎建設層

- **repositories/**：實作 domain 層的 repository interface。
- **mappers/**：資料轉換（Entity ↔️ Persistence）。
- **adapters/**：對接第三方服務（如 Email、API、Storage）。

✅ 範例：
```ts
// infrastructure/repositories/contract-firebase.repository.ts
export class ContractFirebaseRepository implements ContractRepository { ... }
```

---

### 4. `presentation/` – 表現層（前端）

- **components/**：重複使用的 UI 元件。
- **pages/**：路由頁面，組合多個 component。
- **guards/**：路由守衛。
- **resolvers/**：路由解析資料。
- **<feature>.routes.ts**：該模組的路由設定。

✅ 範例：
```ts
// presentation/pages/contract-edit/contract-edit.component.ts
```

---

## 📌 命名規範

| 類型              | 命名格式                   | 範例                              |
|-------------------|----------------------------|-----------------------------------|
| 實體 Entity       | `<name>.entity.ts`         | `user.entity.ts`                  |
| 值物件 ValueObject| `<name>.vo.ts`             | `email.vo.ts`                     |
| UseCase           | `<action>.use-case.ts`     | `create-user.use-case.ts`         |
| 命令 DTO          | `<action>.command.ts`      | `login.command.ts`                |
| 查詢 DTO          | `<action>.query.ts`        | `get-user-by-id.query.ts`         |
| 回應 DTO          | `<name>.response.ts`       | `user.response.ts`                |
| Repository介面    | `<entity>.repository.ts`   | `user.repository.ts`              |
| Repository實作    | `<impl>.repository.ts`     | `user-firebase.repository.ts`     |
| 頁面              | `<page>/`                  | `user-profile/`, `contract-edit/` |
| 元件              | `<component>/`             | `user-form/`, `widget-grid/`      |

---

## 🔁 與 shared/ 的關係

`shared/` 提供跨模組共用的程式碼：

- `shared/domain/`：共用 base 類別、spec、event 等。
- `shared/application/`：共用 bus、UoW、interface 等。
- `shared/infrastructure/`：共用攔截器、firebase 設定、auth。
- `shared/presentation/`：共用 UI layout, dialog, pipe。

請勿於 feature 模組中重複定義 shared 中已有邏輯。

---

## 🧪 測試建議

- 每個 `entity`, `use-case`, `repository` 應對應 `.spec.ts` 測試檔。
- 建議使用 mock repository 測試 use case。
- 請將測試檔置於對應位置旁。

---

## 🔄 新功能開發流程

1. **建立模組目錄**：於 `src/app/domain/` 下建立新目錄
2. **依照結構建立四層資料夾**
3. **撰寫 Entity / VO / UseCase / Route / Component**
4. **註冊路由與 module**
5. **整合 Shared 資源**
6. **撰寫測試與文件**

---

## ✅ 範例：`contract` 模組新增流程

```bash
mkdir -p src/app/domain/contract/{domain,application,infrastructure,presentation}
```

接著建立：

- `domain/entities/contract.entity.ts`
- `domain/value-objects/contract-id.vo.ts`
- `application/use-cases/create-contract.use-case.ts`
- `application/dto/commands/create-contract.command.ts`
- `infrastructure/repositories/contract-firebase.repository.ts`
- `presentation/pages/contract-edit/contract-edit.component.ts`
- `presentation/contract.routes.ts`
- 測試檔與 spec.ts

---

## 📎 附錄

## 🎯 極簡主義原則提醒

在開發新功能時，請始終遵循以下極簡主義原則：

### ✅ 必須做的
- 優先使用 ng-zorro-antd 組件，避免重複造輪子
- 每個類別和方法都有單一、明確的職責
- 使用 Standalone Components 和 OnPush 變更檢測
- 每次生成代碼後立即檢查邏輯正確性
- 遵循 DDD 分層原則和依賴方向

### ❌ 避免做的
- 不要為了設計而設計，避免過度抽象
- 不要自製已有的 UI 組件
- 不要在單一類別中混合多種職責
- 不要忽略 TypeScript 類型安全
- 不要違反 DDD 層級依賴規則

## 📚 延伸閱讀

- [共享層架構說明](../src/app/shared/README.md)
- [Angular 官方文檔](https://angular.dev)
- [ng-zorro-antd 組件庫](https://ng.ant.design)

-------------------------------------------------------------------------------------> 