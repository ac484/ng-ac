import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { UserMapper } from '../mappers/user.mapper';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserFirebaseRepository extends UserRepository {
  private readonly collection;

  constructor(
    private readonly firestore: Firestore,
    private readonly mapper: UserMapper
  ) {
    super();
    this.collection = collection(this.firestore, 'users');
  }

  async findById(id: UserId): Promise<User | null> {
    const docRef = doc(this.firestore, `users/${id.value}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? this.mapper.toDomain(docSnap.data()) : null;
  }

  async findAll(): Promise<User[]> {
    const querySnapshot = await getDocs(this.collection);
    return querySnapshot.docs.map(doc => this.mapper.toDomain(doc.data()));
  }

  async save(entity: User): Promise<void> {
    const docRef = doc(this.firestore, `users/${entity.id.value}`);
    const data = this.mapper.toFirestore(entity);
    return setDoc(docRef, data, { merge: true });
  }

  async delete(id: UserId): Promise<void> {
    const docRef = doc(this.firestore, `users/${id.value}`);
    return deleteDoc(docRef);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const q = query(this.collection, where("email", "==", email.value));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    return this.mapper.toDomain(querySnapshot.docs[0].data());
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}
