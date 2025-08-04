import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  DocumentData
} from '@angular/fire/firestore';

import { Contact } from '../../domain/entities/contact.entity';
import { Principal } from '../../domain/entities/principal.entity';
import { PrincipalRepository } from '../../domain/repositories/principal.repository';
import { ContactEmail } from '../../domain/value-objects/principal/contact-email.value-object';
import { ContactPerson } from '../../domain/value-objects/principal/contact-person.value-object';
import { ContactPhone } from '../../domain/value-objects/principal/contact-phone.value-object';
import { PrincipalId } from '../../domain/value-objects/principal/principal-id.value-object';
import { PrincipalName } from '../../domain/value-objects/principal/principal-name.value-object';
import { WorkflowStep } from '../../interface/components/principal/principal-workflow.component';

/**
 * Firebase implementation of PrincipalRepository
 * Uses @angular/fire for all Firebase operations
 */
@Injectable({
  providedIn: 'root'
})
export class FirebasePrincipalRepository implements PrincipalRepository {
  private readonly collectionName = 'principals';

  constructor(private firestore: Firestore) {}

  /**
   * Find principal by ID
   */
  async findById(id: string): Promise<Principal | null> {
    try {
      const principalDoc = doc(this.firestore, this.collectionName, id);
      const principalSnapshot = await getDoc(principalDoc);

      if (principalSnapshot.exists()) {
        return this.mapFromFirestore(principalSnapshot.data(), principalSnapshot.id);
      }

      return null;
    } catch (error) {
      console.error('Error finding principal by ID:', error);
      throw new Error('Failed to find principal by ID');
    }
  }

  /**
   * Find principal by name
   */
  async findByName(name: string): Promise<Principal | null> {
    try {
      const principalsRef = collection(this.firestore, this.collectionName);
      const q = query(principalsRef, where('name', '==', name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return this.mapFromFirestore(doc.data(), doc.id);
      }

      return null;
    } catch (error) {
      console.error('Error finding principal by name:', error);
      throw new Error('Failed to find principal by name');
    }
  }

  /**
   * Find all principals with optional status filtering
   */
  async findAll(status?: string): Promise<Principal[]> {
    try {
      const principalsRef = collection(this.firestore, this.collectionName);
      let q = query(principalsRef, orderBy('createdAt', 'desc'));

      if (status) {
        q = query(principalsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapFromFirestore(doc.data(), doc.id));
    } catch (error) {
      console.error('Error finding all principals:', error);
      throw new Error('Failed to find all principals');
    }
  }

  /**
   * Save principal (create or update)
   */
  async save(principal: Principal): Promise<void> {
    try {
      const principalData = this.mapToFirestore(principal);
      const principalDoc = doc(this.firestore, this.collectionName, principal.id.getValue());
      await setDoc(principalDoc, principalData);
    } catch (error) {
      console.error('Error saving principal:', error);
      throw new Error('Failed to save principal');
    }
  }

  /**
   * Delete principal by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const principalDoc = doc(this.firestore, this.collectionName, id);
      await deleteDoc(principalDoc);
    } catch (error) {
      console.error('Error deleting principal:', error);
      throw new Error('Failed to delete principal');
    }
  }

  /**
   * Check if principal exists by name
   */
  async existsByName(name: string): Promise<boolean> {
    try {
      const principal = await this.findByName(name);
      return principal !== null;
    } catch (error) {
      console.error('Error checking principal existence by name:', error);
      throw new Error('Failed to check principal existence');
    }
  }

  /**
   * Get total count of principals
   */
  async count(): Promise<number> {
    try {
      const principalsRef = collection(this.firestore, this.collectionName);
      const querySnapshot = await getDocs(principalsRef);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error counting principals:', error);
      throw new Error('Failed to count principals');
    }
  }

  /**
   * Find principals by status
   */
  async findByStatus(status: string): Promise<Principal[]> {
    try {
      const principalsRef = collection(this.firestore, this.collectionName);
      const q = query(principalsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapFromFirestore(doc.data(), doc.id));
    } catch (error) {
      console.error('Error finding principals by status:', error);
      throw new Error('Failed to find principals by status');
    }
  }

  /**
   * Map Firestore document to Principal entity
   */
  private mapFromFirestore(data: DocumentData, id: string): Principal {
    const contacts = (data['contacts'] || []).map((contactData: any) => {
      return Contact.create({
        name: ContactPerson.fromString(contactData.name),
        email: ContactEmail.fromString(contactData.email),
        phone: ContactPhone.fromString(contactData.phone)
      });
    });

    const workflowSteps = (data['workflowSteps'] || []).map((stepData: any) => {
      return {
        id: stepData.id,
        name: stepData.name,
        type: stepData.type,
        order: stepData.order,
        config: stepData.config || {},
        description: stepData.description,
        isActive: stepData.isActive !== undefined ? stepData.isActive : true,
        stateTransitions: stepData.stateTransitions || []
      } as WorkflowStep;
    });

    return Principal.create({
      name: PrincipalName.fromString(data['name']),
      status: data['status'],
      description: data['description'],
      contacts: contacts,
      workflowSteps: workflowSteps
    });
  }

  /**
   * Map Principal entity to Firestore document
   */
  private mapToFirestore(principal: Principal): DocumentData {
    const contacts = principal.contacts.map(contact => ({
      name: contact.name.getValue(),
      email: contact.email.getValue(),
      phone: contact.phone.getValue()
    }));

    const workflowSteps = principal.workflowSteps.map(step => ({
      id: step.id,
      name: step.name,
      type: step.type,
      order: step.order,
      config: step.config,
      description: step.description,
      isActive: step.isActive,
      stateTransitions: step.stateTransitions
    }));

    return {
      name: principal.name.getValue(),
      status: principal.status,
      description: principal.description,
      contacts: contacts,
      workflowSteps: workflowSteps,
      createdAt: principal.createdAt,
      updatedAt: principal.updatedAt
    };
  }
}
