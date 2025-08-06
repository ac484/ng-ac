import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, DocumentReference } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Contract, ContractId } from '../../domain/entities/contract.entity';
import { ContractRepository } from '../../domain/repositories/contract.repository';

@Injectable({
  providedIn: 'root'
})
export class FirestoreContractRepository implements ContractRepository {
  private firestore = inject(Firestore);
  private collectionName = 'contracts';

  getAll(): Observable<ContractId[]> {
    const contractsCollection = collection(this.firestore, this.collectionName);
    return collectionData(contractsCollection, { idField: 'id' }) as Observable<ContractId[]>;
  }

  getById(id: string): Observable<ContractId | undefined> {
    const contractDoc = doc(this.firestore, this.collectionName, id);
    return docData(contractDoc, { idField: 'id' }) as Observable<ContractId | undefined>;
  }

  async create(contract: Contract): Promise<string> {
    const contractsCollection = collection(this.firestore, this.collectionName);
    const contractWithTimestamps = {
      ...contract,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(contractsCollection, contractWithTimestamps);
    return docRef.id;
  }

  async update(id: string, contract: Partial<Contract>): Promise<void> {
    const contractDoc = doc(this.firestore, this.collectionName, id);
    const updateData = {
      ...contract,
      updatedAt: new Date()
    };
    
    await updateDoc(contractDoc, updateData);
  }

  async delete(id: string): Promise<void> {
    const contractDoc = doc(this.firestore, this.collectionName, id);
    await deleteDoc(contractDoc);
  }
}
