/**
 * @ai-context {
 *   "role": "Infrastructure/Repository",
 *   "purpose": "Firebase合約倉儲-合約數據持久化實現",
 *   "constraints": ["實現領域接口", "Firebase集成", "錯誤處理"],
 *   "dependencies": ["FirebaseService", "ContractRepository", "Contract"],
 *   "security": "high",
 *   "lastmod": "2025-01-18"
 * }
 */
import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { ContractRepository } from '../../../../domain/repositories/contract.repository';
import { Contract } from '../../../../lib/types';
import { db } from '../../../config/firebase/firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseContractRepository implements ContractRepository {
  private readonly collectionName = 'contracts';

  async getAll(): Promise<Contract[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...this.convertFirestoreData(doc.data())
      })) as Contract[];
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw new Error('Failed to fetch contracts');
    }
  }

  async getById(id: string): Promise<Contract | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...this.convertFirestoreData(docSnap.data())
        } as Contract;
      }

      return null;
    } catch (error) {
      console.error('Error fetching contract:', error);
      throw new Error('Failed to fetch contract');
    }
  }

  async create(contract: Omit<Contract, 'id'>): Promise<Contract> {
    try {
      const contractData = this.convertToFirestoreData(contract);
      const docRef = await addDoc(collection(db, this.collectionName), contractData);

      return {
        id: docRef.id,
        ...contract
      };
    } catch (error) {
      console.error('Error creating contract:', error);
      throw new Error('Failed to create contract');
    }
  }

  async update(id: string, updates: Partial<Contract>): Promise<Contract> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = this.convertToFirestoreData(updates);

      await updateDoc(docRef, {
        ...updateData,
        updatedAt: Timestamp.now()
      });

      const updatedDoc = await this.getById(id);
      if (!updatedDoc) {
        throw new Error('Contract not found after update');
      }

      return updatedDoc;
    } catch (error) {
      console.error('Error updating contract:', error);
      throw new Error('Failed to update contract');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting contract:', error);
      throw new Error('Failed to delete contract');
    }
  }

  private convertFirestoreData(data: any): any {
    const converted = { ...data };

    // 轉換 Timestamp 為 Date
    if (converted.startDate?.toDate) {
      converted.startDate = converted.startDate.toDate();
    }
    if (converted.endDate?.toDate) {
      converted.endDate = converted.endDate.toDate();
    }
    if (converted.createdAt?.toDate) {
      converted.createdAt = converted.createdAt.toDate();
    }
    if (converted.updatedAt?.toDate) {
      converted.updatedAt = converted.updatedAt.toDate();
    }

    // 轉換 payments 中的日期
    if (converted.payments) {
      converted.payments = converted.payments.map((payment: any) => ({
        ...payment,
        dueDate: payment.dueDate?.toDate ? payment.dueDate.toDate() : payment.dueDate,
        paidDate: payment.paidDate?.toDate ? payment.paidDate.toDate() : payment.paidDate
      }));
    }

    // 轉換 changeOrders 中的日期
    if (converted.changeOrders) {
      converted.changeOrders = converted.changeOrders.map((order: any) => ({
        ...order,
        date: order.date?.toDate ? order.date.toDate() : order.date
      }));
    }

    // 轉換 versions 中的日期
    if (converted.versions) {
      converted.versions = converted.versions.map((version: any) => ({
        ...version,
        date: version.date?.toDate ? version.date.toDate() : version.date
      }));
    }

    return converted;
  }

  private convertToFirestoreData(data: any): any {
    const converted = { ...data };

    // 轉換 Date 為 Timestamp
    if (converted.startDate instanceof Date) {
      converted.startDate = Timestamp.fromDate(converted.startDate);
    }
    if (converted.endDate instanceof Date) {
      converted.endDate = Timestamp.fromDate(converted.endDate);
    }
    if (converted.createdAt instanceof Date) {
      converted.createdAt = Timestamp.fromDate(converted.createdAt);
    }
    if (converted.updatedAt instanceof Date) {
      converted.updatedAt = Timestamp.fromDate(converted.updatedAt);
    }

    // 轉換 payments 中的日期
    if (converted.payments) {
      converted.payments = converted.payments.map((payment: any) => ({
        ...payment,
        dueDate: payment.dueDate instanceof Date ? Timestamp.fromDate(payment.dueDate) : payment.dueDate,
        paidDate: payment.paidDate instanceof Date ? Timestamp.fromDate(payment.paidDate) : payment.paidDate
      }));
    }

    // 轉換 changeOrders 中的日期
    if (converted.changeOrders) {
      converted.changeOrders = converted.changeOrders.map((order: any) => ({
        ...order,
        date: order.date instanceof Date ? Timestamp.fromDate(order.date) : order.date
      }));
    }

    // 轉換 versions 中的日期
    if (converted.versions) {
      converted.versions = converted.versions.map((version: any) => ({
        ...version,
        date: version.date instanceof Date ? Timestamp.fromDate(version.date) : version.date
      }));
    }

    return converted;
  }
}
