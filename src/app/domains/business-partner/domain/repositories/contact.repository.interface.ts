import { Observable } from 'rxjs';
import { Contact } from '../entities/contact.entity';

/**
 * 聯絡人倉儲介面
 */
export interface ContactRepository {
    getAll(): Observable<Contact[]>;
    getById(id: string): Observable<Contact | null>;
    create(contact: Contact): Observable<Contact>;
    update(id: string, contact: Contact): Observable<Contact>;
    delete(id: string): Observable<void>;
    search(query: string): Observable<Contact[]>;
}
