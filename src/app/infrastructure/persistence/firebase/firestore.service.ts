/**
 * @fileoverview Firestore 服務 (Firestore Service)
 * @description 提供 Firestore 數據庫操作功能
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Infrastructure Layer Firestore Service
 * - 職責：Firestore 數據庫操作、CRUD 功能
 * - 依賴：@angular/fire/firestore, FirebaseService
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案提供 Firestore 數據庫操作
 * - 使用極簡主義設計，避免過度複雜化
 * - 嚴格遵守 @angular/fire > firebase > firestore 交互順序
 */

import { Injectable } from '@angular/core';
import { DocumentData, Firestore, QueryConstraint, addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore: Firestore;

  constructor(private firebaseService: FirebaseService) {
    this.firestore = this.firebaseService.getFirestore();
  }

  /**
   * 獲取文檔
   */
  async getDocument<T>(collectionName: string, documentId: string): Promise<T | null> {
    try {
      const docRef = doc(this.firestore, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error('獲取文檔失敗:', error);
      return null;
    }
  }

  /**
   * 獲取集合
   */
  async getCollection<T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error('獲取集合失敗:', error);
      return [];
    }
  }

  /**
   * 添加文檔
   */
  async addDocument<T>(collectionName: string, data: DocumentData): Promise<string | null> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const docRef = await addDoc(collectionRef, data);
      return docRef.id;
    } catch (error) {
      console.error('添加文檔失敗:', error);
      return null;
    }
  }

  /**
   * 更新文檔
   */
  async updateDocument(collectionName: string, documentId: string, data: DocumentData): Promise<boolean> {
    try {
      const docRef = doc(this.firestore, collectionName, documentId);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      console.error('更新文檔失敗:', error);
      return false;
    }
  }

  /**
   * 刪除文檔
   */
  async deleteDocument(collectionName: string, documentId: string): Promise<boolean> {
    try {
      const docRef = doc(this.firestore, collectionName, documentId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('刪除文檔失敗:', error);
      return false;
    }
  }

  /**
   * 查詢文檔
   */
  async queryDocuments<T>(collectionName: string, field: string, operator: any, value: any): Promise<T[]> {
    try {
      const constraints = [where(field, operator, value)];
      return await this.getCollection<T>(collectionName, constraints);
    } catch (error) {
      console.error('查詢文檔失敗:', error);
      return [];
    }
  }

  /**
   * 排序查詢
   */
  async getOrderedDocuments<T>(collectionName: string, orderByField: string, direction: 'asc' | 'desc' = 'asc'): Promise<T[]> {
    try {
      const constraints = [orderBy(orderByField, direction)];
      return await this.getCollection<T>(collectionName, constraints);
    } catch (error) {
      console.error('排序查詢失敗:', error);
      return [];
    }
  }

  /**
   * 限制查詢結果數量
   */
  async getLimitedDocuments<T>(collectionName: string, limitCount: number): Promise<T[]> {
    try {
      const constraints = [limit(limitCount)];
      return await this.getCollection<T>(collectionName, constraints);
    } catch (error) {
      console.error('限制查詢失敗:', error);
      return [];
    }
  }
}
