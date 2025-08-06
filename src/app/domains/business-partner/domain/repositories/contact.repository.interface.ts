import { Contact } from '../entities/contact.entity';
import { Observable } from 'rxjs';

export interface ContactRepository {
    getAll(): Observable<Contact[]>;
    getById(id: string): Observable<Contact | null>;
    create(contact: { firstName: string; lastName: string; email: string; phone: string; status: boolean }): Observable<Contact>;
    update(id: string, contact: Partial<Contact>): Observable<Contact>;
    delete(id: string): Observable<void>;
    search(query: string): Observable<Contact[]>;
}
