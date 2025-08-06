import {
  Firestore,
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  QueryConstraint
} from '@angular/fire/firestore';
import { RepositoryError } from '../../domain/errors/custom-errors';

export interface SearchCriteria {
  [key: string]: any;
}

export abstract class BaseFirebaseRepository<T> {
  constructor(
    protected firestore: Firestore,
    protected collectionName: string
  ) {}

  async findById(id: string): Promise<T | null> {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return this.fromFirestore(docSnap.data(), docSnap.id);
      }
      return null;
    } catch (error) {
      throw new RepositoryError(`Failed to find ${this.collectionName}`, error as Error);
    }
  }

  async findAll(criteria?: SearchCriteria): Promise<T[]> {
    try {
      const q = query(collection(this.firestore, this.collectionName), ...this.applySearchCriteria(criteria));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => this.fromFirestore(doc.data(), doc.id));
    } catch (error) {
      throw new RepositoryError(`Failed to find all ${this.collectionName}`, error as Error);
    }
  }

  async save(entity: T & { id: string }): Promise<void> {
    try {
      const data = this.toFirestore(entity);
      const docRef = doc(this.firestore, this.collectionName, entity.id);
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      throw new RepositoryError(`Failed to save ${this.collectionName}`, error as Error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw new RepositoryError(`Failed to delete ${this.collectionName}`, error as Error);
    }
  }

  protected abstract fromFirestore(data: any, id: string): T;
  protected abstract toFirestore(entity: T): any;
  protected applySearchCriteria(criteria?: SearchCriteria): QueryConstraint[] {
    const constraints: QueryConstraint[] = [];
    if (!criteria) {
      return constraints;
    }

    if (criteria['orderBy']) {
      constraints.push(orderBy(criteria['orderBy'], criteria['orderDirection'] || 'asc'));
    }
    if (criteria['limit']) {
      constraints.push(limit(criteria['limit']));
    }
    if (criteria['startAfter']) {
      constraints.push(startAfter(criteria['startAfter']));
    }
    // Add more constraints like where clauses as needed
    Object.keys(criteria).forEach(key => {
      if (key !== 'orderBy' && key !== 'orderDirection' && key !== 'limit' && key !== 'startAfter') {
        constraints.push(where(key, '==', criteria[key]));
      }
    });

    return constraints;
  }
} 