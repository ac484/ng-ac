import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp
} from '@angular/fire/firestore';

import { Contract } from '../../domain/entities/contract.entity';
import { ContractRepository, ContractSearchCriteria } from '../../domain/repositories/contract.repository';
import { Money } from '../../domain/value-objects/account/money.value-object';
import {
  ContractNumber,
  ContractStatus,
  ClientName,
  ClientRepresentative,
  ContactPerson,
  ContractName,
  ContactPhone,
  Notes
} from '../../domain/value-objects/contract';

@Injectable()
export class FirebaseContractRepository implements ContractRepository {
  private readonly firestore = inject(Firestore);
  private readonly collectionName = 'contracts';

  async findById(id: string): Promise<Contract | null> {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return this.fromFirestoreDoc(docSnap.data(), docSnap.id);
      }
      return null;
    } catch (error) {
      console.error('Error finding contract by ID:', error);
      throw new Error(`Failed to find contract: ${error}`);
    }
  }

  async findByContractNumber(contractNumber: string): Promise<Contract | null> {
    try {
      const q = query(collection(this.firestore, this.collectionName), where('contractNumber', '==', contractNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return this.fromFirestoreDoc(doc.data(), doc.id);
      }
      return null;
    } catch (error) {
      console.error('Error finding contract by number:', error);
      throw new Error(`Failed to find contract by number: ${error}`);
    }
  }

  async findByDate(date: Date): Promise<Contract[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(this.firestore, this.collectionName),
        where('createdAt', '>=', startOfDay),
        where('createdAt', '<=', endOfDay),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.fromFirestoreDoc(doc.data(), doc.id));
    } catch (error) {
      console.error('Error finding contracts by date:', error);
      throw new Error(`Failed to find contracts by date: ${error}`);
    }
  }

  async findAll(criteria?: ContractSearchCriteria): Promise<Contract[]> {
    try {
      let q = query(collection(this.firestore, this.collectionName));

      // Apply filters
      if (criteria?.status) {
        q = query(q, where('status', '==', criteria.status));
      }
      if (criteria?.clientName) {
        q = query(q, where('clientName', '>=', criteria.clientName), where('clientName', '<=', `${criteria.clientName}\uf8ff`));
      }
      if (criteria?.contractName) {
        q = query(q, where('contractName', '>=', criteria.contractName), where('contractName', '<=', `${criteria.contractName}\uf8ff`));
      }

      // Apply ordering
      q = query(q, orderBy('createdAt', 'desc'));

      // Apply pagination
      const page = criteria?.page || 1;
      const pageSize = criteria?.pageSize || 10;

      if (page > 1) {
        // For pagination, you would need to implement cursor-based pagination
        // This is a simplified version
        q = query(q, limit(pageSize));
      } else {
        q = query(q, limit(pageSize));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.fromFirestoreDoc(doc.data(), doc.id));
    } catch (error) {
      console.error('Error finding all contracts:', error);
      throw new Error(`Failed to find contracts: ${error}`);
    }
  }

  async save(contract: Contract): Promise<void> {
    try {
      const contractData = this.toFirestoreData(contract);

      if (contract.id && contract.id.trim() !== '') {
        // Update existing contract
        const docRef = doc(this.firestore, this.collectionName, contract.id);
        await updateDoc(docRef, contractData);
      } else {
        // Create new contract
        const docRef = collection(this.firestore, this.collectionName);
        const docSnap = await addDoc(docRef, contractData);

        // Update the contract entity with the generated ID
        // Note: This is a side effect, in a real DDD implementation,
        // you might want to return the updated entity or use events
        (contract as any).id = docSnap.id;
      }
    } catch (error) {
      console.error('Error saving contract:', error);
      throw new Error(`Failed to save contract: ${error}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting contract:', error);
      throw new Error(`Failed to delete contract: ${error}`);
    }
  }

  async countByStatus(status: string): Promise<number> {
    try {
      const q = query(collection(this.firestore, this.collectionName), where('status', '==', status));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error counting contracts by status:', error);
      throw new Error(`Failed to count contracts by status: ${error}`);
    }
  }

  async countAll(): Promise<number> {
    try {
      const q = query(collection(this.firestore, this.collectionName));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error counting all contracts:', error);
      throw new Error(`Failed to count all contracts: ${error}`);
    }
  }

  private fromFirestoreDoc(data: DocumentData, id: string): Contract {
    return new Contract(
      id,
      new ContractNumber(data['contractNumber']),
      new ClientName(data['clientName']),
      new ClientRepresentative(data['clientRepresentative']),
      new ContactPerson(data['contactPerson']),
      new ContractName(data['contractName']),
      new Money(data['amount']),
      new ContractStatus(data['status']),
      data['contactPhone'] ? new ContactPhone(data['contactPhone']) : undefined,
      data['notes'] ? new Notes(data['notes']) : undefined,
      data['createdAt']?.toDate() || new Date(),
      data['updatedAt']?.toDate() || new Date()
    );
  }

  private toFirestoreData(contract: Contract): any {
    const data: any = {
      contractNumber: contract.contractNumber.getValue(),
      clientName: contract.clientName.getValue(),
      clientRepresentative: contract.clientRepresentative.getValue(),
      contactPerson: contract.contactPerson.getValue(),
      contractName: contract.contractName.getValue(),
      amount: contract.amount.getAmount(),
      status: contract.status.getValue(),
      createdAt: Timestamp.fromDate(contract.createdAt),
      updatedAt: Timestamp.fromDate(contract.updatedAt)
    };

    // Add optional fields if they exist
    if (contract.contactPhone) {
      data.contactPhone = contract.contactPhone.getValue();
    }
    if (contract.notes) {
      data.notes = contract.notes.getValue();
    }

    return data;
  }
}
