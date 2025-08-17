/**
 * @ai-context {
 *   "role": "Infrastructure/Repository",
 *   "purpose": "Angular Firebase基礎服務-數據持久化基礎實現",
 *   "constraints": ["實現領域接口", "技術細節封裝", "錯誤處理", "Angular依賴注入"],
 *   "dependencies": ["@angular/core", "@angular/fire", "BaseQueryOptions", "PaginationOptions"],
 *   "security": "high",
 *   "lastmod": "2024-12-19"
 * }
 * @usage inject(BaseFirebaseService) in components or other services
 * @see docs/architecture/infrastructure.md
 */

import { Injectable } from '@angular/core';
import {
    DocumentData,
    Firestore,
    QueryDocumentSnapshot,
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    startAfter,
    updateDoc,
    where,
    writeBatch
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { BaseQueryOptions, PaginationOptions } from './types';

@Injectable({
  providedIn: 'root'
})
export class BaseFirebaseService<T extends DocumentData> {
  protected collectionName: string;

  constructor(
    protected firestore: Firestore,
    collectionName: string
  ) {
    this.collectionName = collectionName;
  }

  // 獲取集合引用
  protected getCollectionRef() {
    return collection(this.firestore, this.collectionName);
  }

  // 獲取文檔引用
  protected getDocRef(id: string) {
    return doc(this.firestore, this.collectionName, id);
  }

  // 轉換Firestore時間戳
  protected convertTimestamps(data: DocumentData): T {
    const converted = { ...data };

    // 遞歸轉換所有時間戳字段
    const convertField = (obj: any): any => {
      if (obj === null || obj === undefined) return obj;

      if (obj instanceof Timestamp) {
        return obj.toDate();
      }

      if (Array.isArray(obj)) {
        return obj.map(convertField);
      }

      if (typeof obj === 'object') {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = convertField(value);
        }
        return result;
      }

      return obj;
    };

    return convertField(converted) as T;
  }

  // 獲取所有文檔 (Observable)
  getAll(options?: BaseQueryOptions): Observable<T[]> {
    return from(this.getAllAsync(options));
  }

  // 獲取所有文檔 (Promise)
  async getAllAsync(options?: BaseQueryOptions): Promise<T[]> {
    try {
      let q = query(this.getCollectionRef());

      if (options?.where) {
        options.where.forEach(({ field, operator, value }) => {
          q = query(q, where(field, operator, value));
        });
      }

      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
      }

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertTimestamps(doc.data())
      })) as T[];
    } catch (error) {
      console.error(`Error fetching ${this.collectionName}:`, error);
      throw new Error(`Failed to fetch ${this.collectionName}`);
    }
  }

  // 分頁獲取文檔 (Observable)
  getPaginated(options: PaginationOptions): Observable<{
    data: T[];
    hasNextPage: boolean;
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  }> {
    return from(this.getPaginatedAsync(options));
  }

  // 分頁獲取文檔 (Promise)
  async getPaginatedAsync(options: PaginationOptions): Promise<{
    data: T[];
    hasNextPage: boolean;
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  }> {
    try {
      let q = query(this.getCollectionRef());

      if (options.where) {
        options.where.forEach(({ field, operator, value }) => {
          q = query(q, where(field, operator, value));
        });
      }

      if (options.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
      }

      if (options.startAfter) {
        q = query(q, startAfter(options.startAfter));
      }

      q = query(q, limit(options.pageSize + 1)); // 多取一個來判斷是否有下一頁

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs;
      const hasNextPage = docs.length > options.pageSize;

      // 如果有多餘的文檔，移除最後一個
      const data = hasNextPage ? docs.slice(0, -1) : docs;
      const lastDoc = hasNextPage ? docs[docs.length - 2] : null;

      return {
        data: data.map(doc => ({
          id: doc.id,
          ...this.convertTimestamps(doc.data())
        })) as T[],
        hasNextPage,
        lastDoc
      };
    } catch (error) {
      console.error(`Error fetching paginated ${this.collectionName}:`, error);
      throw new Error(`Failed to fetch paginated ${this.collectionName}`);
    }
  }

  // 根據ID獲取單個文檔 (Observable)
  getById(id: string): Observable<T | null> {
    return from(this.getByIdAsync(id));
  }

  // 根據ID獲取單個文檔 (Promise)
  async getByIdAsync(id: string): Promise<T | null> {
    try {
      const docRef = this.getDocRef(id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...this.convertTimestamps(docSnap.data())
        } as T;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching ${this.collectionName} with id ${id}:`, error);
      throw new Error(`Failed to fetch ${this.collectionName} with id ${id}`);
    }
  }

  // 添加新文檔 (Observable)
  create(data: Omit<T, 'id'>): Observable<string> {
    return from(this.createAsync(data));
  }

  // 添加新文檔 (Promise)
  async createAsync(data: Omit<T, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(this.getCollectionRef(), data);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw new Error(`Failed to create ${this.collectionName}`);
    }
  }

  // 更新文檔 (Observable)
  update(id: string, data: Partial<T>): Observable<void> {
    return from(this.updateAsync(id, data));
  }

  // 更新文檔 (Promise)
  async updateAsync(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(`Error updating ${this.collectionName} with id ${id}:`, error);
      throw new Error(`Failed to update ${this.collectionName} with id ${id}`);
    }
  }

  // 刪除文檔 (Observable)
  delete(id: string): Observable<void> {
    return from(this.deleteAsync(id));
  }

  // 刪除文檔 (Promise)
  async deleteAsync(id: string): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName} with id ${id}:`, error);
      throw new Error(`Failed to delete ${this.collectionName} with id ${id}`);
    }
  }

  // 批量操作 (Observable)
  batch(operations: Array<{
    type: 'create' | 'update' | 'delete';
    data?: Partial<T>;
    id?: string;
  }>): Observable<void> {
    return from(this.batchAsync(operations));
  }

  // 批量操作 (Promise)
  async batchAsync(operations: Array<{
    type: 'create' | 'update' | 'delete';
    data?: Partial<T>;
    id?: string;
  }>): Promise<void> {
    try {
      const batch = writeBatch(this.firestore);

      operations.forEach(({ type, data, id }) => {
        switch (type) {
          case 'create':
            if (data) {
              const docRef = doc(this.getCollectionRef());
              batch.set(docRef, data);
            }
            break;
          case 'update':
            if (id && data) {
              const docRef = this.getDocRef(id);
              batch.update(docRef, data);
            }
            break;
          case 'delete':
            if (id) {
              const docRef = this.getDocRef(id);
              batch.delete(docRef);
            }
            break;
        }
      });

      await batch.commit();
    } catch (error) {
      console.error(`Error executing batch operations for ${this.collectionName}:`, error);
      throw new Error(`Failed to execute batch operations for ${this.collectionName}`);
    }
  }

  // 實時監聽集合變化 (Observable)
  subscribeToCollection(
    options?: BaseQueryOptions
  ): Observable<T[]> {
    return new Observable(observer => {
      let q = query(this.getCollectionRef());

      if (options?.where) {
        options.where.forEach(({ field, operator, value }) => {
          q = query(q, where(field, operator, value));
        });
      }

      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
      }

      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...this.convertTimestamps(doc.data())
        })) as T[];

        observer.next(data);
      }, (error) => {
        observer.error(error);
      });

      // 返回清理函數
      return () => unsubscribe();
    });
  }

  // 實時監聽單個文檔變化 (Observable)
  subscribeToDocument(id: string): Observable<T | null> {
    return new Observable(observer => {
      const docRef = this.getDocRef(id);

      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = {
            id: docSnap.id,
            ...this.convertTimestamps(docSnap.data())
          } as T;
          observer.next(data);
        } else {
          observer.next(null);
        }
      }, (error) => {
        observer.error(error);
      });

      // 返回清理函數
      return () => unsubscribe();
    });
  }
}
