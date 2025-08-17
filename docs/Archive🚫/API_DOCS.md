# 📡 API 文檔

## 📋 概述

本文檔定義了 ng-ac 企業級管理系統的 API 接口規範，包括用戶管理、產品管理、訂單管理等核心業務模組的 API 設計。

## 🔧 API 基礎信息

### 基礎配置
- **基礎 URL**: `https://api.example.com/api`
- **版本**: `v1`
- **協議**: `HTTPS`
- **數據格式**: `JSON`
- **字符編碼**: `UTF-8`

### 認證方式
- **認證類型**: `Bearer Token`
- **Header**: `Authorization: Bearer {token}`
- **Token 過期時間**: `24小時`

### 通用響應格式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  requestId: string;
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId: string;
}
```

### HTTP 狀態碼
- `200 OK`: 請求成功
- `201 Created`: 資源創建成功
- `400 Bad Request`: 請求參數錯誤
- `401 Unauthorized`: 未授權訪問
- `403 Forbidden`: 權限不足
- `404 Not Found`: 資源不存在
- `409 Conflict`: 資源衝突
- `422 Unprocessable Entity`: 請求格式正確但語義錯誤
- `500 Internal Server Error`: 服務器內部錯誤

## 👥 用戶管理 API

### 1. 獲取用戶列表

#### 請求信息
- **方法**: `GET`
- **路徑**: `/users`
- **認證**: 需要

#### 查詢參數
```typescript
interface GetUsersQuery {
  page?: number;           // 頁碼，默認 1
  size?: number;           // 每頁大小，默認 20，最大 100
  search?: string;         // 搜索關鍵詞（姓名、郵箱）
  role?: UserRole;         // 角色篩選
  status?: UserStatus;     // 狀態篩選
  sortBy?: string;         // 排序字段
  sortOrder?: 'asc' | 'desc'; // 排序方向，默認 asc
}
```

#### 響應格式
```typescript
interface GetUsersResponse {
  users: User[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  avatar?: string;
}

enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER'
}

enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}
```

#### 請求示例
```bash
GET /api/users?page=1&size=20&search=john&role=USER&status=ACTIVE
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 響應示例
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_001",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "USER",
        "status": "ACTIVE",
        "createdAt": "2024-08-16T10:00:00Z",
        "updatedAt": "2024-08-16T10:00:00Z",
        "lastLoginAt": "2024-08-16T09:30:00Z",
        "avatar": "https://example.com/avatars/john.jpg"
      }
    ],
    "pagination": {
      "page": 1,
      "size": 20,
      "total": 1,
      "totalPages": 1
    }
  },
  "message": "用戶列表獲取成功",
  "timestamp": "2024-08-16T10:00:00Z",
  "requestId": "req_001"
}
```

### 2. 創建用戶

#### 請求信息
- **方法**: `POST`
- **路徑**: `/users`
- **認證**: 需要
- **權限**: `CREATE_USER`

#### 請求體
```typescript
interface CreateUserRequest {
  name: string;            // 用戶姓名，必填，2-50字符
  email: string;           // 用戶郵箱，必填，有效郵箱格式
  role: UserRole;          // 用戶角色，必填
  password: string;        // 用戶密碼，必填，8-128字符
  status?: UserStatus;     // 用戶狀態，可選，默認 ACTIVE
  avatar?: string;         // 頭像URL，可選
  phone?: string;          // 手機號碼，可選
  department?: string;     // 部門，可選
  position?: string;       // 職位，可選
}
```

#### 響應格式
```typescript
interface CreateUserResponse {
  user: User;
  temporaryPassword?: string; // 如果未提供密碼，返回臨時密碼
}
```

#### 請求示例
```bash
POST /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "MANAGER",
  "password": "SecurePass123!",
  "department": "技術部",
  "position": "技術經理"
}
```

#### 響應示例
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_002",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "role": "MANAGER",
      "status": "ACTIVE",
      "createdAt": "2024-08-16T10:00:00Z",
      "updatedAt": "2024-08-16T10:00:00Z",
      "department": "技術部",
      "position": "技術經理"
    }
  },
  "message": "用戶創建成功",
  "timestamp": "2024-08-16T10:00:00Z",
  "requestId": "req_002"
}
```

### 3. 更新用戶

#### 請求信息
- **方法**: `PUT`
- **路徑**: `/users/{id}`
- **認證**: 需要
- **權限**: `UPDATE_USER` 或 `UPDATE_OWN_PROFILE`

#### 請求體
```typescript
interface UpdateUserRequest {
  name?: string;           // 用戶姓名，可選
  email?: string;          // 用戶郵箱，可選
  role?: UserRole;         // 用戶角色，可選
  status?: UserStatus;     // 用戶狀態，可選
  avatar?: string;         // 頭像URL，可選
  phone?: string;          // 手機號碼，可選
  department?: string;     // 部門，可選
  position?: string;       // 職位，可選
}
```

#### 響應格式
```typescript
interface UpdateUserResponse {
  user: User;
  changes: string[];       // 記錄哪些字段被修改
}
```

#### 請求示例
```bash
PUT /api/users/user_002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "SUSPENDED",
  "department": "產品部"
}
```

#### 響應示例
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_002",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "role": "MANAGER",
      "status": "SUSPENDED",
      "createdAt": "2024-08-16T10:00:00Z",
      "updatedAt": "2024-08-16T10:05:00Z",
      "department": "產品部",
      "position": "技術經理"
    },
    "changes": ["status", "department"]
  },
  "message": "用戶更新成功",
  "timestamp": "2024-08-16T10:05:00Z",
  "requestId": "req_003"
}
```

### 4. 刪除用戶

#### 請求信息
- **方法**: `DELETE`
- **路徑**: `/users/{id}`
- **認證**: 需要
- **權限**: `DELETE_USER`

#### 查詢參數
```typescript
interface DeleteUserQuery {
  force?: boolean;         // 是否強制刪除，默認 false
  reason?: string;         // 刪除原因，可選
}
```

#### 響應格式
```typescript
interface DeleteUserResponse {
  deletedUserId: string;
  deletedAt: string;
  reason?: string;
}
```

#### 請求示例
```bash
DELETE /api/users/user_003?force=true&reason=離職
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 響應示例
```json
{
  "success": true,
  "data": {
    "deletedUserId": "user_003",
    "deletedAt": "2024-08-16T10:10:00Z",
    "reason": "離職"
  },
  "message": "用戶刪除成功",
  "timestamp": "2024-08-16T10:10:00Z",
  "requestId": "req_004"
}
```

### 5. 批量操作

#### 批量更新用戶狀態

##### 請求信息
- **方法**: `PATCH`
- **路徑**: `/users/batch/status`
- **認證**: 需要
- **權限**: `UPDATE_USER`

##### 請求體
```typescript
interface BatchUpdateUserStatusRequest {
  userIds: string[];       // 用戶ID列表
  status: UserStatus;      // 新狀態
  reason?: string;         // 更新原因
}
```

##### 響應格式
```typescript
interface BatchUpdateUserStatusResponse {
  updatedCount: number;    // 成功更新的用戶數量
  failedUserIds: string[]; // 更新失敗的用戶ID列表
  reason?: string;         // 失敗原因
}
```

#### 批量刪除用戶

##### 請求信息
- **方法**: `DELETE`
- **路徑**: `/users/batch`
- **認證**: 需要
- **權限**: `DELETE_USER`

##### 請求體
```typescript
interface BatchDeleteUsersRequest {
  userIds: string[];       // 用戶ID列表
  force?: boolean;         // 是否強制刪除
  reason?: string;         // 刪除原因
}
```

## 🛍️ 產品管理 API

### 1. 獲取產品列表

#### 請求信息
- **方法**: `GET`
- **路徑**: `/products`
- **認證**: 需要

#### 查詢參數
```typescript
interface GetProductsQuery {
  page?: number;           // 頁碼
  size?: number;           // 每頁大小
  search?: string;         // 搜索關鍵詞
  category?: string;       // 分類篩選
  status?: ProductStatus;  // 狀態篩選
  minPrice?: number;       // 最低價格
  maxPrice?: number;       // 最高價格
  sortBy?: string;         // 排序字段
  sortOrder?: 'asc' | 'desc'; // 排序方向
}
```

#### 響應格式
```typescript
interface GetProductsResponse {
  products: Product[];
  pagination: Pagination;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: ProductStatus;
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED'
}
```

### 2. 創建產品

#### 請求信息
- **方法**: `POST`
- **路徑**: `/products`
- **認證**: 需要
- **權限**: `CREATE_PRODUCT`

#### 請求體
```typescript
interface CreateProductRequest {
  name: string;            // 產品名稱
  description: string;     // 產品描述
  price: number;           // 價格
  category: string;        // 分類
  stock: number;           // 庫存
  images?: string[];       // 圖片URL列表
  specifications?: Record<string, any>; // 規格參數
}
```

## 📊 訂單管理 API

### 1. 獲取訂單列表

#### 請求信息
- **方法**: `GET`
- **路徑**: `/orders`
- **認證**: 需要

#### 查詢參數
```typescript
interface GetOrdersQuery {
  page?: number;           // 頁碼
  size?: number;           // 每頁大小
  status?: OrderStatus;    // 訂單狀態
  userId?: string;         // 用戶ID
  startDate?: string;      // 開始日期
  endDate?: string;        // 結束日期
  minAmount?: number;      // 最低金額
  maxAmount?: number;      // 最高金額
}
```

#### 響應格式
```typescript
interface GetOrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippingAddress: Address;
  billingAddress: Address;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}
```

## 🔐 認證授權 API

### 1. 用戶登錄

#### 請求信息
- **方法**: `POST`
- **路徑**: `/auth/login`
- **認證**: 不需要

#### 請求體
```typescript
interface LoginRequest {
  email: string;           // 用戶郵箱
  password: string;        // 用戶密碼
  rememberMe?: boolean;    // 記住我
}
```

#### 響應格式
```typescript
interface LoginResponse {
  user: User;
  token: string;           // JWT Token
  refreshToken: string;    // 刷新Token
  expiresIn: number;       // Token過期時間（秒）
}
```

### 2. 刷新Token

#### 請求信息
- **方法**: `POST`
- **路徑**: `/auth/refresh`
- **認證**: 需要（使用refreshToken）

#### 請求體
```typescript
interface RefreshTokenRequest {
  refreshToken: string;    // 刷新Token
}
```

#### 響應格式
```typescript
interface RefreshTokenResponse {
  token: string;           // 新的JWT Token
  expiresIn: number;       // Token過期時間（秒）
}
```

### 3. 用戶登出

#### 請求信息
- **方法**: `POST`
- **路徑**: `/auth/logout`
- **認證**: 需要

#### 響應格式
```typescript
interface LogoutResponse {
  message: string;         // 登出成功消息
}
```

## 📈 統計報表 API

### 1. 儀表板統計

#### 請求信息
- **方法**: `GET`
- **路徑**: `/dashboard/stats`
- **認證**: 需要

#### 查詢參數
```typescript
interface GetDashboardStatsQuery {
  period?: 'today' | 'week' | 'month' | 'year'; // 統計週期
  startDate?: string;      // 開始日期
  endDate?: string;        // 結束日期
}
```

#### 響應格式
```typescript
interface DashboardStatsResponse {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    growthRate: number;
  };
  orderStats: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  productStats: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    topSellingProducts: Product[];
  };
  systemStats: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    activeSessions: number;
  };
}
```

## 🚨 錯誤處理

### 錯誤響應格式
```typescript
interface ApiError {
  success: false;
  error: {
    code: string;          // 錯誤代碼
    message: string;       // 錯誤消息
    details?: any;         // 詳細信息
    field?: string;        // 錯誤字段（驗證錯誤）
  };
  timestamp: string;
  requestId: string;
}
```

### 常見錯誤代碼
- `VALIDATION_ERROR`: 參數驗證錯誤
- `AUTHENTICATION_FAILED`: 認證失敗
- `AUTHORIZATION_FAILED`: 授權失敗
- `RESOURCE_NOT_FOUND`: 資源不存在
- `RESOURCE_CONFLICT`: 資源衝突
- `RATE_LIMIT_EXCEEDED`: 請求頻率超限
- `INTERNAL_SERVER_ERROR`: 服務器內部錯誤

### 錯誤響應示例
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "請求參數驗證失敗",
    "details": {
      "email": "郵箱格式不正確",
      "password": "密碼長度必須在8-128字符之間"
    },
    "field": "email"
  },
  "timestamp": "2024-08-16T10:00:00Z",
  "requestId": "req_005"
}
```

## 📝 請求限制

### 頻率限制
- **普通用戶**: 1000 請求/小時
- **管理員**: 5000 請求/小時
- **API Key**: 10000 請求/小時

### 請求大小限制
- **GET 請求**: 無限制
- **POST/PUT 請求**: 最大 10MB
- **文件上傳**: 最大 100MB

### 響應時間
- **簡單查詢**: < 100ms
- **複雜查詢**: < 500ms
- **文件上傳**: < 30s

## 🔧 開發工具

### API 測試
- **Swagger UI**: `https://api.example.com/api/docs`
- **Postman Collection**: 可下載的 Postman 集合文件
- **API 測試環境**: `https://test-api.example.com/api`

### SDK 和客戶端
- **JavaScript/TypeScript**: NPM 包 `@example/api-client`
- **Python**: PyPI 包 `example-api-client`
- **Java**: Maven 依賴 `com.example:api-client`

### 監控和日誌
- **API 監控**: 實時 API 性能監控
- **錯誤追蹤**: 詳細的錯誤日誌和堆棧信息
- **使用統計**: API 調用頻率和成功率統計

---

**文檔版本**: 1.0.0
**最後更新**: 2024年8月
**維護者**: AI Assistant


