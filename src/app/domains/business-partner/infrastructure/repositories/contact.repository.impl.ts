import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Observable, map, from } from 'rxjs';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactRepository } from '../../domain/repositories/contact.repository.interface';

/**
 * 使用 @angular/fire 實現的聯絡人倉儲
 */
@Injectable({
    providedIn: 'root'
})
export class ContactRepositoryImpl implements ContactRepository {
    private readonly firestore = inject(Firestore);
    private readonly collectionName = 'contacts';

    getAll(): Observable<Contact[]> {
        const contactsRef = collection(this.firestore, this.collectionName);
        return collectionData(contactsRef, { idField: 'id' }).pipe(
            map(docs => docs.map(doc => Contact.fromFirestore(doc.id, doc)))
        );
    }

    getById(id: string): Observable<Contact | null> {
        const contactRef = doc(this.firestore, this.collectionName, id);
        return docData(contactRef, { idField: 'id' }).pipe(
            map(doc => doc ? Contact.fromFirestore(id, doc) : null)
        );
    }

    create(contact: Contact): Observable<Contact> {
        const contactsRef = collection(this.firestore, this.collectionName);
        return from(addDoc(contactsRef, contact.toFirestore())).pipe(
            map(docRef => {
                // 重建聯絡人實體，使用 Firestore 生成的 ID
                return Contact.fromFirestore(docRef.id, contact.toFirestore());
            })
        );
    }

    update(id: string, contact: Contact): Observable<Contact> {
        const contactRef = doc(this.firestore, this.collectionName, id);
        return from(updateDoc(contactRef, contact.toFirestore())).pipe(
            map(() => contact)
        );
    }

    delete(id: string): Observable<void> {
        const contactRef = doc(this.firestore, this.collectionName, id);
        return from(deleteDoc(contactRef));
    }

    search(query: string): Observable<Contact[]> {
        if (!query.trim()) {
            return this.getAll();
        }

        // 簡化搜尋：獲取所有數據並在客戶端過濾
        return this.getAll().pipe(
            map(contacts => contacts.filter(contact =>
                contact.fullName.toLowerCase().includes(query.toLowerCase()) ||
                contact.email.toLowerCase().includes(query.toLowerCase()) ||
                contact.phone.includes(query)
            ))
        );
    }
}
