import { db } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { Contract } from '../types';

export class FirebaseContractService {
  private static collection = collection(db, 'contracts');

  /**
   * 創建新合約
   */
  static async createContract(contractData: Omit<Contract, 'id' | 'versions'>): Promise<Contract> {
    const docRef = await addDoc(this.collection, {
      ...contractData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      versions: [
        {
          version: 1,
          date: new Date(),
          changeSummary: '初始合約創建',
        },
      ],
    });

    return {
      id: docRef.id,
      ...contractData,
      versions: [
        {
          version: 1,
          date: new Date(),
          changeSummary: '初始合約創建',
        },
      ],
    } as Contract;
  }

  /**
   * 更新合約
   */
  static async updateContract(id: string, updates: Partial<Contract>): Promise<Contract | null> {
    const docRef = doc(db, 'contracts', id);

    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    // 返回更新後的合約（需要重新獲取）
    return this.getContractById(id);
  }

  /**
   * 刪除合約
   */
  static async deleteContract(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'contracts', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('刪除合約失敗:', error);
      return false;
    }
  }

  /**
   * 根據 ID 獲取合約
   */
  static async getContractById(id: string): Promise<Contract | null> {
    try {
      const docRef = doc(db, 'contracts', id);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) return null;

      return {
        id: snapshot.id,
        ...snapshot.data()
      } as Contract;
    } catch (error) {
      console.error('獲取合約失敗:', error);
      return null;
    }
  }

  /**
   * 添加合約版本
   */
  static async addContractVersion(id: string, changeSummary: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'contracts', id);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) return false;

      const contract = snapshot.data() as Contract;
      const newVersion = {
        version: contract.versions.length + 1,
        date: new Date(),
        changeSummary,
      };

      await updateDoc(docRef, {
        versions: [...contract.versions, newVersion],
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (error) {
      console.error('添加合約版本失敗:', error);
      return false;
    }
  }

  /**
   * 更新合約狀態
   */
  static async updateContractStatus(id: string, status: Contract['status']): Promise<boolean> {
    try {
      const docRef = doc(db, 'contracts', id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('更新合約狀態失敗:', error);
      return false;
    }
  }
}
