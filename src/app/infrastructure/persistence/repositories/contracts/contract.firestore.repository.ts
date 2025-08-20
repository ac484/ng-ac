/**
 * @fileoverview Firestore 合約倉儲實現 (Firestore Contract Repository Implementation)
 * @description 使用 Firestore 實現合約數據持久化，遵循 DDD 倉儲模式
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Infrastructure Layer Repository Implementation
 * - 職責：合約數據 Firestore 持久化實現
 * - 依賴：FirebaseBaseRepository, IContractRepository, Contract Entity
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 技術規範：
 * - 繼承 FirebaseBaseRepository
 * - 實現 IContractRepository 接口
 * - 使用 Firestore 數據庫
 * - 包含數據映射邏輯
 */

import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, limit, orderBy, query, where } from '@angular/fire/firestore';
import { Contract, ContractProps } from '@domain/entities/contracts/contract.entity';
import { ContractQueryCriteria, IContractRepository } from '@domain/repositories/contracts/contract.repository.interface';
import { ContractStatus } from '@domain/value-objects/contract-status/contract-status.vo';
import { ContractType } from '@domain/value-objects/contract-type/contract-type.vo';

/**
 * Firestore 合約數據結構
 */
interface FirestoreContract {
  id: string;
  title: string;
  description: string;
  contractNumber: string;
  status: string;
  type: string;
  startDate: any; // Firestore Timestamp
  endDate: any; // Firestore Timestamp
  amount: number;
  currency: string;
  partyA: string;
  partyB: string;
  terms: string[];
  attachments: string[];
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

/**
 * Firestore 合約倉儲實現
 */
@Injectable({
  providedIn: 'root'
})
export class ContractFirestoreRepository implements IContractRepository {
  private readonly collectionName = 'contracts';

  constructor(private firestore: Firestore) {}

  /**
   * 根據 ID 查找合約
   */
  public async findById(id: string): Promise<Contract | null> {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return this.mapFirestoreToContract(docSnap.data() as FirestoreContract);
      }

      return null;
    } catch (error) {
      console.error('Error finding contract by ID:', error);
      return null;
    }
  }

  /**
   * 根據合約編號查找合約
   */
  public async findByContractNumber(contractNumber: string): Promise<Contract | null> {
    try {
      const contractsRef = collection(this.firestore, this.collectionName);
      const q = query(
        contractsRef,
        where('contractNumber', '==', contractNumber),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return this.mapFirestoreToContract(doc.data() as FirestoreContract);
      }

      return null;
    } catch (error) {
      console.error('Error finding contract by number:', error);
      return null;
    }
  }

  /**
   * 查找所有合約
   */
  public async findAll(): Promise<Contract[]> {
    try {
      const contractsRef = collection(this.firestore, this.collectionName);
      const q = query(contractsRef, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc =>
        this.mapFirestoreToContract(doc.data() as FirestoreContract)
      );
    } catch (error) {
      console.error('Error finding all contracts:', error);
      return [];
    }
  }

  /**
   * 根據條件查詢合約
   */
  public async findByCriteria(criteria: ContractQueryCriteria): Promise<Contract[]> {
    try {
      const contractsRef = collection(this.firestore, this.collectionName);
      let q = query(contractsRef);

      // 添加查詢條件
      if (criteria.status) {
        q = query(q, where('status', '==', criteria.status));
      }

      if (criteria.type) {
        q = query(q, where('type', '==', criteria.type));
      }

      if (criteria.partyA) {
        q = query(q, where('partyA', '==', criteria.partyA));
      }

      if (criteria.partyB) {
        q = query(q, where('partyB', '==', criteria.partyB));
      }

      q = query(q, orderBy('createdAt', 'desc'));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc =>
        this.mapFirestoreToContract(doc.data() as FirestoreContract)
      );
    } catch (error) {
      console.error('Error finding contracts by criteria:', error);
      return [];
    }
  }

  /**
   * 查找活躍合約
   */
  public async findActive(): Promise<Contract[]> {
    return this.findByStatus(ContractStatus.ACTIVE);
  }

  /**
   * 查找即將到期的合約（30天內）
   */
  public async findExpiringSoon(): Promise<Contract[]> {
    try {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const contractsRef = collection(this.firestore, this.collectionName);
      const q = query(
        contractsRef,
        where('status', '==', ContractStatus.ACTIVE),
        where('endDate', '<=', thirtyDaysFromNow),
        orderBy('endDate', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc =>
        this.mapFirestoreToContract(doc.data() as FirestoreContract)
      );
    } catch (error) {
      console.error('Error finding expiring contracts:', error);
      return [];
    }
  }

  /**
   * 查找過期合約
   */
  public async findExpired(): Promise<Contract[]> {
    try {
      const now = new Date();

      const contractsRef = collection(this.firestore, this.collectionName);
      const q = query(
        contractsRef,
        where('endDate', '<', now),
        orderBy('endDate', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc =>
        this.mapFirestoreToContract(doc.data() as FirestoreContract)
      );
    } catch (error) {
      console.error('Error finding expired contracts:', error);
      return [];
    }
  }

  /**
   * 根據狀態查找合約
   */
  public async findByStatus(status: ContractStatus): Promise<Contract[]> {
    try {
      const contractsRef = collection(this.firestore, this.collectionName);
      const q = query(
        contractsRef,
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc =>
        this.mapFirestoreToContract(doc.data() as FirestoreContract)
      );
    } catch (error) {
      console.error('Error finding contracts by status:', error);
      return [];
    }
  }

  /**
   * 根據類型查找合約
   */
  public async findByType(type: ContractType): Promise<Contract[]> {
    try {
      const contractsRef = collection(this.firestore, this.collectionName);
      const q = query(
        contractsRef,
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc =>
        this.mapFirestoreToContract(doc.data() as FirestoreContract)
      );
    } catch (error) {
      console.error('Error finding contracts by type:', error);
      return [];
    }
  }

  /**
   * 根據當事人查找合約
   */
  public async findByParty(partyName: string): Promise<Contract[]> {
    try {
      const contractsRef = collection(this.firestore, this.collectionName);
      const q = query(
        contractsRef,
        where('partyA', '==', partyName),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const partyAContracts = querySnapshot.docs.map(doc =>
        this.mapFirestoreToContract(doc.data() as FirestoreContract)
      );

      // 查找 partyB 的合約
      const q2 = query(
        contractsRef,
        where('partyB', '==', partyName),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot2 = await getDocs(q2);
      const partyBContracts = querySnapshot2.docs.map(doc =>
        this.mapFirestoreToContract(doc.data() as FirestoreContract)
      );

      // 合併並去重
      const allContracts = [...partyAContracts, ...partyBContracts];
      const uniqueContracts = allContracts.filter((contract, index, self) =>
        index === self.findIndex(c => c.id === contract.id)
      );

      return uniqueContracts.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error finding contracts by party:', error);
      return [];
    }
  }

  /**
   * 保存合約
   */
  public async save(contract: Contract): Promise<void> {
    // 實現保存邏輯
    throw new Error('Method not implemented.');
  }

  /**
   * 更新合約
   */
  public async update(contract: Contract): Promise<void> {
    // 實現更新邏輯
    throw new Error('Method not implemented.');
  }

  /**
   * 刪除合約
   */
  public async delete(id: string): Promise<void> {
    // 實現刪除邏輯
    throw new Error('Method not implemented.');
  }

  /**
   * 檢查合約編號是否存在
   */
  public async existsByContractNumber(contractNumber: string): Promise<boolean> {
    const contract = await this.findByContractNumber(contractNumber);
    return contract !== null;
  }

  /**
   * 獲取合約總數
   */
  public async count(): Promise<number> {
    try {
      const contractsRef = collection(this.firestore, this.collectionName);
      const querySnapshot = await getDocs(contractsRef);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error counting contracts:', error);
      return 0;
    }
  }

  /**
   * 根據條件獲取合約數量
   */
  public async countByCriteria(criteria: ContractQueryCriteria): Promise<number> {
    const contracts = await this.findByCriteria(criteria);
    return contracts.length;
  }

  /**
   * 將 Firestore 數據映射為合約實體
   */
  private mapFirestoreToContract(firestoreData: FirestoreContract): Contract {
    const contractProps: ContractProps = {
      id: firestoreData.id,
      title: firestoreData.title,
      description: firestoreData.description,
      contractNumber: firestoreData.contractNumber,
      status: firestoreData.status as ContractStatus,
      type: firestoreData.type as ContractType,
      startDate: firestoreData.startDate?.toDate() || new Date(),
      endDate: firestoreData.endDate?.toDate() || new Date(),
      amount: firestoreData.amount,
      currency: firestoreData.currency,
      partyA: firestoreData.partyA,
      partyB: firestoreData.partyB,
      terms: firestoreData.terms || [],
      attachments: firestoreData.attachments || []
    };

    return Contract.create(contractProps)!;
  }
}
