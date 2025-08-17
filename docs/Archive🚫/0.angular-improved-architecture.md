# 分層架構設計文檔


## 架構概述

本架構採用六層設計模式，基於領域驅動設計(DDD)和清潔架構原則，確保高內聚、低耦合的系統設計。

### 架構層級

### 第一層：核心架構層（6層）
1. **領域層** (Domain Layer) - 核心業務邏輯
2. **應用層** (Application Layer) - 用例編排
3. **基礎設施層** (Infrastructure Layer) - 技術實現
4. **接口層** (Interface Layer) - 用戶交互
5. **安全層** (Security Layer) - 安全管理
6. **共享層** (Shared Layer) - 通用資源

### 聚合匯出層（2層）
7. **Core Layer** (核心層) - 服務聚合匯出
8. **Modules Layer** (模組層) - 功能模組聚合匯出

### 第二層：功能模組層
- 每個主要層下面都有多個功能模組，例如：
```
src/app/domain/
├── entities/           # 實體
├── value-objects/      # 值對象
├── aggregates/         # 聚合根
├── repositories/       # 倉儲接口
├── services/           # 領域服務
├── events/             # 領域事件
├── specifications/     # 規格模式
├── exceptions/         # 領域異常
```

### 第三層：具體實現層
- 每個功能模組下面都有具體的實現目錄，例如：
```
src/app/domain/
├── entities/           # 實體
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶實體
│   │   ├── user.entity.ts
│   │   ├── user.factory.ts
│   │   └── index.ts
│   ├── role/          # 角色實體
│   │   ├── role.entity.ts
│   │   ├── role.factory.ts
│   │   └── index.ts
│   ├── permission/    # 權限實體
│   │   ├── permission.entity.ts
│   │   ├── permission.factory.ts
│   │   └── index.ts
│   └── organization/  # 組織實體
│       ├── organization.entity.ts
│       ├── organization.factory.ts
│       └── index.ts
```

### 統一導出
- 每個功能模組下面都有統一導出文件，例如：
```
src/app/domain/
├── entities/           # 實體
│   └── index.ts       # 統一導出
```
- 統一導出文件頂部必須添加註解，註解內容如下：
```
/**
 * @fileoverview 實體統一導出檔案 (Entities Unified Export)
 * @description 存放實體的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Domain Layer Entities
 * - 職責：實體統一導出
 * - 依賴：實體
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放實體的統一導出，不包含業務邏輯
 * - 所有實體必須在此檔案中導出
 */
```

### 頂部統一導出註解格式
- 每個文件頂部必須添加註解令開發者快速了解文件內容，
- 註解格式如下：
```
/**
 * @fileoverview 檔案性質 (File Overview)
 * @description 檔案描述 (File Description)
 * @author NG-AC Team (Author)
 * @version 1.0.0 (Version)
 * @since 2024-01-01 (Since)
 *
 * 檔案性質：
 * - 類型：Domain Layer Unified Export (File Type)
 * - 職責：文件職責 (File Responsibility)
 * - 依賴：文件依賴 (File Dependencies)
 * - 不可變更：此文件的所有註解和架構說明均不可變更 (Immutable)
 *
 * 重要說明：
 * - 此檔案特別說明 (Important Note)
 * - 此檔案注意事項 (Important Note)
 * - 此檔案須遵守此架構規則1 (Important Note)
 * - 此檔案須遵守此架構規則2 (Important Note)
 * - 此檔案須遵守此架構規則3 (Important Note)
 * - 此檔案須遵守此架構規則4 (Important Note)
 * - 此檔案須遵守此架構規則5 (Important Note)
 * - 此檔案須遵守此架構規則6 (Important Note)
 * - 此檔案須遵守此架構規則7 (Important Note)
 * - 此檔案須遵守此架構規則8 (Important Note)
 */

 // 功能 (狀態: 待實現)
 // 代碼:

```

### 依賴關係圖
```
┌─────────────────────────────────────────────────────┐
│                 Modules Layer                       │ ← 功能聚合匯出
│              (功能模組統一入口)                        │
└─────────────────┬───────────────────────────────────┘
                  │ (聚合匯出)
┌─────────────────▼───────────────────────────────────┐
│                  Core Layer                         │ ← 服務聚合匯出
│              (核心服務統一入口)                        │
└─────────────────┬───────────────────────────────────┘
                  │ (聚合匯出)
         ┌────────▼────────┐
         │ Interface Layer │ ────┐
         └─────────────────┘     │
                  │              │
         ┌────────▼────────┐     │
         │ Application     │     │
         │ Layer          │     │
         └─────────────────┘     │
                  │              │
         ┌────────▼────────┐     │
         │ Domain Layer    │     │
         └─────────────────┘     │
                  ▲              │
                  │              │
         ┌────────┴────────┐     │
         │ Infrastructure  │     │
         │ Layer          │ ◄───┘
         └─────────────────┘
                  ▲
         ┌────────┴────────┐
         │ Security Layer  │ ◄───┐
         └─────────────────┘     │
                  ▲              │
         ┌────────┴────────┐     │
         │ Shared Layer    │ ◄───┘
         └─────────────────┘
```

### 依賴說明：
- **Modules & Core**: 僅做匯出聚合，不包含業務邏輯
- **Interface**: 依賴 Application, Security, Shared
- **Application**: 依賴 Domain, Shared
- **Infrastructure**: 依賴 Domain, Shared
- **Security**: 依賴 Application, Infrastructure, Shared
- **Domain**: 僅依賴 Shared
- **Shared**: 無依賴（最基礎層）

---

## 1. 領域層 (Domain Layer)

> **職責**：純業務邏輯，不依賴任何外部框架或技術實現

```
src/app/domain/
├── entities/           # 實體
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶實體
│   │   ├── user.entity.ts
│   │   ├── user.factory.ts
│   │   └── index.ts
│   ├── role/          # 角色實體
│   │   ├── role.entity.ts
│   │   ├── role.factory.ts
│   │   └── index.ts
│   ├── permission/    # 權限實體
│   │   ├── permission.entity.ts
│   │   ├── permission.factory.ts
│   │   └── index.ts
│   └── organization/  # 組織實體
│       ├── organization.entity.ts
│       ├── organization.factory.ts
│       └── index.ts
├── value-objects/      # 值對象
│   ├── index.ts       # 統一導出
│   ├── email/         # 郵箱值對象
│   │   ├── email.vo.ts
│   │   ├── email.validator.ts
│   │   └── index.ts
│   ├── password/      # 密碼值對象
│   │   ├── password.vo.ts
│   │   ├── password.policy.ts
│   │   └── index.ts
│   ├── uuid/          # UUID 值對象
│   │   ├── uuid.vo.ts
│   │   └── index.ts
│   └── money/         # 金額值對象
│       ├── money.vo.ts
│       ├── currency.ts
│       └── index.ts
├── aggregates/         # 聚合根
│   ├── index.ts       # 統一導出
│   ├── user-account/  # 用戶賬戶聚合
│   │   ├── user-account.aggregate.ts
│   │   ├── user-account.repository.interface.ts
│   │   └── index.ts
│   └── organization/  # 組織聚合
│       ├── organization.aggregate.ts
│       ├── organization.repository.interface.ts
│       └── index.ts
├── repositories/       # 倉儲接口（僅接口定義）
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶倉儲接口
│   │   ├── user.repository.interface.ts
│   │   └── index.ts
│   ├── role/          # 角色倉儲接口
│   │   ├── role.repository.interface.ts
│   │   └── index.ts
│   └── permission/    # 權限倉儲接口
│       ├── permission.repository.interface.ts
│       └── index.ts
├── services/          # 領域服務（純業務邏輯）
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶領域服務
│   │   ├── user-domain.service.ts
│   │   ├── user-validation.service.ts
│   │   └── index.ts
│   ├── organization/  # 組織領域服務
│   │   ├── organization-domain.service.ts
│   │   ├── organization-policy.service.ts
│   │   └── index.ts
│   └── business/      # 業務規則服務
│       ├── business-rules.service.ts
│       ├── workflow.service.ts
│       └── index.ts
├── events/            # 領域事件
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶相關事件
│   │   ├── user-created.event.ts
│   │   ├── user-updated.event.ts
│   │   └── index.ts
│   ├── organization/  # 組織相關事件
│   │   ├── organization-created.event.ts
│   │   ├── organization-updated.event.ts
│   │   └── index.ts
│   └── base/          # 基礎事件
│       ├── domain-event.interface.ts
│       ├── event-handler.interface.ts
│       └── index.ts
├── specifications/    # 規格模式（業務規則）
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶規格
│   │   ├── user-active.spec.ts
│   │   ├── user-eligible.spec.ts
│   │   └── index.ts
│   ├── organization/  # 組織規格
│   │   ├── organization-valid.spec.ts
│   │   └── index.ts
│   └── base/          # 基礎規格
│       ├── specification.interface.ts
│       ├── composite.specification.ts
│       └── index.ts
└── exceptions/        # 領域異常
    ├── index.ts       # 統一導出
    ├── user/          # 用戶相關異常
    │   ├── user-not-found.exception.ts
    │   ├── user-already-exists.exception.ts
    │   └── index.ts
    ├── organization/  # 組織相關異常
    │   ├── organization-not-found.exception.ts
    │   └── index.ts
    └── base/          # 基礎異常
        ├── domain.exception.ts
        ├── business-rule.exception.ts
        └── index.ts
```

---

## 2. 應用層 (Application Layer)

> **職責**：用例編排，協調領域對象完成業務流程

```
src/app/application/
├── use-cases/         # 業務用例
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶用例
│   │   ├── create-user.use-case.ts
│   │   ├── update-user.use-case.ts
│   │   ├── delete-user.use-case.ts
│   │   ├── get-user.use-case.ts
│   │   └── index.ts
│   ├── organization/  # 組織用例
│   │   ├── create-organization.use-case.ts
│   │   ├── update-organization.use-case.ts
│   │   └── index.ts
│   └── auth/          # 認證用例
│       ├── login.use-case.ts
│       ├── register.use-case.ts
│       ├── reset-password.use-case.ts
│       └── index.ts
├── services/          # 應用服務（編排業務邏輯）
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶應用服務
│   │   ├── user-application.service.ts
│   │   ├── user-query.service.ts
│   │   └── index.ts
│   ├── organization/  # 組織應用服務
│   │   ├── organization-application.service.ts
│   │   ├── organization-query.service.ts
│   │   └── index.ts
│   └── notification/  # 通知應用服務
│       ├── notification.service.ts
│       ├── email-notification.service.ts
│       └── index.ts
├── commands/          # CQRS 命令
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶命令
│   │   ├── create-user.command.ts
│   │   ├── update-user.command.ts
│   │   ├── delete-user.command.ts
│   │   └── index.ts
│   ├── organization/  # 組織命令
│   │   ├── create-organization.command.ts
│   │   ├── update-organization.command.ts
│   │   └── index.ts
│   └── handlers/      # 命令處理器
│       ├── user-command.handler.ts
│       ├── organization-command.handler.ts
│       └── index.ts
├── queries/           # CQRS 查詢
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶查詢
│   │   ├── get-user.query.ts
│   │   ├── list-users.query.ts
│   │   ├── search-users.query.ts
│   │   └── index.ts
│   ├── organization/  # 組織查詢
│   │   ├── get-organization.query.ts
│   │   ├── list-organizations.query.ts
│   │   └── index.ts
│   └── handlers/      # 查詢處理器
│       ├── user-query.handler.ts
│       ├── organization-query.handler.ts
│       └── index.ts
├── dto/               # 數據傳輸對象
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶 DTO
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   ├── user-response.dto.ts
│   │   └── index.ts
│   ├── organization/  # 組織 DTO
│   │   ├── create-organization.dto.ts
│   │   ├── organization-response.dto.ts
│   │   └── index.ts
│   └── common/        # 通用 DTO
│       ├── pagination.dto.ts
│       ├── response.dto.ts
│       └── index.ts
├── validators/        # 輸入驗證器
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶驗證器
│   │   ├── create-user.validator.ts
│   │   ├── update-user.validator.ts
│   │   └── index.ts
│   ├── organization/  # 組織驗證器
│   │   ├── create-organization.validator.ts
│   │   └── index.ts
│   └── common/        # 通用驗證器
│       ├── pagination.validator.ts
│       ├── uuid.validator.ts
│       └── index.ts
├── mappers/           # 對象映射器
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶映射器
│   │   ├── user.mapper.ts
│   │   ├── user-dto.mapper.ts
│   │   └── index.ts
│   ├── organization/  # 組織映射器
│   │   ├── organization.mapper.ts
│   │   └── index.ts
│   └── base/          # 基礎映射器
│       ├── base.mapper.ts
│       ├── pagination.mapper.ts
│       └── index.ts
└── exceptions/        # 應用層異常
    ├── index.ts       # 統一導出
    ├── validation/    # 驗證異常
    │   ├── validation.exception.ts
    │   ├── business-validation.exception.ts
    │   └── index.ts
    ├── use-case/      # 用例異常
    │   ├── use-case.exception.ts
    │   └── index.ts
    └── base/          # 基礎異常
        ├── application.exception.ts
        └── index.ts
```

---

## 3. 基礎設施層 (Infrastructure Layer)

> **職責**：技術實現細節，外部服務集成

```
src/app/infrastructure/
├── persistence/       # 數據持久化
│   ├── index.ts       # 統一導出
│   ├── repositories/  # 倉儲實現
│   │   ├── user/      # 用戶倉儲實現
│   │   │   ├── user.repository.ts
│   │   │   ├── user.orm-entity.ts
│   │   │   └── index.ts
│   │   ├── role/      # 角色倉儲實現
│   │   │   ├── role.repository.ts
│   │   │   ├── role.orm-entity.ts
│   │   │   └── index.ts
│   │   └── organization/  # 組織倉儲實現
│   │       ├── organization.repository.ts
│   │       ├── organization.orm-entity.ts
│   │       └── index.ts
│   ├── migrations/    # 數據庫遷移
│   │   ├── 001-create-users-table.ts
│   │   ├── 002-create-roles-table.ts
│   │   ├── 003-create-organizations-table.ts
│   │   └── index.ts
│   ├── connections/   # 數據庫連接
│   │   ├── database.connection.ts
│   │   ├── redis.connection.ts
│   │   └── index.ts
│   └── seeds/         # 數據種子
│       ├── user.seed.ts
│       ├── role.seed.ts
│       └── index.ts
├── external-services/ # 外部服務集成
│   ├── index.ts       # 統一導出
│   ├── email/         # 郵件服務
│   │   ├── email.service.ts
│   │   ├── email-template.service.ts
│   │   ├── providers/
│   │   │   ├── sendgrid.provider.ts
│   │   │   ├── ses.provider.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── sms/           # 短信服務
│   │   ├── sms.service.ts
│   │   ├── providers/
│   │   │   ├── twilio.provider.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── payment/       # 支付服務
│   │   ├── payment.service.ts
│   │   ├── providers/
│   │   │   ├── stripe.provider.ts
│   │   │   ├── paypal.provider.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── storage/       # 存儲服務
│   │   ├── storage.service.ts
│   │   ├── providers/
│   │   │   ├── aws-s3.provider.ts
│   │   │   ├── azure-blob.provider.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── third-party/   # 第三方服務
│       ├── social-auth/
│       │   ├── google.provider.ts
│       │   ├── facebook.provider.ts
│       │   └── index.ts
│       └── index.ts
├── messaging/         # 消息處理
│   ├── index.ts       # 統一導出
│   ├── events/        # 事件總線實現
│   │   ├── event-bus.service.ts
│   │   ├── event-store.service.ts
│   │   └── index.ts
│   ├── queues/        # 消息隊列
│   │   ├── queue.service.ts
│   │   ├── job.processor.ts
│   │   ├── providers/
│   │   │   ├── redis-queue.provider.ts
│   │   │   ├── rabbitmq.provider.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── pubsub/        # 發布訂閱
│   │   ├── pubsub.service.ts
│   │   ├── redis-pubsub.service.ts
│   │   └── index.ts
│   └── websocket/     # WebSocket
│       ├── websocket.service.ts
│       ├── websocket.gateway.ts
│       └── index.ts
├── caching/           # 緩存實現
│   ├── index.ts       # 統一導出
│   ├── cache.service.ts
│   ├── providers/
│   │   ├── redis.cache.ts
│   │   ├── memory.cache.ts
│   │   └── index.ts
│   ├── strategies/
│   │   ├── cache-aside.strategy.ts
│   │   ├── write-through.strategy.ts
│   │   └── index.ts
│   └── decorators/
│       ├── cacheable.decorator.ts
│       └── index.ts
├── logging/           # 日誌實現
│   ├── index.ts       # 統一導出
│   ├── logger.service.ts
│   ├── providers/
│   │   ├── winston.provider.ts
│   │   ├── console.provider.ts
│   │   └── index.ts
│   ├── formatters/
│   │   ├── json.formatter.ts
│   │   ├── text.formatter.ts
│   │   └── index.ts
│   ├── transports/
│   │   ├── file.transport.ts
│   │   ├── database.transport.ts
│   │   └── index.ts
│   └── decorators/
│       ├── loggable.decorator.ts
│       └── index.ts
├── monitoring/        # 監控實現
│   ├── index.ts       # 統一導出
│   ├── metrics/       # 指標收集
│   │   ├── metrics.service.ts
│   │   ├── performance.metrics.ts
│   │   ├── business.metrics.ts
│   │   └── index.ts
│   ├── health/        # 健康檢查
│   │   ├── health.service.ts
│   │   ├── database.health.ts
│   │   ├── cache.health.ts
│   │   └── index.ts
│   ├── performance/   # 性能監控
│   │   ├── performance.service.ts
│   │   ├── apm.service.ts
│   │   └── index.ts
│   └── alerts/        # 告警系統
│       ├── alert.service.ts
│       ├── notification.alert.ts
│       └── index.ts
├── config/            # 配置管理
│   ├── index.ts       # 統一導出
│   ├── app/           # 應用配置
│   │   ├── app.config.ts
│   │   ├── feature.config.ts
│   │   └── index.ts
│   ├── database/      # 數據庫配置
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── index.ts
│   ├── environment/   # 環境配置
│   │   ├── development.config.ts
│   │   ├── production.config.ts
│   │   ├── testing.config.ts
│   │   └── index.ts
│   └── validation/    # 配置驗證
│       ├── config.schema.ts
│       └── index.ts
└── exceptions/        # 基礎設施異常
    ├── index.ts       # 統一導出
    ├── database/      # 數據庫異常
    │   ├── connection.exception.ts
    │   ├── query.exception.ts
    │   └── index.ts
    ├── external/      # 外部服務異常
    │   ├── service-unavailable.exception.ts
    │   └── index.ts
    └── base/          # 基礎異常
        ├── infrastructure.exception.ts
        └── index.ts
```

---

## 4. 接口層 (Interface Layer)

> **職責**：用戶交互界面，處理HTTP請求、WebSocket連接等

```
src/app/interface/
├── components/        # UI 組件
│   ├── index.ts       # 統一導出
│   ├── common/        # 通用組件
│   │   ├── button/
│   │   │   ├── button.component.ts
│   │   │   ├── button.component.html
│   │   │   ├── button.component.scss
│   │   │   └── index.ts
│   │   ├── input/
│   │   │   ├── input.component.ts
│   │   │   ├── input.component.html
│   │   │   ├── input.component.scss
│   │   │   └── index.ts
│   │   ├── modal/
│   │   │   ├── modal.component.ts
│   │   │   ├── modal.component.html
│   │   │   ├── modal.component.scss
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── layout/        # 佈局組件
│   │   ├── header/
│   │   │   ├── header.component.ts
│   │   │   ├── header.component.html
│   │   │   ├── header.component.scss
│   │   │   └── index.ts
│   │   ├── sidebar/
│   │   │   ├── sidebar.component.ts
│   │   │   ├── sidebar.component.html
│   │   │   ├── sidebar.component.scss
│   │   │   └── index.ts
│   │   ├── footer/
│   │   │   ├── footer.component.ts
│   │   │   ├── footer.component.html
│   │   │   ├── footer.component.scss
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── widgets/       # 小部件
│   │   ├── user-card/
│   │   │   ├── user-card.component.ts
│   │   │   ├── user-card.component.html
│   │   │   ├── user-card.component.scss
│   │   │   └── index.ts
│   │   ├── data-table/
│   │   │   ├── data-table.component.ts
│   │   │   ├── data-table.component.html
│   │   │   ├── data-table.component.scss
│   │   │   └── index.ts
│   │   └── index.ts
│   └── forms/         # 表單組件
│       ├── user-form/
│       │   ├── user-form.component.ts
│       │   ├── user-form.component.html
│       │   ├── user-form.component.scss
│       │   └── index.ts
│       ├── login-form/
│       │   ├── login-form.component.ts
│       │   ├── login-form.component.html
│       │   ├── login-form.component.scss
│       │   └── index.ts
│       └── index.ts
├── pages/             # 頁面組件
│   ├── index.ts       # 統一導出
│   ├── auth/          # 認證頁面
│   │   ├── login/
│   │   │   ├── login.page.ts
│   │   │   ├── login.page.html
│   │   │   ├── login.page.scss
│   │   │   └── index.ts
│   │   ├── register/
│   │   │   ├── register.page.ts
│   │   │   ├── register.page.html
│   │   │   ├── register.page.scss
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── user/          # 用戶頁面
│   │   ├── user-list/
│   │   │   ├── user-list.page.ts
│   │   │   ├── user-list.page.html
│   │   │   ├── user-list.page.scss
│   │   │   └── index.ts
│   │   ├── user-detail/
│   │   │   ├── user-detail.page.ts
│   │   │   ├── user-detail.page.html
│   │   │   ├── user-detail.page.scss
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── dashboard/     # 儀表板頁面
│   │   ├── dashboard.page.ts
│   │   ├── dashboard.page.html
│   │   ├── dashboard.page.scss
│   │   └── index.ts
│   └── organization/  # 組織頁面
│       ├── organization-list/
│       ├── organization-detail/
│       └── index.ts
├── layouts/           # 佈局模板
│   ├── index.ts       # 統一導出
│   ├── basic/         # 基礎佈局
│   │   ├── basic.layout.ts
│   │   ├── basic.layout.html
│   │   ├── basic.layout.scss
│   │   └── index.ts
│   ├── blank/         # 空白佈局
│   │   ├── blank.layout.ts
│   │   ├── blank.layout.html
│   │   ├── blank.layout.scss
│   │   └── index.ts
│   ├── passport/      # 認證佈局
│   │   ├── passport.layout.ts
│   │   ├── passport.layout.html
│   │   ├── passport.layout.scss
│   │   └── index.ts
│   └── dashboard/     # 儀表板佈局
│       ├── dashboard.layout.ts
│       ├── dashboard.layout.html
│       ├── dashboard.layout.scss
│       └── index.ts
├── controllers/       # 控制器（API 層）
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶控制器
│   │   ├── user.controller.ts
│   │   ├── user.controller.spec.ts
│   │   └── index.ts
│   ├── auth/          # 認證控制器
│   │   ├── auth.controller.ts
│   │   ├── auth.controller.spec.ts
│   │   └── index.ts
│   └── organization/  # 組織控制器
│       ├── organization.controller.ts
│       ├── organization.controller.spec.ts
│       └── index.ts
├── guards/            # 路由守衛（接口層關注點）
│   ├── index.ts       # 統一導出
│   ├── route/         # 路由守衛
│   │   ├── can-activate.guard.ts
│   │   ├── can-deactivate.guard.ts
│   │   └── index.ts
│   ├── feature/       # 功能守衛
│   │   ├── feature-flag.guard.ts
│   │   └── index.ts
│   └── validation/    # 驗證守衛
│       ├── form-validation.guard.ts
│       └── index.ts
├── interceptors/      # HTTP 攔截器（接口層關注點）
│   ├── index.ts       # 統一導出
│   ├── request/       # 請求攔截器
│   │   ├── auth-token.interceptor.ts
│   │   ├── base-url.interceptor.ts
│   │   └── index.ts
│   ├── response/      # 響應攔截器
│   │   ├── error-handling.interceptor.ts
│   │   ├── response-transform.interceptor.ts
│   │   └── index.ts
│   └── logging/       # 日誌攔截器
│       ├── http-logging.interceptor.ts
│       └── index.ts
├── pipes/             # 數據管道（接口層關注點）
│   ├── index.ts       # 統一導出
│   ├── format/        # 格式化管道
│   │   ├── date-format.pipe.ts
│   │   ├── currency-format.pipe.ts
│   │   └── index.ts
│   ├── validation/    # 驗證管道
│   │   ├── validation.pipe.ts
│   │   └── index.ts
│   └── transform/     # 轉換管道
│       ├── transform.pipe.ts
│       └── index.ts
├── directives/        # 指令（接口層關注點）
│   ├── index.ts       # 統一導出
│   ├── ui/            # UI 指令
│   │   ├── tooltip.directive.ts
│   │   ├── highlight.directive.ts
│   │   └── index.ts
│   ├── validation/    # 驗證指令
│   │   ├── form-validation.directive.ts
│   │   └── index.ts
│   └── business/      # 業務指令
│       ├── auto-save.directive.ts
│       └── index.ts
├── resolvers/         # 路由解析器
│   ├── index.ts       # 統一導出
│   ├── user/          # 用戶解析器
│   │   ├── user.resolver.ts
│   │   └── index.ts
│   └── organization/  # 組織解析器
│       ├── organization.resolver.ts
│       └── index.ts
└── exceptions/        # 接口層異常處理
    ├── index.ts       # 統一導出
    ├── http/          # HTTP 異常
    │   ├── http-exception.filter.ts
    │   ├── validation-exception.filter.ts
    │   └── index.ts
    ├── websocket/     # WebSocket 異常
    │   ├── ws-exception.filter.ts
    │   └── index.ts
    └── handlers/      # 異常處理器
        ├── global-exception.handler.ts
        ├── error-page.handler.ts
        └── index.ts
```

---

## 5. 安全層 (Security Layer)

> **職責**：統一管理認證、授權、加密等安全相關功能

```
src/app/security/
├── authentication/    # 認證管理
│   ├── index.ts       # 統一導出
│   ├── services/      # 認證服務
│   │   ├── authentication.service.ts
│   │   ├── session.service.ts
│   │   ├── token.service.ts
│   │   └── index.ts
│   ├── strategies/    # 認證策略
│   │   ├── local.strategy.ts
│   │   ├── jwt.strategy.ts
│   │   ├── oauth.strategy.ts
│   │   ├── ldap.strategy.ts
│   │   └── index.ts
│   ├── guards/        # 認證守衛
│   │   ├── auth.guard.ts
│   │   ├── jwt.guard.ts
│   │   ├── local.guard.ts
│   │   └── index.ts
│   ├── decorators/    # 認證裝飾器
│   │   ├── auth.decorator.ts
│   │   ├── public.decorator.ts
│   │   ├── roles.decorator.ts
│   │   └── index.ts
│   ├── providers/     # 認證提供者
│   │   ├── google.provider.ts
│   │   ├── facebook.provider.ts
│   │   ├── github.provider.ts
│   │   └── index.ts
│   └── validators/    # 認證驗證器
│       ├── credential.validator.ts
│       ├── token.validator.ts
│       └── index.ts
├── authorization/     # 授權管理
│   ├── index.ts       # 統一導出
│   ├── services/      # 授權服務
│   │   ├── authorization.service.ts
│   │   ├── permission.service.ts
│   │   ├── role.service.ts
│   │   └── index.ts
│   ├── policies/      # 授權策略
│   │   ├── rbac.policy.ts
│   │   ├── abac.policy.ts
│   │   ├── resource.policy.ts
│   │   └── index.ts
│   ├── guards/        # 授權守衛
│   │   ├── permission.guard.ts
│   │   ├── role.guard.ts
│   │   ├── resource.guard.ts
│   │   └── index.ts
│   ├── decorators/    # 授權裝飾器
│   │   ├── permissions.decorator.ts
│   │   ├── roles.decorator.ts
│   │   ├── resource.decorator.ts
│   │   └── index.ts
│   ├── evaluators/    # 權限評估器
│   │   ├── permission.evaluator.ts
│   │   ├── policy.evaluator.ts
│   │   └── index.ts
│   └── models/        # 授權模型
│       ├── permission.model.ts
│       ├── role.model.ts
│       ├── policy.model.ts
│       └── index.ts
├── encryption/        # 加密服務
│   ├── index.ts       # 統一導出
│   ├── services/      # 加密服務
│   │   ├── encryption.service.ts
│   │   ├── hash.service.ts
│   │   ├── cipher.service.ts
│   │   └── index.ts
│   ├── algorithms/    # 加密算法
│   │   ├── aes.algorithm.ts
│   │   ├── rsa.algorithm.ts
│   │   ├── bcrypt.algorithm.ts
│   │   └── index.ts
│   ├── providers/     # 加密提供者
│   │   ├── openssl.provider.ts
│   │   ├── crypto.provider.ts
│   │   └── index.ts
│   └── utils/         # 加密工具
│       ├── key-generator.util.ts
│       ├── salt.util.ts
│       └── index.ts
├── jwt/               # JWT 處理
│   ├── index.ts       # 統一導出
│   ├── services/      # JWT 服務
│   │   ├── jwt.service.ts
│   │   ├── refresh-token.service.ts
│   │   └── index.ts
│   ├── strategies/    # JWT 策略
│   │   ├── access-token.strategy.ts
│   │   ├── refresh-token.strategy.ts
│   │   └── index.ts
│   ├── guards/        # JWT 守衛
│   │   ├── jwt-auth.guard.ts
│   │   ├── refresh-token.guard.ts
│   │   └── index.ts
│   ├── interceptors/  # JWT 攔截器
│   │   ├── token-refresh.interceptor.ts
│   │   └── index.ts
│   └── utils/         # JWT 工具
│       ├── token.util.ts
│       ├── payload.util.ts
│       └── index.ts
├── audit/             # 安全審計
│   ├── index.ts       # 統一導出
│   ├── services/      # 審計服務
│   │   ├── audit.service.ts
│   │   ├── security-log.service.ts
│   │   └── index.ts
│   ├── models/        # 審計模型
│   │   ├── audit-log.model.ts
│   │   ├── security-event.model.ts
│   │   └── index.ts
│   ├── interceptors/  # 審計攔截器
│   │   ├── audit.interceptor.ts
│   │   └── index.ts
│   └── decorators/    # 審計裝飾器
│       ├── auditable.decorator.ts
│       └── index.ts
├── validation/        # 安全驗證
│   ├── index.ts       # 統一導出
│   ├── services/      # 驗證服務
│   │   ├── input-sanitization.service.ts
│   │   ├── xss-protection.service.ts
│   │   ├── sql-injection-protection.service.ts
│   │   └── index.ts
│   ├── validators/    # 安全驗證器
│   │   ├── secure-input.validator.ts
│   │   ├── file-upload.validator.ts
│   │   └── index.ts
│   ├── pipes/         # 安全管道
│   │   ├── sanitization.pipe.ts
│   │   └── index.ts
│   └── decorators/    # 安全裝飾器
│       ├── sanitize.decorator.ts
│       └── index.ts
├── rate-limiting/     # 頻率限制
│   ├── index.ts       # 統一導出
│   ├── services/      # 限流服務
│   │   ├── rate-limiter.service.ts
│   │   ├── throttle.service.ts
│   │   └── index.ts
│   ├── guards/        # 限流守衛
│   │   ├── rate-limit.guard.ts
│   │   ├── throttle.guard.ts
│   │   └── index.ts
│   ├── decorators/    # 限流裝飾器
│   │   ├── rate-limit.decorator.ts
│   │   ├── throttle.decorator.ts
│   │   └── index.ts
│   └── strategies/    # 限流策略
│       ├── sliding-window.strategy.ts
│       ├── token-bucket.strategy.ts
│       └── index.ts
└── exceptions/        # 安全異常
    ├── index.ts       # 統一導出
    ├── authentication/  # 認證異常
    │   ├── invalid-credentials.exception.ts
    │   ├── token-expired.exception.ts
    │   ├── unauthorized.exception.ts
    │   └── index.ts
    ├── authorization/   # 授權異常
    │   ├── forbidden.exception.ts
    │   ├── insufficient-permissions.exception.ts
    │   └── index.ts
    ├── validation/      # 驗證異常
    │   ├── malicious-input.exception.ts
    │   ├── security-violation.exception.ts
    │   └── index.ts
    └── base/            # 基礎安全異常
        ├── security.exception.ts
        └── index.ts
```

---

## 6. 共享層 (Shared Layer)

> **職責**：提供所有層級都可能使用的通用資源和工具

```
src/app/shared/
├── constants/         # 常量定義
│   ├── index.ts       # 統一導出
│   ├── app/           # 應用常量
│   │   ├── app.constants.ts
│   │   ├── feature-flags.constants.ts
│   │   ├── config.constants.ts
│   │   └── index.ts
│   ├── api/           # API 常量
│   │   ├── endpoints.constants.ts
│   │   ├── headers.constants.ts
│   │   ├── status-codes.constants.ts
│   │   └── index.ts
│   ├── validation/    # 驗證常量
│   │   ├── rules.constants.ts
│   │   ├── messages.constants.ts
│   │   ├── patterns.constants.ts
│   │   └── index.ts
│   └── business/      # 業務常量
│       ├── user.constants.ts
│       ├── role.constants.ts
│       ├── organization.constants.ts
│       └── index.ts
├── enums/             # 枚舉定義
│   ├── index.ts       # 統一導出
│   ├── common/        # 通用枚舉
│   │   ├── status.enum.ts
│   │   ├── priority.enum.ts
│   │   ├── sort-order.enum.ts
│   │   └── index.ts
│   ├── user/          # 用戶相關枚舉
│   │   ├── user-status.enum.ts
│   │   ├── user-type.enum.ts
│   │   └── index.ts
│   ├── permission/    # 權限相關枚舉
│   │   ├── permission-type.enum.ts
│   │   ├── resource-type.enum.ts
│   │   └── index.ts
│   └── business/      # 業務枚舉
│       ├── order-status.enum.ts
│       ├── payment-status.enum.ts
│       └── index.ts
├── interfaces/        # 接口定義
│   ├── index.ts       # 統一導出
│   ├── common/        # 通用接口
│   │   ├── base.interface.ts
│   │   ├── pagination.interface.ts
│   │   ├── response.interface.ts
│   │   ├── audit.interface.ts
│   │   └── index.ts
│   ├── api/           # API 接口
│   │   ├── request.interface.ts
│   │   ├── response.interface.ts
│   │   ├── error.interface.ts
│   │   └── index.ts
│   ├── user/          # 用戶接口
│   │   ├── user.interface.ts
│   │   ├── user-profile.interface.ts
│   │   └── index.ts
│   ├── config/        # 配置接口
│   │   ├── app-config.interface.ts
│   │   ├── database-config.interface.ts
│   │   └── index.ts
│   └── business/      # 業務接口
│       ├── business-entity.interface.ts
│       └── index.ts
├── types/             # 類型定義
│   ├── index.ts       # 統一導出
│   ├── common/        # 通用類型
│   │   ├── utility.types.ts
│   │   ├── generic.types.ts
│   │   ├── function.types.ts
│   │   └── index.ts
│   ├── api/           # API 類型
│   │   ├── request.types.ts
│   │   ├── response.types.ts
│   │   └── index.ts
│   ├── user/          # 用戶類型
│   │   ├── user.types.ts
│   │   └── index.ts
│   ├── security/      # 安全類型
│   │   ├── auth.types.ts
│   │   ├── permission.types.ts
│   │   └── index.ts
│   └── business/      # 業務類型
│       ├── business.types.ts
│       └── index.ts
├── utils/             # 工具函數
│   ├── index.ts       # 統一導出
│   ├── string/        # 字符串工具
│   │   ├── string.util.ts
│   │   ├── slug.util.ts
│   │   ├── template.util.ts
│   │   └── index.ts
│   ├── date/          # 日期工具
│   │   ├── date.util.ts
│   │   ├── format.util.ts
│   │   ├── timezone.util.ts
│   │   └── index.ts
│   ├── validation/    # 驗證工具
│   │   ├── validation.util.ts
│   │   ├── rules.util.ts
│   │   ├── sanitization.util.ts
│   │   └── index.ts
│   ├── object/        # 對象工具
│   │   ├── object.util.ts
│   │   ├── deep-clone.util.ts
│   │   ├── merge.util.ts
│   │   └── index.ts
│   ├── array/         # 數組工具
│   │   ├── array.util.ts
│   │   ├── sort.util.ts
│   │   ├── filter.util.ts
│   │   └── index.ts
│   ├── file/          # 文件工具
│   │   ├── file.util.ts
│   │   ├── upload.util.ts
│   │   ├── mime.util.ts
│   │   └── index.ts
│   └── business/      # 業務工具
│       ├── calculation.util.ts
│       ├── formatting.util.ts
│       └── index.ts
├── decorators/        # 通用裝飾器
│   ├── index.ts       # 統一導出
│   ├── common/        # 通用裝飾器
│   │   ├── memoize.decorator.ts
│   │   ├── retry.decorator.ts
│   │   ├── timeout.decorator.ts
│   │   └── index.ts
│   ├── validation/    # 驗證裝飾器
│   │   ├── validate.decorator.ts
│   │   ├── transform.decorator.ts
│   │   └── index.ts
│   ├── logging/       # 日誌裝飾器
│   │   ├── log.decorator.ts
│   │   ├── performance.decorator.ts
│   │   └── index.ts
│   └── business/      # 業務裝飾器
│       ├── transactional.decorator.ts
│       └── index.ts
├── base/              # 基礎抽象類（統一管理）
│   ├── index.ts       # 統一導出
│   ├── entities/      # 基礎實體
│   │   ├── base.entity.ts
│   │   ├── audit.entity.ts
│   │   ├── timestamped.entity.ts
│   │   └── index.ts
│   ├── services/      # 基礎服務
│   │   ├── base.service.ts
│   │   ├── crud.service.ts
│   │   └── index.ts
│   ├── repositories/  # 基礎倉儲
│   │   ├── base.repository.ts
│   │   ├── crud.repository.ts
│   │   └── index.ts
│   ├── controllers/   # 基礎控制器
│   │   ├── base.controller.ts
│   │   ├── crud.controller.ts
│   │   └── index.ts
│   ├── components/    # 基礎組件
│   │   ├── base.component.ts
│   │   ├── list.component.ts
│   │   ├── form.component.ts
│   │   └── index.ts
│   └── exceptions/    # 基礎異常
│       ├── base.exception.ts
│       ├── not-found.exception.ts
│       ├── validation.exception.ts
│       └── index.ts
├── i18n/              # 國際化（真正的橫切關注點）
│   ├── index.ts       # 統一導出
│   ├── services/      # i18n 服務
│   │   ├── i18n.service.ts
│   │   ├── translation.service.ts
│   │   ├── locale.service.ts
│   │   └── index.ts
│   ├── pipes/         # i18n 管道
│   │   ├── translate.pipe.ts
│   │   ├── date-locale.pipe.ts
│   │   ├── currency-locale.pipe.ts
│   │   └── index.ts
│   ├── config/        # i18n 配置
│   │   ├── i18n.config.ts
│   │   ├── locale.config.ts
│   │   └── index.ts
│   ├── locales/       # 語言包
│   │   ├── zh-TW/     # 繁體中文
│   │   │   ├── common.json
│   │   │   ├── auth.json
│   │   │   ├── user.json
│   │   │   └── index.ts
│   │   ├── zh-CN/     # 簡體中文
│   │   │   ├── common.json
│   │   │   ├── auth.json
│   │   │   ├── user.json
│   │   │   └── index.ts
│   │   ├── en-US/     # 英文
│   │   │   ├── common.json
│   │   │   ├── auth.json
│   │   │   ├── user.json
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── directives/    # i18n 指令
│   │   ├── translate.directive.ts
│   │   └── index.ts
│   └── guards/        # i18n 守衛
│       ├── locale.guard.ts
│       └── index.ts
└── services/          # 共享服務
    ├── index.ts       # 統一導出
    ├── storage/       # 存儲服務
    │   ├── local-storage.service.ts
    │   ├── session-storage.service.ts
    │   ├── memory-storage.service.ts
    │   └── index.ts
    ├── event-bus/     # 事件總線
    │   ├── event-bus.service.ts
    │   ├── event-emitter.service.ts
    │   └── index.ts
    ├── config/        # 配置服務
    │   ├── config.service.ts
    │   ├── feature-flag.service.ts
    │   └── index.ts
    ├── theme/         # 主題服務
    │   ├── theme.service.ts
    │   ├── dark-mode.service.ts
    │   └── index.ts
    └── utility/       # 工具服務
        ├── uuid.service.ts
        ├── random.service.ts
        ├── clipboard.service.ts
        └── index.ts
```

---

## 架構設計原則

### 1. **依賴方向**
- **嚴格的依賴方向**：外層依賴內層，內層不依賴外層
- **依賴倒置**：通過接口實現解耦
- **避免循環依賴**：明確的層級結構

### 2. **職責劃分**
- **單一職責**：每個模組只負責一個明確的職責
- **高內聚低耦合**：相關功能聚合，不相關功能分離
- **關注點分離**：業務邏輯與技術實現分離

### 3. **可測試性**
- **依賴注入**：便於 Mock 和測試
- **純函數**：工具函數保持純函數特性
- **接口抽象**：通過接口進行測試隔離

### 4. **可維護性**
- **統一導出**：每個模組都有 index.ts 統一導出
- **命名規範**：一致的命名慣例
- **文件組織**：清晰的目錄結構

### 5. **可擴展性**
- **模組化設計**：新功能可以獨立添加
- **插件架構**：支持功能的插拔
- **配置驅動**：通過配置控制行為

---

## 使用指南

### 1. **新增功能時**
```typescript
// 1. 在領域層定義業務實體和規則
// src/app/domain/entities/product/
export class Product extends BaseEntity {
  // 業務邏輯
}

// 2. 在應用層定義用例
// src/app/application/use-cases/product/
export class CreateProductUseCase {
  // 用例編排
}

// 3. 在基礎設施層實現技術細節
// src/app/infrastructure/persistence/repositories/product/
export class ProductRepository implements IProductRepository {
  // 技術實現
}

// 4. 在接口層提供用戶界面
// src/app/interface/controllers/product/
export class ProductController {
  // API 接口
}

// 5. 在安全層添加權限控制（如需要）
// src/app/security/authorization/policies/
export class ProductPolicy {
  // 權限策略
}
```

### 2. **導入模組時**
```typescript
// 從統一導出點導入
import { UserEntity, UserFactory } from '@/domain/entities/user';
import { CreateUserUseCase } from '@/application/use-cases/user';
import { UserRepository } from '@/infrastructure/persistence/repositories/user';
import { AuthenticationService } from '@/security/authentication';
import { StringUtil } from '@/shared/utils/string';
```

### 3. **配置依賴注入**
```typescript
// 在應用啟動時配置依賴關係
const container = new Container();

// 註冊倉儲實現
container.bind<IUserRepository>('UserRepository').to(UserRepository);

// 註冊服務
container.bind<AuthenticationService>(AuthenticationService).toSelf();

// 註冊用例
container.bind<CreateUserUseCase>(CreateUserUseCase).toSelf();
```

---

---

## 應用程式入口文件配置

### 原有 Angular 核心文件的新位置

```
src/app/
├── app.component.ts          # 保留在原位置（應用根組件）
├── app.component.html        # 保留在原位置
├── app.component.scss        # 保留在原位置
├── app.config.ts            # 保留在原位置（應用配置）
├── app.routes.ts            # 保留在原位置（路由配置）
├── main.ts                  # Angular 應用啟動文件
└── [六層架構目錄...]
```

### 為什麼保留在根目錄？

1. **Angular 慣例**：這些是 Angular 應用的標準入口文件
2. **框架要求**：Angular CLI 和構建工具期望在 `src/app/` 根目錄找到這些文件
3. **簡化配置**：避免修改 Angular 的默認配置

### 詳細配置說明

#### 1. app.component.ts - 應用根組件
```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

// 從我們的架構中導入
import { ThemeService } from './shared/services/theme';
import { I18nService } from './shared/i18n/services';
import { AuthenticationService } from './security/authentication/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-app';

  constructor(
    private themeService: ThemeService,
    private i18nService: I18nService,
    private authService: AuthenticationService
  ) {
    this.initializeApp();
  }

  private initializeApp(): void {
    // 應用初始化邏輯
    this.themeService.loadTheme();
    this.i18nService.setDefaultLanguage();
    this.authService.initializeAuth();
  }
}
```

#### 2. app.config.ts - 應用配置
```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

// 從我們的架構中導入配置
import { provideAppConfig } from './infrastructure/config/app';
import { provideDatabaseConfig } from './infrastructure/config/database';
import { provideSecurityConfig } from './security/config';
import { provideI18nConfig } from './shared/i18n/config';

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular 核心配置
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),

    // 我們的架構配置
    provideAppConfig(),
    provideDatabaseConfig(),
    provideSecurityConfig(),
    provideI18nConfig(),

    // 依賴注入配置
    ...provideDomainServices(),
    ...provideApplicationServices(),
    ...provideInfrastructureServices(),
    ...provideSecurityServices()
  ]
};

// 配置函數
function provideDomainServices() {
  return [
    // 領域服務配置
  ];
}

function provideApplicationServices() {
  return [
    // 應用服務配置
  ];
}

function provideInfrastructureServices() {
  return [
    // 基礎設施服務配置
  ];
}

function provideSecurityServices() {
  return [
    // 安全服務配置
  ];
}
```

#### 3. app.routes.ts - 路由配置
```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';

// 從接口層導入頁面組件
import { LoginPage } from './interface/pages/auth/login';
import { RegisterPage } from './interface/pages/auth/register';
import { DashboardPage } from './interface/pages/dashboard';
import { UserListPage } from './interface/pages/user/user-list';
import { UserDetailPage } from './interface/pages/user/user-detail';

// 從安全層導入守衛
import { AuthGuard } from './security/authentication/guards';
import { PermissionGuard } from './security/authorization/guards';

// 從接口層導入佈局
import { BasicLayout } from './interface/layouts/basic';
import { PassportLayout } from './interface/layouts/passport';

export const routes: Routes = [
  // 重定向到登錄頁面
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // 認證相關路由（使用認證佈局）
  {
    path: 'auth',
    component: PassportLayout,
    children: [
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegisterPage }
    ]
  },

  // 主應用路由（使用基礎佈局 + 認證守衛）
  {
    path: 'app',
    component: BasicLayout,
    canActivate: [AuthGuard],
    children: [
      // 儀表板
      {
        path: 'dashboard',
        component: DashboardPage,
        canActivate: [PermissionGuard],
        data: { permissions: ['dashboard.view'] }
      },

      // 用戶管理
      {
        path: 'users',
        component: UserListPage,
        canActivate: [PermissionGuard],
        data: { permissions: ['user.list'] }
      },
      {
        path: 'users/:id',
        component: UserDetailPage,
        canActivate: [PermissionGuard],
        data: { permissions: ['user.view'] }
      },

      // 懶加載模組示例
      {
        path: 'organization',
        loadChildren: () => import('./modules/organization/organization.routes')
          .then(m => m.organizationRoutes)
      }
    ]
  },

  // 404 頁面
  { path: '**', redirectTo: '/auth/login' }
];
```

### 模組化路由配置

對於大型應用，可以將路由按功能模組分離：

```
src/app/
├── app.routes.ts            # 主路由配置
├── modules/                 # 功能模組（可選）
│   ├── organization/
│   │   ├── organization.routes.ts
│   │   └── organization.module.ts
│   └── product/
│       ├── product.routes.ts
│       └── product.module.ts
└── [六層架構目錄...]
```

#### 功能模組路由示例
```typescript
// src/app/modules/organization/organization.routes.ts
import { Routes } from '@angular/router';
import { OrganizationListPage } from '../../interface/pages/organization/organization-list';
import { OrganizationDetailPage } from '../../interface/pages/organization/organization-detail';

export const organizationRoutes: Routes = [
  { path: '', component: OrganizationListPage },
  { path: ':id', component: OrganizationDetailPage }
];
```

### 應用初始化配置

創建一個專門的應用初始化服務：

```typescript
// src/app/core/app-initializer.service.ts
import { Injectable } from '@angular/core';

// 從我們的架構導入
import { ConfigService } from './shared/services/config';
import { ThemeService } from './shared/services/theme';
import { I18nService } from './shared/i18n/services';

@Injectable({ providedIn: 'root' })
export class AppInitializerService {

  constructor(
    private configService: ConfigService,
    private themeService: ThemeService,
    private i18nService: I18nService
  ) {}

  async initialize(): Promise<void> {
    try {
      // 1. 載入應用配置
      await this.configService.loadConfig();

      // 2. 初始化主題
      await this.themeService.initialize();

      // 3. 初始化國際化
      await this.i18nService.initialize();

      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize application:', error);
      throw error;
    }
  }
}
```

然後在 `app.config.ts` 中使用：

```typescript
// src/app/app.config.ts
import { APP_INITIALIZER } from '@angular/core';
import { AppInitializerService } from './core/app-initializer.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... 其他配置

    // 應用初始化
    {
      provide: APP_INITIALIZER,
      useFactory: (appInitializer: AppInitializerService) =>
        () => appInitializer.initialize(),
      deps: [AppInitializerService],
      multi: true
    }
  ]
};
```

### 最終目錄結構

```
src/app/
├── app.component.ts          # ✅ Angular 根組件
├── app.component.html        # ✅ 根組件模板
├── app.component.scss        # ✅ 根組件樣式
├── app.config.ts            # ✅ 應用配置
├── app.routes.ts            # ✅ 路由配置
├── main.ts                  # ✅ 應用啟動文件
│
├── modules/                 # 🎯 功能聚合匯出層
│   ├── index.ts            # 統一匯出所有功能模組
│   └── *.module.ts      # 功能模組聚合
│
├── core/                   # 🎯 服務聚合匯出層
│   ├── index.ts           # 統一匯出所有核心服務
│   ├── services.ts        # 服務類聚合匯出
│   ├── guards.ts          # 守衛類聚合匯出
│   └── interceptors.ts    # 攔截器類聚合匯出
│
├── interface/             # 🖥️ 接口層
│   ├── components/        # UI組件
│   ├── pages/            # 頁面組件
│   ├── layouts/          # 佈局組件
│   ├── controllers/      # API控制器
│   ├── guards/           # 路由守衛
│   ├── interceptors/     # HTTP攔截器
│   ├── pipes/            # 數據管道
│   └── index.ts          # 統一匯出
│
├── application/          # 📋 應用層
│   ├── use-cases/        # 業務用例
│   ├── services/         # 應用服務
│   ├── commands/         # CQRS命令
│   ├── queries/          # CQRS查詢
│   ├── dto/              # 數據傳輸對象
│   ├── validators/       # 輸入驗證器
│   ├── mappers/          # 對象映射器
│   └── index.ts          # 統一匯出
│
├── domain/               # 🏛️ 領域層
│   ├── entities/         # 實體
│   ├── value-objects/    # 值對象
│   ├── aggregates/       # 聚合根
│   ├── repositories/     # 倉儲接口
│   ├── services/         # 領域服務
│   ├── events/           # 領域事件
│   ├── specifications/   # 規格模式
│   └── index.ts          # 統一匯出
│
├── infrastructure/       # 🔧 基礎設施層
│   ├── persistence/      # 數據持久化
│   ├── external-services/ # 外部服務
│   ├── messaging/        # 消息處理
│   ├── caching/          # 緩存實現
│   ├── logging/          # 日誌實現
│   ├── monitoring/       # 監控實現
│   ├── config/           # 配置管理
│   └── index.ts          # 統一匯出
│
├── security/             # 🔐 安全層
│   ├── authentication/   # 認證管理
│   ├── authorization/    # 授權管理
│   ├── encryption/       # 加密服務
│   ├── jwt/              # JWT處理
│   ├── audit/            # 安全審計
│   ├── validation/       # 安全驗證
│   ├── rate-limiting/    # 頻率限制
│   └── index.ts          # 統一匯出
│
└── shared/               # 🔄 共享層
    ├── constants/        # 常量定義
    ├── enums/            # 枚舉定義
    ├── interfaces/       # 接口定義
    ├── types/            # 類型定義
    ├── utils/            # 工具函數
    ├── decorators/       # 通用裝飾器
    ├── base/             # 基礎抽象類
    ├── i18n/             # 國際化
    ├── services/         # 共享服務
    └── index.ts          # 統一匯出
```

---

## 總結

這個分層架構設計具有以下特點：

### ✅ **優勢**
1. **職責清晰**：每一層都有明確的職責和邊界
2. **依賴簡單**：嚴格的依賴方向，避免循環依賴
3. **易於測試**：通過依賴注入和接口抽象便於單元測試
4. **便於維護**：模組化設計，統一的導出方式
5. **支援擴展**：新功能可以按層級逐步添加

### ⚠️ **注意事項**
1. **學習成本**：需要團隊理解分層架構概念
2. **初期複雜**：前期需要建立較多的抽象層
3. **過度設計**：小型項目可能過於複雜
4. **性能考量**：多層抽象可能影響性能

### 🎯 **適用場景**
- 中大型企業級應用
- 需要長期維護的項目
- 多人協作的團隊項目
- 業務邏輯複雜的系統

## 4. 實際使用範例

### 4.1 透過 Core 層匯入服務
```typescript
// 簡化前 - 需要記住具體路徑
import { UserDomainService } from './domain/services/user/user-domain.service';
import { AuthService } from './security/authentication/services/authentication.service';

// 簡化後 - 從核心層統一匯入
import { UserDomainService, AuthService } from './core';
```

### 4.2 透過 Modules 層匯入功能模組
```typescript
// app.routes.ts
import { UserModule, OrganizationModule } from './modules';

export const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => UserModule.routes()
  },
  {
    path: 'organizations',
    loadChildren: () => OrganizationModule.routes()
  }
];
```

### 4.3 功能模組的結構
```typescript
// modules/user.module.ts
export const UserModule = {
  // 實體和領域服務
  domain: () => import('../domain/entities/user'),

  // 應用用例
  useCases: () => import('../application/use-cases/user'),

  // 頁面組件
  pages: () => import('../interface/pages/user'),

  // 路由配置
  routes: () => import('../interface/pages/user/user.routes'),

  // 安全配置
  guards: () => import('../security/authorization/guards/user')
};
```

## 開發工作流程

### 新增功能的標準流程：

1. **Domain Layer**: 定義實體和業務規則
2. **Application Layer**: 編寫用例和服務
3. **Infrastructure Layer**: 實現數據存取
4. **Interface Layer**: 建立頁面和API
5. **Security Layer**: 配置權限控制（如需要）
6. **Core Layer**: 添加到服務匯出（如是核心服務）
7. **Modules Layer**: 建立功能模組聚合（如是完整功能）

## 架構驗證清單

✅ **依賴關係正確**: 每層只能依賴允許的層級
✅ **目錄結構對應**: 目錄名稱與架構層級完全對應
✅ **匯出聚合清晰**: Core和Modules層職責明確
✅ **實際可執行**: 符合Angular專案結構
✅ **開發友善**: 提供便利的匯入方式
