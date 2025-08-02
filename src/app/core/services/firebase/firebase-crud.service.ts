import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    QueryConstraint,
    DocumentData,
    CollectionReference,
    DocumentReference
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

export interface FirebaseDocument {
    id?: string;
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class FirebaseCrudService {
    private firestore = inject(Firestore);

    /**
     * 創建新文檔
     * @param collectionName 集合名稱
     * @param data 要創建的數據
     * @returns Promise<string> 返回新創建文檔的ID
     */
    async create<T extends DocumentData>(collectionName: string, data: T): Promise<string> {
        try {
            const collectionRef = collection(this.firestore, collectionName);
            const docRef = await addDoc(collectionRef, data);
            return docRef.id;
        } catch (error) {
            console.error('創建文檔失敗:', error);
            throw error;
        }
    }

    /**
     * 讀取單個文檔
     * @param collectionName 集合名稱
     * @param docId 文檔ID
     * @returns Promise<T | null>
     */
    async read<T extends FirebaseDocument>(collectionName: string, docId: string): Promise<T | null> {
        try {
            const docRef = doc(this.firestore, collectionName, docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as T;
            } else {
                return null;
            }
        } catch (error) {
            console.error('讀取文檔失敗:', error);
            throw error;
        }
    }

    /**
     * 讀取所有文檔
     * @param collectionName 集合名稱
     * @param constraints 查詢條件
     * @returns Promise<T[]>
     */
    async readAll<T extends FirebaseDocument>(
        collectionName: string,
        ...constraints: QueryConstraint[]
    ): Promise<T[]> {
        try {
            const collectionRef = collection(this.firestore, collectionName);
            const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as T[];
        } catch (error) {
            console.error('讀取文檔列表失敗:', error);
            throw error;
        }
    }

    /**
     * 更新文檔
     * @param collectionName 集合名稱
     * @param docId 文檔ID
     * @param data 要更新的數據
     * @returns Promise<void>
     */
    async update<T extends Partial<DocumentData>>(
        collectionName: string,
        docId: string,
        data: T
    ): Promise<void> {
        try {
            const docRef = doc(this.firestore, collectionName, docId);
            await updateDoc(docRef, data);
        } catch (error) {
            console.error('更新文檔失敗:', error);
            throw error;
        }
    }

    /**
     * 刪除文檔
     * @param collectionName 集合名稱
     * @param docId 文檔ID
     * @returns Promise<void>
     */
    async delete(collectionName: string, docId: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, collectionName, docId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('刪除文檔失敗:', error);
            throw error;
        }
    }

    /**
     * 條件查詢
     * @param collectionName 集合名稱
     * @param field 字段名
     * @param operator 操作符
     * @param value 值
     * @param orderByField 排序字段
     * @param limitCount 限制數量
     * @returns Promise<T[]>
     */
    async queryWhere<T extends FirebaseDocument>(
        collectionName: string,
        field: string,
        operator: any,
        value: any,
        orderByField?: string,
        limitCount?: number
    ): Promise<T[]> {
        try {
            const collectionRef = collection(this.firestore, collectionName);
            const constraints: QueryConstraint[] = [where(field, operator, value)];

            if (orderByField) {
                constraints.push(orderBy(orderByField));
            }

            if (limitCount) {
                constraints.push(limit(limitCount));
            }

            return await this.readAll<T>(collectionName, ...constraints);
        } catch (error) {
            console.error('條件查詢失敗:', error);
            throw error;
        }
    }

    /**
     * 批量操作 - 創建多個文檔
     * @param collectionName 集合名稱
     * @param dataArray 數據數組
     * @returns Promise<string[]> 返回創建的文檔ID數組
     */
    async batchCreate<T extends DocumentData>(
        collectionName: string,
        dataArray: T[]
    ): Promise<string[]> {
        try {
            const promises = dataArray.map(data => this.create(collectionName, data));
            return await Promise.all(promises);
        } catch (error) {
            console.error('批量創建失敗:', error);
            throw error;
        }
    }

    /**
     * 批量刪除
     * @param collectionName 集合名稱
     * @param docIds 文檔ID數組
     * @returns Promise<void>
     */
    async batchDelete(collectionName: string, docIds: string[]): Promise<void> {
        try {
            const promises = docIds.map(docId => this.delete(collectionName, docId));
            await Promise.all(promises);
        } catch (error) {
            console.error('批量刪除失敗:', error);
            throw error;
        }
    }

    // Observable 版本的方法，用於實時數據監聽

    /**
     * 讀取單個文檔 (Observable)
     * @param collectionName 集合名稱
     * @param docId 文檔ID
     * @returns Observable<T | null>
     */
    read$<T extends FirebaseDocument>(collectionName: string, docId: string): Observable<T | null> {
        return from(this.read<T>(collectionName, docId));
    }

    /**
     * 讀取所有文檔 (Observable)
     * @param collectionName 集合名稱
     * @param constraints 查詢條件
     * @returns Observable<T[]>
     */
    readAll$<T extends FirebaseDocument>(
        collectionName: string,
        ...constraints: QueryConstraint[]
    ): Observable<T[]> {
        return from(this.readAll<T>(collectionName, ...constraints));
    }

    /**
     * 條件查詢 (Observable)
     * @param collectionName 集合名稱
     * @param field 字段名
     * @param operator 操作符
     * @param value 值
     * @param orderByField 排序字段
     * @param limitCount 限制數量
     * @returns Observable<T[]>
     */
    queryWhere$<T extends FirebaseDocument>(
        collectionName: string,
        field: string,
        operator: any,
        value: any,
        orderByField?: string,
        limitCount?: number
    ): Observable<T[]> {
        return from(this.queryWhere<T>(collectionName, field, operator, value, orderByField, limitCount));
    }
}