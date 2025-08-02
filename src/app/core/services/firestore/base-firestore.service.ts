/**
 * Firestore 基礎服務
 * 
 * 提供通用的 CRUD 操作和查詢功能
 * 所有具體的 Firestore 服務都應該繼承此基礎服務
 */

import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  endBefore,
  DocumentReference, 
  DocumentSnapshot,
  QueryConstraint,
  CollectionReference,
  DocumentData,
  WithFieldValue,
  UpdateData,
  serverTimestamp,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface BaseEntity {
  id?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: string;
  updatedBy?: string;
}

export interface QueryOptions {
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

export interface PaginationResult<T> {
  data: T[];
  hasMore: boolean;
  lastDoc?: any;
  firstDoc?: any;
  total?: number;
}

@Injectable({
  providedIn: 'root'
})
export abstract class BaseFirestoreService<T extends BaseEntity> {
  protected readonly firestore = inject(Firestore);
  protected abstract collectionName: string;

  /**
   * 獲取集合引用
   */
  protected getCollectionRef(): CollectionReference<DocumentData> {
    return collection(this.firestore, this.collectionName);
  }

  /**
   * 獲取文檔引用
   */
  protected getDocRef(id: string): DocumentReference<DocumentData> {
    return doc(this.firestore, this.collectionName, id);
  }

  /**
   * 新增文檔
   */
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const now = serverTimestamp();
    const docData: WithFieldValue<T> = {
      ...data,
      createdAt: now,
      updatedAt: now
    } as WithFieldValue<T>;

    return from(addDoc(this.getCollectionRef(), docData)).pipe(
      map(docRef => docRef.id),
      catchError(error => {
        console.error(`Error creating document in ${this.collectionName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 使用指定 ID 新增文檔
   */
  createWithId(id: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Observable<void> {
    const now = serverTimestamp();
    const docData: WithFieldValue<T> = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    } as WithFieldValue<T>;

    return from(setDoc(this.getDocRef(id), docData)).pipe(
      catchError(error => {
        console.error(`Error creating document with ID ${id} in ${this.collectionName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 根據 ID 獲取單個文檔
   */
  getById(id: string): Observable<T | null> {
    return from(getDoc(this.getDocRef(id))).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data() as any;
          return { id: docSnap.id, ...data } as T;
        }
        return null;
      }),
      catchError(error => {
        console.error(`Error getting document ${id} from ${this.collectionName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 獲取所有文檔
   */
  getAll(options?: QueryOptions): Observable<T[]> {
    const q = this.buildQuery(options);
    
    return from(getDocs(q)).pipe(
      map(querySnapshot => 
        querySnapshot.docs.map(doc => {
          const data = doc.data() as any;
          return { 
            id: doc.id, 
            ...data 
          } as T;
        })
      ),
      catchError(error => {
        console.error(`Error getting documents from ${this.collectionName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 分頁查詢
   */
  getPaginated(pageSize: number = 10, options?: QueryOptions): Observable<PaginationResult<T>> {
    const queryOptions = { ...options, limit: pageSize };
    const q = this.buildQuery(queryOptions);

    return from(getDocs(q)).pipe(
      map(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          const docData = doc.data() as any;
          return { 
            id: doc.id, 
            ...docData 
          } as T;
        });

        return {
          data,
          hasMore: querySnapshot.docs.length === pageSize,
          lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
          firstDoc: querySnapshot.docs[0]
        };
      }),
      catchError(error => {
        console.error(`Error getting paginated documents from ${this.collectionName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 更新文檔
   */
  update(id: string, data: UpdateData<T>): Observable<void> {
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };

    return from(updateDoc(this.getDocRef(id), updateData)).pipe(
      catchError(error => {
        console.error(`Error updating document ${id} in ${this.collectionName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 刪除文檔
   */
  delete(id: string): Observable<void> {
    return from(deleteDoc(this.getDocRef(id))).pipe(
      catchError(error => {
        console.error(`Error deleting document ${id} from ${this.collectionName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 批量刪除
   */
  deleteBatch(ids: string[]): Observable<void[]> {
    const deletePromises = ids.map(id => deleteDoc(this.getDocRef(id)));
    
    return from(Promise.all(deletePromises)).pipe(
      catchError(error => {
        console.error(`Error batch deleting documents from ${this.collectionName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 檢查文檔是否存在
   */
  exists(id: string): Observable<boolean> {
    return from(getDoc(this.getDocRef(id))).pipe(
      map(docSnap => docSnap.exists()),
      catchError(error => {
        console.error(`Error checking document existence ${id} in ${this.collectionName}:`, error);
        return throwError(() => error);
      })
    );
  }

  /**
   * 構建查詢
   */
  protected buildQuery(options?: QueryOptions): any {
    let q: any = this.getCollectionRef();

    if (options) {
      const constraints: QueryConstraint[] = [];

      // 添加 where 條件
      if (options.where) {
        options.where.forEach(condition => {
          constraints.push(where(condition.field, condition.operator, condition.value));
        });
      }

      // 添加排序
      if (options.orderBy) {
        options.orderBy.forEach(order => {
          constraints.push(orderBy(order.field, order.direction || 'asc'));
        });
      }

      // 添加分頁
      if (options.startAfter) {
        constraints.push(startAfter(options.startAfter));
      }

      if (options.endBefore) {
        constraints.push(endBefore(options.endBefore));
      }

      // 添加限制
      if (options.limit) {
        constraints.push(limit(options.limit));
      }

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }
    }

    return q;
  }

  /**
   * 獲取集合名稱
   */
  getCollectionName(): string {
    return this.collectionName;
  }
}