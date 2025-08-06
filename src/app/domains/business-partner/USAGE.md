# Business Partner Domain - 使用指南

## 如何訪問

### 1. 通過瀏覽器訪問
打開瀏覽器，訪問以下 URL：
```
http://localhost:4200/dashboard/business-partner
```

### 2. 通過菜單導航
在應用程序的主菜單中，點擊：
- **儀表板** → **業務夥伴**

## 功能特色

### 📋 聯絡人列表
- 顯示所有聯絡人
- 即時搜尋功能
- 聯絡人狀態標籤（啟用/停用）
- 點擊選擇聯絡人查看詳情

### 👤 聯絡人詳情
- 顯示選中聯絡人的完整資訊
- 編輯和刪除功能
- 聯絡人狀態管理

### ➕ 新增聯絡人
- 完整的表單驗證
- 必填欄位檢查
- 電子郵件格式驗證
- 電話號碼格式驗證

## 技術架構

### DDD 分層架構
```
business-partner/
├── domain/           # 領域層
│   ├── entities/     # 實體
│   ├── repositories/ # 儲存庫介面
│   ├── services/     # 領域服務
│   └── value-objects/# 值物件
├── application/      # 應用層
│   ├── dto/         # 資料傳輸物件
│   └── services/    # 應用服務
├── infrastructure/   # 基礎設施層
│   └── repositories/# 儲存庫實作
└── presentation/     # 表現層
    └── pages/       # 頁面元件
```

### 資料流程
1. **表現層** → 使用者操作觸發應用服務
2. **應用層** → 協調領域操作
3. **領域層** → 業務邏輯處理
4. **基礎設施層** → 資料持久化

## 開發說明

### 路由配置
路由已配置在 `src/app/routes/dashboard/routes.ts`：
```typescript
{ path: 'business-partner', component: ContactManagerComponent }
```

### 依賴注入
Providers 已註冊在 `src/app/app.config.ts`：
```typescript
...BUSINESS_PARTNER_PROVIDERS
```

### UI 框架
使用 ng-zorro-antd 組件庫：
- NzCardModule - 卡片容器
- NzGridModule - 網格佈局
- NzFormModule - 表單元件
- NzButtonModule - 按鈕元件
- NzInputModule - 輸入元件
- NzAvatarModule - 頭像元件
- NzTagModule - 標籤元件

## 測試

### 功能測試
1. 訪問 `/dashboard/business-partner`
2. 檢查聯絡人列表是否顯示
3. 測試搜尋功能
4. 測試聯絡人選擇
5. 測試新增聯絡人表單

### 開發測試
```bash
# 啟動開發服務器
yarn start

# 訪問測試頁面
http://localhost:4200/dashboard/business-partner
```

## 故障排除

### 常見問題
1. **路由無法訪問**
   - 檢查 `routes.ts` 配置
   - 確認組件已正確導入

2. **組件不顯示**
   - 檢查 ng-zorro-antd 模組導入
   - 確認 providers 已註冊

3. **API 錯誤**
   - 檢查 Firebase 配置
   - 確認網路連接

### 調試技巧
1. 打開瀏覽器開發者工具
2. 檢查 Console 錯誤訊息
3. 檢查 Network 標籤的 API 請求
4. 使用 Angular DevTools 檢查組件狀態

## 下一步

### 待實現功能
- [ ] 聯絡人編輯表單
- [ ] 批量操作功能
- [ ] 聯絡人匯入/匯出
- [ ] 進階搜尋篩選
- [ ] 聯絡人分類管理
- [ ] 聯絡人活動記錄

### 優化建議
- [ ] 添加單元測試
- [ ] 實現錯誤處理機制
- [ ] 添加載入狀態指示
- [ ] 實現離線支援
- [ ] 添加鍵盤快捷鍵
- [ ] 實現拖拽排序功能
