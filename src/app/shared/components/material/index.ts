/**
 * @fileoverview Angular Material和CDK組件統一導出檔案 (Angular Material & CDK Components Unified Export)
 * @description 存放所有Angular Material和CDK組件的統一導出檔案，這些是wrapper組件用於統一管理
 * @author NG-AC Team
 * @version 3.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Angular Material & CDK Wrapper Components
 * - 職責：Angular Material和CDK組件統一導出和管理
 * - 依賴：Angular Material、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放Angular Material和CDK組件的統一導出，不包含業務邏輯
 * - 所有組件都是wrapper組件，用於統一管理和導出
 * - 組件分類：
 *   Angular Material組件：
 *   1. 表單組件 (Form Components) - 11個
 *   2. 導航組件 (Navigation Components) - 6個
 *   3. 佈局組件 (Layout Components) - 11個
 *   4. 數據顯示組件 (Data Display Components) - 5個
 *   5. 按鈕和操作組件 (Button & Action Components) - 4個
 *   6. 反饋組件 (Feedback Components) - 3個
 *
 *   Angular CDK組件：
 *   1. 表格組件 (Table Components) - 7個
 *   2. 手風琴組件 (Accordion Components) - 2個
 *   3. 步驟器組件 (Stepper Components) - 2個
 *   4. 樹形組件 (Tree Components) - 3個
 *   5. 列表框組件 (Listbox Components) - 2個
 *   6. 對話框組件 (Dialog Components) - 2個
 *   7. 菜單組件 (Menu Components) - 3個
 *   8. 測試組件 (Testing Components) - 3個
 *   9. 其他工具組件 (Utility Components) - 2個
 */

// Angular Material組件 - 表單組件 (Form Components) - 11個
export * from './mat-autocomplete.component'; // 自動完成輸入框，支持搜索建議和選項過濾
export * from './mat-checkbox.component'; // 複選框，支持三種狀態：選中、未選中、部分選中
export * from './mat-datepicker.component'; // 日期選擇器，支持日期輸入和範圍選擇
export * from './mat-form-field.component'; // 表單字段容器，提供標籤、提示和錯誤顯示
export * from './mat-input.component'; // 文本輸入框，支持多種輸入類型和驗證
export * from './mat-optgroup.component'; // 選項分組，用於組織下拉選項
export * from './mat-option.component'; // 選項項目，用於下拉選擇和自動完成
export * from './mat-radio-button.component'; // 單選按鈕，支持單選組
export * from './mat-select.component'; // 下拉選擇框，支持單選和多選
export * from './mat-slide-toggle.component'; // 滑動開關，用於布爾值選擇
export * from './mat-slider.component'; // 滑塊，用於數值範圍選擇

// Angular Material組件 - 導航組件 (Navigation Components) - 6個
export * from './mat-menu-item.component'; // 菜單項目，用於下拉菜單和導航
export * from './mat-menu.component'; // 菜單容器，支持下拉和上下文菜單
export * from './mat-sidenav.component'; // 側邊導航欄，支持響應式佈局
export * from './mat-stepper.component'; // 步驟器，用於多步驟流程導航
export * from './mat-tabs.component'; // 標籤頁，用於內容分類和切換
export * from './mat-toolbar.component'; // 工具欄，用於頁面頂部導航和操作

// Angular Material組件 - 佈局組件 (Layout Components) - 11個
export * from './mat-action-list.component'; // 操作列表，用於顯示操作按鈕列表
export * from './mat-card-title-group.component'; // 卡片標題組，用於卡片頭部佈局
export * from './mat-card.component'; // 卡片容器，用於內容分組和展示
export * from './mat-divider.component'; // 分割線，用於視覺分隔
export * from './mat-expansion-panel.component'; // 展開面板，用於可折疊內容
export * from './mat-grid-list.component'; // 網格列表，用於響應式網格佈局
export * from './mat-grid-tile.component'; // 網格項目，用於網格列表中的單個項目
export * from './mat-list-item.component'; // 列表項目，用於列表中的單個項目
export * from './mat-list.component'; // 列表容器，用於顯示項目列表
export * from './mat-nav-list.component'; // 導航列表，用於導航菜單
export * from './mat-selection-list.component'; // 選擇列表，支持多選和單選

// Angular Material組件 - 數據顯示組件 (Data Display Components) - 5個
export * from './mat-chip-listbox.component'; // 標籤列表框，用於多選標籤
export * from './mat-chips.component'; // 標籤組件，用於展示選項和過濾
export * from './mat-table.component'; // 數據表格，支持排序、分頁和過濾
export * from './mat-text-column.component'; // 文本列，用於表格中的文本顯示
export * from './mat-tree.component'; // 樹形組件，用於層級數據展示

// Angular Material組件 - 按鈕和操作組件 (Button & Action Components) - 4個
export * from './mat-button-toggle.component'; // 按鈕切換組，支持單選和多選
export * from './mat-button.component'; // 按鈕組件，支持多種樣式和狀態
export * from './mat-fab.component'; // 浮動操作按鈕，用於主要操作
export * from './mat-icon-button.component'; // 圖標按鈕，用於工具操作

// Angular Material組件 - 反饋組件 (Feedback Components) - 3個
export * from './mat-dialog.component'; // 對話框，用於模態交互和確認
export * from './mat-snack-bar.component'; // 快照條，用於顯示簡短消息和通知
export * from './mat-tooltip.component'; // 工具提示，用於顯示額外信息

// Angular CDK組件 - 表格組件 (Table Components) - 7個
export * from './cdk-cell.component'; // 表格單元格，提供表格基礎功能
export * from './cdk-column-def.component'; // 列定義，用於配置表格列
export * from './cdk-footer-row.component'; // 頁腳行，用於表格底部內容
export * from './cdk-header-row.component'; // 表頭行，用於表格標題
export * from './cdk-row.component'; // 數據行，用於表格數據行
export * from './cdk-table.component'; // 表格基礎，提供無樣式表格功能
export * from './cdk-text-column.component'; // 文本列基礎，用於自定義列

// Angular CDK組件 - 手風琴組件 (Accordion Components) - 2個
export * from './cdk-accordion-item.component'; // 手風琴項目，用於可折疊內容
export * from './cdk-accordion.component'; // 手風琴容器，管理多個手風琴項目

// Angular CDK組件 - 步驟器組件 (Stepper Components) - 2個
export * from './cdk-step.component'; // 步驟項目，用於步驟器中的單個步驟
export * from './cdk-stepper.component'; // 步驟器基礎，提供步驟導航功能

// Angular CDK組件 - 樹形組件 (Tree Components) - 3個
export * from './cdk-tree-node-outlet.component'; // 樹節點出口，用於渲染樹節點
export * from './cdk-tree-node.component'; // 樹節點，用於樹形結構中的節點
export * from './cdk-tree.component'; // 樹形基礎，提供層級數據展示功能

// Angular CDK組件 - 列表框組件 (Listbox Components) - 2個
export * from './cdk-listbox.component'; // 列表框基礎，提供選擇列表功能
export * from './cdk-option.component'; // 選項基礎，用於列表框中的選項

// Angular CDK組件 - 對話框組件 (Dialog Components) - 2個
export * from './cdk-dialog-container.component'; // 對話框容器，提供對話框基礎功能
export * from './cdk-dialog.component'; // 對話框基礎，提供模態對話框功能

// Angular CDK組件 - 菜單組件 (Menu Components) - 3個
export * from './cdk-menu-item.component'; // 菜單項目基礎，提供菜單項目功能
export * from './cdk-menu-trigger.component'; // 菜單觸發器，用於觸發菜單顯示
export * from './cdk-menu.component'; // 菜單基礎，提供菜單容器功能

// Angular CDK組件 - 測試組件 (Testing Components) - 3個
export * from './cdk-harness.component'; // 測試工具，用於組件測試
export * from './cdk-testbed.component'; // 測試環境，提供測試基礎設施
export * from './cdk-testing.component'; // 測試組件，用於測試相關功能

// Angular CDK組件 - 其他工具組件 (Utility Components) - 2個
export * from './cdk-keycodes.component'; // 鍵碼工具，提供鍵盤事件處理
export * from './cdk-version.component'; // 版本信息，顯示CDK版本

