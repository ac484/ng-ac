import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Repository } from '../application/interfaces/repository.interface';
import { BaseEntity } from '../domain/base-entity';

@Injectable()
export abstract class BaseRepository<T extends BaseEntity<TId>, TId> implements Repository<T, TId> {
  protected abstract collectionName: string;

  constructor(protected readonly firestore: AngularFirestore) {}

  async findById(id: TId): Promise<T | null> {
    const doc = await this.firestore.collection(this.collectionName).doc(String(id)).get().toPromise();
    return doc?.exists ? this.toDomain(doc.data()) : null;
  }

  async findAll(): Promise<T[]> {
    const snapshot = await this.firestore.collection(this.collectionName).get().toPromise();
    return snapshot?.docs.map(doc => this.toDomain(doc.data())) || [];
  }

  async save(entity: T): Promise<void> {
    const data = this.toFirestore(entity);
    await this.firestore.collection(this.collectionName).doc(String(entity.id)).set(data);
  }

  async delete(id: TId): Promise<void> {
    await this.firestore.collection(this.collectionName).doc(String(id)).delete();
  }

  async exists(id: TId): Promise<boolean> {
    const doc = await this.firestore.collection(this.collectionName).doc(String(id)).get().toPromise();
    return doc?.exists || false;
  }

  protected abstract toDomain(data: any): T;
  protected abstract toFirestore(entity: T): any;
} 