/**
 * Firestore 基礎服務 - 原子化操作
 * 
 * 提供最基本的 Firestore 原子操作
 * 遵循極簡主義原則：每個方法只做一件事
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
  DocumentReference, 
  QueryConstraint,
  CollectionReference,
  DocumentData,
  serverTimestamp,
  Timestamp,
  runTransaction,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove
} from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface BaseEntity {
  id?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface WhereCondition {
  field: string;
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in';
  value: any;
}

export interface OrderCondition {
  field: string;
  direction: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class BaseFirestoreService {
  private readonly firestore = inject(Firestore);

  // 原子操作：獲取集合引用
  getCollection(collectionName: string): CollectionReference<DocumentData> {
    return collection(this.firestore, collectionName);
  }

  // 原子操作：獲取文檔引用
  getDocument(collectionName: string, id: string): DocumentReference<DocumentData> {
    return doc(this.firestore, collectionName, id);
  }

  // 原子操作：新增文檔
  addDocument<T extends BaseEntity>(collectionName: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const now = serverTimestamp();
    const docData = {
      ...(data as any),
      createdAt: now,
      updatedAt: now
    };

    return from(addDoc(this.getCollection(collectionName), docData)).pipe(
      map(docRef => docRef.id),
      catchError(error => {
        console.error(`新增文檔失敗 [${collectionName}]:`, error);
        return throwError(() => error);
      })
    );
  }

  // 原子操作：設置文檔（指定ID）
  setDocument<T extends BaseEntity>(collectionName: string, id: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Observable<void> {
    const now = serverTimestamp();
    const docData = {
      ...(data as any),
      id,
      createdAt: now,
      updatedAt: now
    };

    return from(setDoc(this.getDocument(collectionName, id), docData)).pipe(
      catchError(error => {
        console.error(`設置文檔失敗 [${collectionName}/${id}]:`, error);
        return throwError(() => error);
      })
    );
  }

  // 原子操作：獲取單個文檔
  getDocumentById<T extends BaseEntity>(collectionName: string, id: string): Observable<T | null> {
    return from(getDoc(this.getDocument(collectionName, id))).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          return { id: docSnap.id, ...(data as any) } as T;
        }
        return null;
      }),
      catchError(error => {
        console.error(`獲取文檔失敗 [${collectionName}/${id}]:`, error);
        return throwError(() => error);
      })
    );
  }

  // 原子操作：查詢文檔
  queryDocuments<T extends BaseEntity>(
    collectionName: string, 
    whereConditions: WhereCondition[] = [],
    orderConditions: OrderCondition[] = [],
    limitCount?: number
  ): Observable<T[]> {
    console.log(`🔍 查詢 ${collectionName}:`, { whereConditions, orderConditions, limitCount });
    
    try {
      let q: any = this.getCollection(collectionName);
      const constraints: QueryConstraint[] = [];

      // 添加 where 條件
      whereConditions.forEach(condition => {
        constraints.push(where(condition.field, condition.operator, condition.value));
      });

      // 添加排序
      orderConditions.forEach(order => {
        constraints.push(orderBy(order.field, order.direction));
      });

      // 添加限制
      if (limitCount) {
        constraints.push(limit(limitCount));
      }

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      return from(getDocs(q)).pipe(
        map(querySnapshot => {
          console.log(`✅ ${collectionName} 查詢成功，找到 ${querySnapshot.docs.length} 筆資料`);
          const results = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const result = { id: doc.id, ...(data as any) } as T;
            console.log(`📄 文檔 ${doc.id} 數據:`, result);
            return result;
          });
          console.log(`📊 ${collectionName} 最終結果:`, results);
          return results;
        }),
        catchError(error => {
          console.error(`❌ ${collectionName} 查詢失敗:`, error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error(`❌ ${collectionName} 查詢建立失敗:`, error);
      return throwError(() => error);
    }
  }

  // 原子操作：更新文檔
  updateDocument<T extends BaseEntity>(collectionName: string, id: string, data: Partial<T>): Observable<void> {
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };

    return from(updateDoc(this.getDocument(collectionName, id), updateData)).pipe(
      catchError(error => {
        console.error(`更新文檔失敗 [${collectionName}/${id}]:`, error);
        return throwError(() => error);
      })
    );
  }

  // 原子操作：刪除文檔
  deleteDocument(collectionName: string, id: string): Observable<void> {
    return from(deleteDoc(this.getDocument(collectionName, id))).pipe(
      catchError(error => {
        console.error(`刪除文檔失敗 [${collectionName}/${id}]:`, error);
        return throwError(() => error);
      })
    );
  }

  // 原子操作：批量刪除文檔
  deleteDocuments(collectionName: string, ids: string[]): Observable<void[]> {
    const deletePromises = ids.map(id => deleteDoc(this.getDocument(collectionName, id)));
    
    return from(Promise.all(deletePromises)).pipe(
      catchError(error => {
        console.error(`批量刪除文檔失敗 [${collectionName}]:`, error);
        return throwError(() => error);
      })
    );
  }

  // 原子操作：檢查文檔是否存在
  documentExists(collectionName: string, id: string): Observable<boolean> {
    return from(getDoc(this.getDocument(collectionName, id))).pipe(
      map(docSnap => docSnap.exists()),
      catchError(error => {
        console.error(`檢查文檔存在失敗 [${collectionName}/${id}]:`, error);
        return throwError(() => error);
      })
    );
  }

  // ===== 語意命名原子操作 =====

  /** 查詢單筆（by id） */
  findById<T extends BaseEntity>(collectionName: string, id: string): Observable<T | null> {
    return this.getDocumentById<T>(collectionName, id);
  }

  /** 查詢多筆（可加條件/排序/限制） */
  findAll<T extends BaseEntity>(
    collectionName: string,
    whereConditions: WhereCondition[] = [],
    orderConditions: OrderCondition[] = [],
    limitCount?: number
  ): Observable<T[]> {
    return this.queryDocuments<T>(collectionName, whereConditions, orderConditions, limitCount);
  }

  /** 新增 */
  create<T extends BaseEntity>(collectionName: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    return this.addDocument<T>(collectionName, data);
  }

  /** 覆蓋（指定 id） */
  replace<T extends BaseEntity>(collectionName: string, id: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Observable<void> {
    return this.setDocument<T>(collectionName, id, data);
  }

  /** 局部修改 */
  modify<T extends BaseEntity>(collectionName: string, id: string, data: Partial<T>): Observable<void> {
    return this.updateDocument<T>(collectionName, id, data);
  }

  /** 刪除單筆 */
  remove(collectionName: string, id: string): Observable<void> {
    return this.deleteDocument(collectionName, id);
  }

  /** 批量刪除 */
  bulkRemove(collectionName: string, ids: string[]): Observable<void[]> {
    return this.deleteDocuments(collectionName, ids);
  }

  /** 檢查是否存在 */
  exists(collectionName: string, id: string): Observable<boolean> {
    return this.documentExists(collectionName, id);
  }

  // ===== 進階原子操作（atomic 前綴） =====

  /** 條件式原子更新（Update with Condition） */
  atomicUpdateWithCondition<T extends BaseEntity>(
    collectionName: string,
    id: string,
    condition: (data: T) => boolean,
    update: Partial<T>
  ): Observable<void> {
    return from(runTransaction(this.firestore, async (tx) => {
      const ref = this.getDocument(collectionName, id);
      const snap = await tx.get(ref);
      if (!snap.exists()) throw new Error('Document not found');
      const data = snap.data() as T;
      if (!condition(data)) throw new Error('Condition not met');
      tx.update(ref, { ...update, updatedAt: serverTimestamp() });
    })).pipe(catchError(error => {
      console.error(`atomicUpdateWithCondition failed [${collectionName}/${id}]:`, error);
      return throwError(() => error);
    }));
  }

  /** 轉移（A 減少、B 增加，需原子性） */
  atomicTransfer(
    collectionA: string, idA: string, fieldA: string, deltaA: number,
    collectionB: string, idB: string, fieldB: string, deltaB: number
  ): Observable<void> {
    return from(runTransaction(this.firestore, async (tx) => {
      const refA = this.getDocument(collectionA, idA);
      const refB = this.getDocument(collectionB, idB);
      tx.update(refA, { [fieldA]: increment(deltaA) });
      tx.update(refB, { [fieldB]: increment(deltaB) });
    })).pipe(catchError(error => {
      console.error(`atomicTransfer failed [${collectionA}/${idA} <-> ${collectionB}/${idB}]:`, error);
      return throwError(() => error);
    }));
  }

  /** 增量更新（Increment/Decrement） */
  atomicIncrement(
    collectionName: string, id: string, field: string, value: number
  ): Observable<void> {
    return from(updateDoc(this.getDocument(collectionName, id), { [field]: increment(value), updatedAt: serverTimestamp() }))
      .pipe(catchError(error => {
        console.error(`atomicIncrement failed [${collectionName}/${id}]:`, error);
        return throwError(() => error);
      }));
  }

  /** 批次原子更新（多筆一起） */
  atomicBatchUpdate(
    updates: { collection: string, id: string, data: any }[]
  ): Observable<void> {
    return from(runTransaction(this.firestore, async (tx) => {
      for (const { collection, id, data } of updates) {
        tx.update(this.getDocument(collection, id), data);
      }
    })).pipe(catchError(error => {
      console.error('atomicBatchUpdate failed:', error);
      return throwError(() => error);
    }));
  }

  /** 比對更新（Compare-And-Swap, CAS） */
  atomicCAS<T extends BaseEntity>(
    collectionName: string, id: string, expectedVersion: number, update: Partial<T>
  ): Observable<void> {
    return from(runTransaction(this.firestore, async (tx) => {
      const ref = this.getDocument(collectionName, id);
      const snap = await tx.get(ref);
      if (!snap.exists()) throw new Error('Document not found');
      const data = snap.data() as any;
      if (data.version !== expectedVersion) throw new Error('Version mismatch');
      tx.update(ref, { ...update, version: expectedVersion + 1, updatedAt: serverTimestamp() });
    })).pipe(catchError(error => {
      console.error(`atomicCAS failed [${collectionName}/${id}]:`, error);
      return throwError(() => error);
    }));
  }


}