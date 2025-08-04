# Principal 組件

## 概述

Principal 組件使用 ng-zorro-antd (VAN) 的預設樣式，無需自定義 CSS。

## 組件結構

```
principal/
├── principal-page.component.ts          # 主頁面組件
├── principal-page.component.html        # 主頁面模板
├── principal-list.component.ts          # 列表組件
├── principal-list.component.html        # 列表模板
├── principal-workflow.component.ts      # 工作流組件
├── principal-workflow.component.html    # 工作流模板
├── principal-form.component.ts          # 表單組件
├── principal-form.component.html        # 表單模板
├── principal-contact.component.ts       # 聯絡人組件
├── principal-contact.component.html     # 聯絡人模板
└── README.md                           # 說明文檔
```

## 設計原則

- ✅ 使用 VAN 組件預設樣式
- ✅ 無自定義 CSS 文件
- ✅ 響應式設計
- ✅ 組件化架構
- ✅ 類型安全

## 主要功能

- **Principal 管理**: 新增、編輯、刪除 Principal
- **聯絡人管理**: 套崁子表格管理聯絡人
- **請款流程編輯**: 動態編輯工作流程
- **左右分欄佈局**: 使用 nz-splitter 組件

## 技術特點

- 基於 ng-zorro-antd 組件庫
- 使用 Angular 響應式表單
- 遵循 DDD 架構原則
- 支持響應式設計 