/**
 * @fileoverview Firebase 基礎倉儲 (Firebase Base Repository)
 * @description 提供 Firebase 倉儲的基礎功能
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Infrastructure Layer Firebase Base Repository
 * - 職責：Firebase 倉儲基礎功能、通用 CRUD 操作
 * - 依賴：FirestoreService, 領域實體
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案提供 Firebase 倉儲基礎功能
 * - 使用極簡主義設計，避免過度複雜化
 * - 嚴格遵守 @angular/fire > firebase > firestore 交互順序
 */

import { Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FirestoreService } from '../../firebase';

export interface BaseEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export abstract class FirebaseBaseRepository<T extends BaseEntity> {
  protected abstract collectionName: string;

  constructor(protected firestoreService: FirestoreService) {}

  /**
   * 獲取單個實體
   */
  async findById(id: string): Promise<T | null> {
    return await this.firestoreService.getDocument<T>(this.collectionName, id);
  }

  /**
   * 獲取所有實體
   */
  async findAll(): Promise<T[]> {
    return await this.firestoreService.getCollection<T>(this.collectionName);
  }

  /**
   * 創建實體
   */
  async create(entity: Omit<T, 'id'>): Promise<string | null> {
    const data: DocumentData = {
      ...entity,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return await this.firestoreService.addDocument<T>(this.collectionName, data);
  }

  /**
   * 更新實體
   */
  async update(id: string, entity: Partial<T>): Promise<boolean> {
    const data: DocumentData = {
      ...entity,
      updatedAt: new Date()
    };
    return await this.firestoreService.updateDocument(this.collectionName, id, data);
  }

  /**
   * 刪除實體
   */
  async delete(id: string): Promise<boolean> {
    return await this.firestoreService.deleteDocument(this.collectionName, id);
  }

  /**
   * 根據條件查詢實體
   */
  async findByField(field: string, operator: any, value: any): Promise<T[]> {
    return await this.firestoreService.queryDocuments<T>(this.collectionName, field, operator, value);
  }

  /**
   * 根據條件查詢單個實體
   */
  async findOneByField(field: string, operator: any, value: any): Promise<T | null> {
    const results = await this.findByField(field, operator, value);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * 排序查詢
   */
  async findOrdered(orderByField: string, direction: 'asc' | 'desc' = 'asc'): Promise<T[]> {
    return await this.firestoreService.getOrderedDocuments<T>(this.collectionName, orderByField, direction);
  }

  /**
   * 限制查詢結果數量
   */
  async findLimited(limitCount: number): Promise<T[]> {
    return await this.firestoreService.getLimitedDocuments<T>(this.collectionName, limitCount);
  }

  /**
   * 檢查實體是否存在
   */
  async exists(id: string): Promise<boolean> {
    const entity = await this.findById(id);
    return entity !== null;
  }

  /**
   * 獲取集合數量
   */
  async count(): Promise<number> {
    const entities = await this.findAll();
    return entities.length;
  }
}
