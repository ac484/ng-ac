# 🚀 部署指南

## 📋 概述

本文檔提供了 ng-ac 企業級管理系統的完整部署指南，包括開發環境、測試環境和生產環境的配置、構建和部署流程。

## 🏗️ 環境架構

### 環境分類
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   開發環境      │    │   測試環境      │    │   生產環境      │
│   Development   │    │   Testing       │    │   Production    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ 本地開發        │    │ 功能測試        │    │ 正式上線        │
│ 單元測試        │    │ 集成測試        │    │ 性能監控        │
│ 代碼審查        │    │ 用戶驗收        │    │ 錯誤追蹤        │
│ 熱重載          │    │ 數據隔離        │    │ 高可用性        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 環境配置對比
| 配置項 | 開發環境 | 測試環境 | 生產環境 |
|--------|----------|----------|----------|
| **API URL** | `http://localhost:3000/api` | `https://test-api.example.com/api` | `https://api.example.com/api` |
| **環境變量** | `development` | `testing` | `production` |
| **日誌級別** | `debug` | `info` | `warn` |
| **調試模式** | `true` | `false` | `false` |
| **緩存策略** | 無緩存 | 輕量緩存 | 完整緩存 |
| **錯誤處理** | 詳細錯誤 | 標準錯誤 | 簡化錯誤 |

## 🔧 開發環境配置

### 1. 系統要求
- **Node.js**: 18.0.0 或更高版本
- **npm**: 9.0.0 或更高版本
- **pnpm**: 8.0.0 或更高版本（推薦）
- **Git**: 2.30.0 或更高版本
- **Angular CLI**: 20.0.0 或更高版本

### 2. 環境變量配置
```bash
# .env.development
NODE_ENV=development
API_BASE_URL=http://localhost:3000/api
ENABLE_DEBUG=true
LOG_LEVEL=debug
ENABLE_HOT_RELOAD=true
ENABLE_SOURCE_MAPS=true
```

### 3. 開發服務器啟動
```bash
# 安裝依賴
pnpm install

# 啟動開發服務器
pnpm start

# 或使用 Angular CLI
ng serve --configuration=development
```

### 4. 開發工具配置
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "typescript",
    "html"
  ]
}
```

## 🧪 測試環境配置

### 1. 測試環境部署
```bash
# 構建測試版本
pnpm build:test

# 部署到測試服務器
pnpm deploy:test
```

### 2. 測試環境配置
```typescript
// src/environments/environment.test.ts
export const environment = {
  production: false,
  testing: true,
  apiUrl: 'https://test-api.example.com/api',
  enableDebug: false,
  logLevel: 'info',
  enableAnalytics: false,
  enableErrorReporting: true,
  version: '1.0.0-test'
};
```

### 3. 測試數據管理
```typescript
// 測試數據配置
export const TEST_DATA_CONFIG = {
  users: {
    admin: {
      email: 'admin@test.com',
      password: 'TestPass123!',
      role: 'ADMIN'
    },
    manager: {
      email: 'manager@test.com',
      password: 'TestPass123!',
      role: 'MANAGER'
    }
  },
  products: {
    sampleProduct: {
      name: '測試產品',
      price: 99.99,
      category: '測試分類'
    }
  }
};
```

## 🚀 生產環境部署

### 1. 構建配置
```json
// angular.json
{
  "projects": {
    "ng-ac": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "6kb",
                  "maximumError": "10kb"
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

### 2. 生產構建
```bash
# 生產環境構建
pnpm build:prod

# 或使用 Angular CLI
ng build --configuration=production
```

### 3. 環境變量配置
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  testing: false,
  apiUrl: 'https://api.example.com/api',
  enableDebug: false,
  logLevel: 'warn',
  enableAnalytics: true,
  enableErrorReporting: true,
  version: '1.0.0',
  buildTime: '2024-08-16T10:00:00Z'
};
```

## 🐳 Docker 部署

### 1. Dockerfile
```dockerfile
# 多階段構建 Dockerfile
FROM node:18-alpine AS builder

# 設置工作目錄
WORKDIR /app

# 複製 package 文件
COPY package*.json pnpm-lock.yaml ./

# 安裝 pnpm
RUN npm install -g pnpm

# 安裝依賴
RUN pnpm install --frozen-lockfile

# 複製源代碼
COPY . .

# 構建應用
RUN pnpm build:prod

# 生產階段
FROM nginx:alpine

# 複製構建產物
COPY --from=builder /app/dist/ng-ac/browser /usr/share/nginx/html

# 複製 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  ng-ac:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - ng-ac-network

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx/ssl:/etc/nginx/ssl
      - ./nginx/conf.d:/etc/nginx/conf.d
    depends_on:
      - ng-ac
    restart: unless-stopped
    networks:
      - ng-ac-network

networks:
  ng-ac-network:
    driver: bridge
```

### 3. Nginx 配置
```nginx
# nginx.conf
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip 壓縮
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 靜態資源緩存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Angular 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## ☁️ 雲端部署

### 1. AWS 部署
```yaml
# .github/workflows/deploy-aws.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build:prod

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1

    - name: Deploy to S3
      run: |
        aws s3 sync dist/ng-ac/browser s3://${{ secrets.S3_BUCKET }} --delete

    - name: Invalidate CloudFront
      run: |
        aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

### 2. Azure 部署
```yaml
# .github/workflows/deploy-azure.yml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build:prod

    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'ng-ac-app'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: dist/ng-ac/browser
```

### 3. Google Cloud 部署
```yaml
# .github/workflows/deploy-gcp.yml
name: Deploy to Google Cloud

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build:prod

    - name: Setup Google Cloud
      uses: google-github-actions/setup-gcloud@v0
      with:
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        project_id: ${{ secrets.GCP_PROJECT_ID }}

    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy ng-ac-app \
          --source dist/ng-ac/browser \
          --platform managed \
          --region us-central1 \
          --allow-unauthenticated
```

## 📊 監控與維護

### 1. 性能監控
```typescript
// 性能監控服務
@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitoringService {
  private readonly performanceObserver: PerformanceObserver;

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

### 2. 錯誤追蹤
```typescript
// 錯誤追蹤服務
@Injectable({
  providedIn: 'root'
})
export class ErrorTrackingService {
  constructor() {
    this.setupGlobalErrorHandling();
  }

  private setupGlobalErrorHandling(): void {
    // 捕獲未處理的 Promise 錯誤
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('unhandled_promise_rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });

    // 捕獲全局 JavaScript 錯誤
    window.addEventListener('error', (event) => {
      this.trackError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });
  }

  trackError(type: string, error: any): void {
    const errorData = {
      type,
      error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId()
    };

    // 發送錯誤信息到錯誤追蹤服務
    this.sendErrorToService(errorData);
  }

  private sendErrorToService(errorData: any): void {
    // 實現錯誤發送邏輯
    console.error('Error tracked:', errorData);
  }

  private getCurrentUserId(): string | null {
    // 獲取當前用戶ID
    return localStorage.getItem('userId');
  }
}
```

### 3. 健康檢查
```typescript
// 健康檢查服務
@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private readonly healthCheckInterval = 30000; // 30秒
  private healthCheckTimer: any;

  constructor() {
    this.startHealthCheck();
  }

  private startHealthCheck(): void {
    this.healthCheckTimer = setInterval(() => {
      this.performHealthCheck();
    }, this.healthCheckInterval);
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const response = await fetch('/api/health');
      const healthStatus = await response.json();

      if (healthStatus.status === 'healthy') {
        console.log('System health check passed');
      } else {
        console.warn('System health check failed:', healthStatus);
        this.handleHealthCheckFailure(healthStatus);
      }
    } catch (error) {
      console.error('Health check error:', error);
      this.handleHealthCheckFailure({ error: error.message });
    }
  }

  private handleHealthCheckFailure(status: any): void {
    // 處理健康檢查失敗
    // 可以發送警報、記錄日誌等
  }

  ngOnDestroy(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
  }
}
```

## 🔒 安全配置

### 1. 安全頭部配置
```typescript
// 安全配置服務
@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  constructor() {
    this.setupSecurityHeaders();
  }

  private setupSecurityHeaders(): void {
    // 設置 CSP (Content Security Policy)
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://api.example.com;
      frame-ancestors 'none';
    `;
    document.head.appendChild(cspMeta);
  }
}
```

### 2. 環境變量安全
```bash
# 生產環境變量文件 (.env.production)
NODE_ENV=production
API_BASE_URL=https://api.example.com/api
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-encryption-key
DATABASE_URL=your-database-connection-string
REDIS_URL=your-redis-connection-string
```

## 📈 部署後檢查清單

### 功能檢查
- [ ] 頁面加載正常
- [ ] 路由導航正常
- [ ] API 接口正常
- [ ] 用戶認證正常
- [ ] 權限控制正常
- [ ] 數據操作正常

### 性能檢查
- [ ] 首屏加載時間 < 2秒
- [ ] 頁面切換時間 < 500ms
- [ ] API 響應時間 < 1秒
- [ ] 資源加載正常
- [ ] 緩存策略生效

### 安全檢查
- [ ] HTTPS 證書有效
- [ ] 安全頭部配置正確
- [ ] 認證機制正常
- [ ] 權限驗證正常
- [ ] 敏感信息未暴露

### 監控檢查
- [ ] 錯誤追蹤正常
- [ ] 性能監控正常
- [ ] 日誌記錄正常
- [ ] 健康檢查正常
- [ ] 警報機制正常

## 🚨 故障排除

### 常見問題及解決方案

#### 1. 構建失敗
```bash
# 清理緩存
rm -rf node_modules
rm -rf dist
pnpm install
pnpm build:prod
```

#### 2. 部署失敗
```bash
# 檢查環境變量
echo $NODE_ENV
echo $API_BASE_URL

# 檢查權限
ls -la dist/
chmod -R 755 dist/
```

#### 3. 運行時錯誤
```bash
# 檢查日誌
tail -f /var/log/nginx/error.log
tail -f /var/log/application.log

# 檢查服務狀態
systemctl status nginx
systemctl status application
```

---

**文檔版本**: 1.0.0
**最後更新**: 2024年8月
**維護者**: AI Assistant


