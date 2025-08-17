import { db } from '@/lib/firebase';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    QueryDocumentSnapshot,
    startAfter,
    Timestamp,
    Unsubscribe,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';

// 基礎查詢選項
export interface BaseQueryOptions {
  orderBy?: { field: string; direction?: 'asc' | 'desc' };
  limit?: number;
  where?: Array<{ field: string; operator: any; value: any }>;
}

// 分頁查詢選項
export interface PaginationOptions extends BaseQueryOptions {
  pageSize: number;
  startAfter?: QueryDocumentSnapshot<DocumentData>;
}

// 實時監聽選項
export interface RealtimeOptions {
  onNext?: (data: DocumentData[]) => void;
  onError?: (error: Error) => void;
}

// 基礎Firebase服務類
export class BaseFirebaseService<T extends DocumentData> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // 獲取集合引用
  protected getCollectionRef() {
    return collection(db, this.collectionName);
  }

  // 獲取文檔引用
  protected getDocRef(id: string) {
    return doc(db, this.collectionName, id);
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

  // 獲取所有文檔
  async getAll(options?: BaseQueryOptions): Promise<T[]> {
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

  // 分頁獲取文檔
  async getPaginated(options: PaginationOptions): Promise<{
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

  // 根據ID獲取單個文檔
  async getById(id: string): Promise<T | null> {
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

  // 添加新文檔
  async create(data: Omit<T, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(this.getCollectionRef(), data);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw new Error(`Failed to create ${this.collectionName}`);
    }
  }

  // 更新文檔
  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(`Error updating ${this.collectionName} with id ${id}:`, error);
      throw new Error(`Failed to update ${this.collectionName} with id ${id}`);
    }
  }

  // 刪除文檔
  async delete(id: string): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName} with id ${id}:`, error);
      throw new Error(`Failed to delete ${this.collectionName} with id ${id}`);
    }
  }

  // 批量操作
  async batch(operations: Array<{
    type: 'create' | 'update' | 'delete';
    data?: Partial<T>;
    id?: string;
  }>): Promise<void> {
    try {
      const batch = writeBatch(db);

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

  // 實時監聽集合變化
  subscribeToCollection(
    callback: (data: T[]) => void,
    options?: BaseQueryOptions
  ): Unsubscribe {
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

    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertTimestamps(doc.data())
      })) as T[];

      callback(data);
    });
  }

  // 實時監聽單個文檔變化
  subscribeToDocument(id: string, callback: (data: T | null) => void): Unsubscribe {
    const docRef = this.getDocRef(id);

    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = {
          id: docSnap.id,
          ...this.convertTimestamps(docSnap.data())
        } as T;
        callback(data);
      } else {
        callback(null);
      }
    });
  }
}
