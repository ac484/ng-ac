/**
 * 分類管理服務
 * 
 * 管理文章分類的 CRUD 操作
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFirestoreService, BaseEntity, QueryOptions } from './base-firestore.service';

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  
  // 層級結構
  parentId?: string;
  level: number;
  path: string; // 例如: "parent/child/grandchild"
  
  // 顯示設定
  color?: string;
  icon?: string;
  image?: string;
  
  // 狀態管理
  isActive: boolean;
  isVisible: boolean;
  
  // 排序
  sortOrder: number;
  
  // 統計資料
  articleCount: number;
  
  // SEO 相關
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseFirestoreService<Category> {
  protected collectionName = 'categories';

  /**
   * 根據 slug 獲取分類
   */
  getBySlug(slug: string): Observable<Category | null> {
    return this.getAll({
      where: [{ field: 'slug', operator: '==', value: slug }],
      limit: 1
    }).pipe(
      map(categories => categories.length > 0 ? categories[0] : null)
    );
  }

  /**
   * 獲取根分類（頂層分類）
   */
  getRootCategories(): Observable<Category[]> {
    return this.getAll({
      where: [
        { field: 'level', operator: '==', value: 0 },
        { field: 'isActive', operator: '==', value: true }
      ],
      orderBy: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' }
      ]
    });
  }

  /**
   * 根據父分類 ID 獲取子分類
   */
  getChildCategories(parentId: string): Observable<Category[]> {
    return this.getAll({
      where: [
        { field: 'parentId', operator: '==', value: parentId },
        { field: 'isActive', operator: '==', value: true }
      ],
      orderBy: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' }
      ]
    });
  }

  /**
   * 獲取指定層級的分類
   */
  getCategoriesByLevel(level: number): Observable<Category[]> {
    return this.getAll({
      where: [
        { field: 'level', operator: '==', value: level },
        { field: 'isActive', operator: '==', value: true }
      ],
      orderBy: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' }
      ]
    });
  }

  /**
   * 獲取可見的分類
   */
  getVisibleCategories(): Observable<Category[]> {
    return this.getAll({
      where: [
        { field: 'isVisible', operator: '==', value: true },
        { field: 'isActive', operator: '==', value: true }
      ],
      orderBy: [
        { field: 'level', direction: 'asc' },
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' }
      ]
    });
  }

  /**
   * 獲取樹狀結構的分類
   */
  getCategoryTree(): Observable<Category[]> {
    return this.getAll({
      where: [
        { field: 'isActive', operator: '==', value: true }
      ],
      orderBy: [
        { field: 'level', direction: 'asc' },
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' }
      ]
    }).pipe(
      map(categories => this.buildCategoryTree(categories))
    );
  }

  /**
   * 建構分類樹狀結構
   */
  private buildCategoryTree(categories: Category[]): Category[] {
    const categoryMap = new Map<string, Category & { children?: Category[] }>();
    const rootCategories: (Category & { children?: Category[] })[] = [];

    // 建立 Map 以便快速查找
    categories.forEach(category => {
      categoryMap.set(category.id!, { ...category, children: [] });
    });

    // 建構樹狀結構
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id!)!;
      
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId)!;
        parent.children!.push(categoryWithChildren);
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  }

  /**
   * 創建分類（自動計算層級和路徑）
   */
  createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'level' | 'path'>): Observable<string> {
    return new Observable(observer => {
      if (data.parentId) {
        // 如果有父分類，先獲取父分類資訊
        this.getById(data.parentId).subscribe(parent => {
          if (parent) {
            const categoryData = {
              ...data,
              level: parent.level + 1,
              path: `${parent.path}/${data.slug}`
            };
            
            this.create(categoryData).subscribe(
              id => observer.next(id),
              error => observer.error(error)
            );
          } else {
            observer.error(new Error('Parent category not found'));
          }
        });
      } else {
        // 根分類
        const categoryData = {
          ...data,
          level: 0,
          path: data.slug
        };
        
        this.create(categoryData).subscribe(
          id => observer.next(id),
          error => observer.error(error)
        );
      }
    });
  }

  /**
   * 更新分類文章數量
   */
  updateArticleCount(categoryId: string, count: number): Observable<void> {
    return this.update(categoryId, {
      articleCount: count
    } as any);
  }

  /**
   * 增加分類文章數量
   */
  incrementArticleCount(categoryId: string): Observable<void> {
    return this.getById(categoryId).pipe(
      map(category => {
        if (category) {
          return this.update(categoryId, {
            articleCount: (category.articleCount || 0) + 1
          } as any);
        }
        throw new Error('Category not found');
      })
    ) as any;
  }

  /**
   * 減少分類文章數量
   */
  decrementArticleCount(categoryId: string): Observable<void> {
    return this.getById(categoryId).pipe(
      map(category => {
        if (category) {
          const newCount = Math.max(0, (category.articleCount || 0) - 1);
          return this.update(categoryId, {
            articleCount: newCount
          } as any);
        }
        throw new Error('Category not found');
      })
    ) as any;
  }

  /**
   * 啟用/停用分類
   */
  toggleStatus(categoryId: string, isActive: boolean): Observable<void> {
    return this.update(categoryId, {
      isActive
    } as any);
  }

  /**
   * 設定分類可見性
   */
  setVisibility(categoryId: string, isVisible: boolean): Observable<void> {
    return this.update(categoryId, {
      isVisible
    } as any);
  }

  /**
   * 更新分類排序
   */
  updateSortOrder(categoryId: string, sortOrder: number): Observable<void> {
    return this.update(categoryId, {
      sortOrder
    } as any);
  }

  /**
   * 搜尋分類
   */
  searchCategories(searchTerm: string): Observable<Category[]> {
    return this.getAll({
      where: [
        { field: 'name', operator: '>=', value: searchTerm },
        { field: 'name', operator: '<=', value: searchTerm + '\uf8ff' },
        { field: 'isActive', operator: '==', value: true }
      ],
      orderBy: [
        { field: 'name', direction: 'asc' }
      ]
    });
  }

  /**
   * 獲取熱門分類（根據文章數量）
   */
  getPopularCategories(limit: number = 10): Observable<Category[]> {
    return this.getAll({
      where: [
        { field: 'isActive', operator: '==', value: true },
        { field: 'isVisible', operator: '==', value: true }
      ],
      orderBy: [
        { field: 'articleCount', direction: 'desc' }
      ],
      limit
    });
  }
}