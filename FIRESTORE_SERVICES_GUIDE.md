# Firestore 服務架構指南

本文檔詳細說明了如何使用專案中的 Firestore 服務架構進行數據管理。

## 🏗️ 架構概覽

### 服務層次結構
```
src/app/core/services/firestore/
├── base-firestore.service.ts     # 基礎服務類
├── user.service.ts               # 用戶管理服務
├── article.service.ts            # 文章管理服務
├── category.service.ts           # 分類管理服務
├── comment.service.ts            # 評論管理服務
└── index.ts                      # 統一導出
```

## 🔧 基礎服務 (BaseFirestoreService)

所有 Firestore 服務都繼承自 `BaseFirestoreService`，提供統一的 CRUD 操作：

### 核心功能
- ✅ 創建文檔 (`create`, `createWithId`)
- ✅ 讀取文檔 (`getById`, `getAll`, `getPaginated`)
- ✅ 更新文檔 (`update`)
- ✅ 刪除文檔 (`delete`, `deleteBatch`)
- ✅ 查詢功能 (where, orderBy, limit, pagination)
- ✅ 自動時間戳 (`createdAt`, `updatedAt`)

### 基本使用方式

```typescript
import { BaseFirestoreService, BaseEntity } from '@core/services';

interface MyEntity extends BaseEntity {
  name: string;
  description: string;
}

@Injectable()
export class MyService extends BaseFirestoreService<MyEntity> {
  protected collectionName = 'my-collection';
}
```

## 👤 用戶服務 (UserService)

管理用戶資料的完整生命週期。

### 主要功能
- 用戶 CRUD 操作
- Firebase Auth 整合
- 角色和權限管理
- 用戶狀態管理

### 使用範例

```typescript
import { UserService } from '@core/services';

constructor(private userService: UserService) {}

// 根據 Firebase UID 獲取用戶
this.userService.getByUid('firebase-uid').subscribe(user => {
  console.log('用戶資料:', user);
});

// 創建或更新用戶（Firebase Auth 登入後）
this.userService.createOrUpdateFromAuth(firebaseUser).subscribe(uid => {
  console.log('用戶已創建/更新:', uid);
});

// 獲取活躍用戶
this.userService.getActiveUsers({ limit: 10 }).subscribe(users => {
  console.log('活躍用戶:', users);
});

// 根據角色獲取用戶
this.userService.getUsersByRole('admin').subscribe(admins => {
  console.log('管理員列表:', admins);
});
```

## 📝 文章服務 (ArticleService)

管理文章內容的發布和管理。

### 主要功能
- 文章 CRUD 操作
- 發布狀態管理
- 分類和標籤支援
- 統計數據追蹤

### 使用範例

```typescript
import { ArticleService } from '@core/services';

constructor(private articleService: ArticleService) {}

// 獲取已發布文章
this.articleService.getPublishedArticles({ limit: 10 }).subscribe(articles => {
  console.log('已發布文章:', articles);
});

// 根據分類獲取文章
this.articleService.getByCategory('category-id').subscribe(articles => {
  console.log('分類文章:', articles);
});

// 發布文章
this.articleService.publishArticle('article-id').subscribe(() => {
  console.log('文章已發布');
});

// 獲取精選文章
this.articleService.getFeaturedArticles(5).subscribe(articles => {
  console.log('精選文章:', articles);
});

// 增加瀏覽次數
this.articleService.incrementViewCount('article-id').subscribe(() => {
  console.log('瀏覽次數已增加');
});
```

## 📂 分類服務 (CategoryService)

管理文章分類的層級結構。

### 主要功能
- 分類 CRUD 操作
- 層級結構支援
- 樹狀結構構建
- 文章數量統計

### 使用範例

```typescript
import { CategoryService } from '@core/services';

constructor(private categoryService: CategoryService) {}

// 獲取根分類
this.categoryService.getRootCategories().subscribe(categories => {
  console.log('根分類:', categories);
});

// 獲取子分類
this.categoryService.getChildCategories('parent-id').subscribe(children => {
  console.log('子分類:', children);
});

// 獲取分類樹
this.categoryService.getCategoryTree().subscribe(tree => {
  console.log('分類樹:', tree);
});

// 創建分類（自動計算層級）
this.categoryService.createCategory({
  name: '新分類',
  slug: 'new-category',
  parentId: 'parent-id', // 可選
  isActive: true,
  isVisible: true,
  sortOrder: 0,
  articleCount: 0
}).subscribe(id => {
  console.log('分類已創建:', id);
});
```

## 💬 評論服務 (CommentService)

管理文章評論和回覆系統。

### 主要功能
- 評論 CRUD 操作
- 層級回覆支援
- 評論審核系統
- 統計數據追蹤

### 使用範例

```typescript
import { CommentService } from '@core/services';

constructor(private commentService: CommentService) {}

// 獲取文章評論
this.commentService.getByArticleId('article-id').subscribe(comments => {
  console.log('文章評論:', comments);
});

// 獲取評論樹狀結構
this.commentService.getCommentTree('article-id').subscribe(tree => {
  console.log('評論樹:', tree);
});

// 創建評論
this.commentService.createComment({
  articleId: 'article-id',
  articleTitle: '文章標題',
  authorName: '評論者',
  authorEmail: 'email@example.com',
  content: '評論內容',
  status: 'pending',
  likeCount: 0,
  dislikeCount: 0
}).subscribe(id => {
  console.log('評論已創建:', id);
});

// 批准評論
this.commentService.approveComment('comment-id', 'moderator-id').subscribe(() => {
  console.log('評論已批准');
});
```

## 🔍 查詢選項 (QueryOptions)

所有服務都支援統一的查詢選項：

```typescript
interface QueryOptions {
  where?: Array<{
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in';
    value: any;
  }>;
  orderBy?: Array<{
    field: string;
    direction?: 'asc' | 'desc';
  }>;
  limit?: number;
  startAfter?: DocumentSnapshot;
  endBefore?: DocumentSnapshot;
}
```

### 查詢範例

```typescript
// 複雜查詢範例
const options: QueryOptions = {
  where: [
    { field: 'status', operator: '==', value: 'published' },
    { field: 'viewCount', operator: '>', value: 100 }
  ],
  orderBy: [
    { field: 'publishedAt', direction: 'desc' }
  ],
  limit: 10
};

this.articleService.getAll(options).subscribe(articles => {
  console.log('查詢結果:', articles);
});
```

## 📄 分頁查詢

支援高效的分頁查詢：

```typescript
// 第一頁
this.articleService.getPaginated(10).subscribe(result => {
  console.log('第一頁數據:', result.data);
  console.log('是否有更多:', result.hasMore);
  
  if (result.hasMore && result.lastDoc) {
    // 獲取下一頁
    const nextPageOptions: QueryOptions = {
      startAfter: result.lastDoc,
      limit: 10
    };
    
    this.articleService.getAll(nextPageOptions).subscribe(nextPage => {
      console.log('下一頁數據:', nextPage);
    });
  }
});
```

## 🎯 實際使用範例

### 完整的文章管理流程

```typescript
@Component({...})
export class ArticleManagementComponent {
  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private userService: UserService
  ) {}

  async createArticle(articleData: any) {
    try {
      // 1. 創建文章
      const articleId = await this.articleService.create({
        title: articleData.title,
        content: articleData.content,
        slug: articleData.slug,
        authorId: articleData.authorId,
        authorName: articleData.authorName,
        categoryId: articleData.categoryId,
        tags: articleData.tags,
        status: 'draft',
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        allowComments: true,
        isFeatured: false,
        isSticky: false
      }).toPromise();

      // 2. 更新分類文章數量
      if (articleData.categoryId) {
        await this.categoryService.incrementArticleCount(articleData.categoryId).toPromise();
      }

      console.log('文章創建成功:', articleId);
      return articleId;
    } catch (error) {
      console.error('創建文章失敗:', error);
      throw error;
    }
  }

  async publishArticle(articleId: string) {
    try {
      await this.articleService.publishArticle(articleId).toPromise();
      console.log('文章發布成功');
    } catch (error) {
      console.error('發布文章失敗:', error);
      throw error;
    }
  }
}
```

## 🚀 範例頁面

訪問 `/dashboard/firestore-demo` 可以看到完整的 Firestore 服務使用範例，包含：

- ✅ 用戶管理操作
- ✅ 文章 CRUD 操作
- ✅ 分類管理
- ✅ 評論系統
- ✅ 實時數據更新

## 🔒 安全規則建議

在 Firestore 中設置適當的安全規則：

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用戶只能讀寫自己的資料
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 文章讀取公開，寫入需要認證
    match /articles/{articleId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 分類讀取公開，寫入需要管理員權限
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']);
    }
    
    // 評論需要認證才能操作
    match /comments/{commentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📈 性能優化建議

1. **索引優化**: 為常用查詢字段建立複合索引
2. **分頁查詢**: 使用 `startAfter` 和 `limit` 進行高效分頁
3. **數據結構**: 避免深層嵌套，考慮數據扁平化
4. **緩存策略**: 在組件中實現適當的數據緩存
5. **批量操作**: 使用 `deleteBatch` 進行批量刪除

## 🛠️ 擴展指南

要添加新的 Firestore 服務：

1. 繼承 `BaseFirestoreService`
2. 定義數據接口
3. 實現特定業務邏輯
4. 添加到 `firestore/index.ts`
5. 在組件中注入使用

```typescript
// 範例：通知服務
interface Notification extends BaseEntity {
  userId: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseFirestoreService<Notification> {
  protected collectionName = 'notifications';

  getUserNotifications(userId: string): Observable<Notification[]> {
    return this.getAll({
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });
  }

  markAsRead(notificationId: string): Observable<void> {
    return this.update(notificationId, { isRead: true } as any);
  }
}
```

這個 Firestore 服務架構提供了完整、可擴展的數據管理解決方案，支援複雜的業務邏輯和高效的數據操作。