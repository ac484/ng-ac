/**
 * 文章管理服務
 * 
 * 管理文章/內容的 CRUD 操作
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFirestoreService, BaseEntity, QueryOptions } from './base-firestore.service';

export interface Article extends BaseEntity {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  
  // 作者資訊
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  
  // 分類和標籤
  categoryId?: string;
  categoryName?: string;
  tags: string[];
  
  // 狀態管理
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  
  // SEO 相關
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  
  // 統計資料
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  
  // 媒體資源
  featuredImage?: string;
  images?: string[];
  
  // 其他設定
  allowComments: boolean;
  isFeatured: boolean;
  isSticky: boolean;
  
  // 排序權重
  sortOrder?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService extends BaseFirestoreService<Article> {
  protected collectionName = 'articles';

  /**
   * 根據 slug 獲取文章
   */
  getBySlug(slug: string): Observable<Article | null> {
    return this.getAll({
      where: [{ field: 'slug', operator: '==', value: slug }],
      limit: 1
    }).pipe(
      map(articles => articles.length > 0 ? articles[0] : null)
    );
  }

  /**
   * 獲取已發布的文章
   */
  getPublishedArticles(options?: QueryOptions): Observable<Article[]> {
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        ...(options?.where || []),
        { field: 'status', operator: '==', value: 'published' }
      ],
      orderBy: [
        { field: 'publishedAt', direction: 'desc' },
        ...(options?.orderBy || [])
      ]
    };

    return this.getAll(queryOptions);
  }

  /**
   * 根據作者獲取文章
   */
  getByAuthor(authorId: string, options?: QueryOptions): Observable<Article[]> {
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        ...(options?.where || []),
        { field: 'authorId', operator: '==', value: authorId }
      ],
      orderBy: [
        { field: 'createdAt', direction: 'desc' },
        ...(options?.orderBy || [])
      ]
    };

    return this.getAll(queryOptions);
  }

  /**
   * 根據分類獲取文章
   */
  getByCategory(categoryId: string, options?: QueryOptions): Observable<Article[]> {
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        ...(options?.where || []),
        { field: 'categoryId', operator: '==', value: categoryId },
        { field: 'status', operator: '==', value: 'published' }
      ],
      orderBy: [
        { field: 'publishedAt', direction: 'desc' },
        ...(options?.orderBy || [])
      ]
    };

    return this.getAll(queryOptions);
  }

  /**
   * 根據標籤獲取文章
   */
  getByTag(tag: string, options?: QueryOptions): Observable<Article[]> {
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        ...(options?.where || []),
        { field: 'tags', operator: 'array-contains', value: tag },
        { field: 'status', operator: '==', value: 'published' }
      ],
      orderBy: [
        { field: 'publishedAt', direction: 'desc' },
        ...(options?.orderBy || [])
      ]
    };

    return this.getAll(queryOptions);
  }

  /**
   * 獲取精選文章
   */
  getFeaturedArticles(limit: number = 5): Observable<Article[]> {
    return this.getAll({
      where: [
        { field: 'isFeatured', operator: '==', value: true },
        { field: 'status', operator: '==', value: 'published' }
      ],
      orderBy: [
        { field: 'publishedAt', direction: 'desc' }
      ],
      limit
    });
  }

  /**
   * 獲取置頂文章
   */
  getStickyArticles(): Observable<Article[]> {
    return this.getAll({
      where: [
        { field: 'isSticky', operator: '==', value: true },
        { field: 'status', operator: '==', value: 'published' }
      ],
      orderBy: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'publishedAt', direction: 'desc' }
      ]
    });
  }

  /**
   * 搜尋文章
   */
  searchArticles(searchTerm: string, options?: QueryOptions): Observable<Article[]> {
    // 注意：這是簡單的前綴搜尋，生產環境建議使用專門的搜尋服務
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        ...(options?.where || []),
        { field: 'title', operator: '>=', value: searchTerm },
        { field: 'title', operator: '<=', value: searchTerm + '\uf8ff' },
        { field: 'status', operator: '==', value: 'published' }
      ]
    };

    return this.getAll(queryOptions);
  }

  /**
   * 發布文章
   */
  publishArticle(id: string): Observable<void> {
    return this.update(id, {
      status: 'published',
      publishedAt: new Date()
    } as any);
  }

  /**
   * 取消發布文章
   */
  unpublishArticle(id: string): Observable<void> {
    return this.update(id, {
      status: 'draft'
    } as any);
  }

  /**
   * 歸檔文章
   */
  archiveArticle(id: string): Observable<void> {
    return this.update(id, {
      status: 'archived'
    } as any);
  }

  /**
   * 增加瀏覽次數
   */
  incrementViewCount(id: string): Observable<void> {
    // 注意：在實際應用中，應該使用 Firestore 的 increment 操作
    return this.getById(id).pipe(
      map(article => {
        if (article) {
          return this.update(id, {
            viewCount: (article.viewCount || 0) + 1
          } as any);
        }
        throw new Error('Article not found');
      })
    ) as any;
  }

  /**
   * 增加點讚次數
   */
  incrementLikeCount(id: string): Observable<void> {
    return this.getById(id).pipe(
      map(article => {
        if (article) {
          return this.update(id, {
            likeCount: (article.likeCount || 0) + 1
          } as any);
        }
        throw new Error('Article not found');
      })
    ) as any;
  }

  /**
   * 設定精選狀態
   */
  setFeatured(id: string, isFeatured: boolean): Observable<void> {
    return this.update(id, {
      isFeatured
    } as any);
  }

  /**
   * 設定置頂狀態
   */
  setSticky(id: string, isSticky: boolean, sortOrder?: number): Observable<void> {
    const updateData: any = { isSticky };
    if (sortOrder !== undefined) {
      updateData.sortOrder = sortOrder;
    }
    
    return this.update(id, updateData);
  }

  /**
   * 獲取熱門文章（根據瀏覽次數）
   */
  getPopularArticles(limit: number = 10): Observable<Article[]> {
    return this.getAll({
      where: [
        { field: 'status', operator: '==', value: 'published' }
      ],
      orderBy: [
        { field: 'viewCount', direction: 'desc' }
      ],
      limit
    });
  }

  /**
   * 獲取最新文章
   */
  getLatestArticles(limit: number = 10): Observable<Article[]> {
    return this.getAll({
      where: [
        { field: 'status', operator: '==', value: 'published' }
      ],
      orderBy: [
        { field: 'publishedAt', direction: 'desc' }
      ],
      limit
    });
  }
}