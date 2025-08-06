import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../entities/contact.entity';
import { ContactRepository } from '../repositories/contact.repository.interface';

@Injectable({
    providedIn: 'root'
})
export class ContactDomainService {
    private contactsSubject = new BehaviorSubject<Contact[]>([]);
    private selectedContactSubject = new BehaviorSubject<Contact | null>(null);

    constructor(private contactRepository: ContactRepository) { }

    get contacts$(): Observable<Contact[]> {
        return this.contactsSubject.asObservable();
    }

    get selectedContact$(): Observable<Contact | null> {
        return this.selectedContactSubject.asObservable();
    }

    loadContacts(): Observable<Contact[]> {
        return this.contactRepository.getAll();
    }

    selectContact(contact: Contact | null): void {
        this.selectedContactSubject.next(contact);
    }

    createContact(contactData: { firstName: string; lastName: string; email: string; phone: string; status: boolean }): Observable<Contact> {
        return this.contactRepository.create(contactData);
    }

    updateContact(id: string, contactData: Partial<Contact>): Observable<Contact> {
        return this.contactRepository.update(id, contactData);
    }

    deleteContact(id: string): Observable<void> {
        return this.contactRepository.delete(id);
    }

    searchContacts(query: string): Observable<Contact[]> {
        return this.contactRepository.search(query);
    }

    updateContactsList(contacts: Contact[]): void {
        this.contactsSubject.next(contacts);
    }

    getContactById(id: string): Observable<Contact | null> {
        return this.contactRepository.getById(id);
    }
}
