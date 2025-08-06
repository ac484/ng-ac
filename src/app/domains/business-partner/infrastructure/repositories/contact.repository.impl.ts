import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactRepository } from '../../domain/repositories/contact.repository.interface';

@Injectable({
    providedIn: 'root'
})
export class ContactRepositoryImpl implements ContactRepository {
    private readonly baseUrl = 'https://recipe-book-70db1-default-rtdb.firebaseio.com/contact-book.json';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Contact[]> {
        return this.http.get<any[]>(this.baseUrl).pipe(
            map(response => {
                if (!response) return [];
                return Object.entries(response).map(([id, data]: [string, any]) =>
                    new Contact(
                        id,
                        data.firstName || data.fname || '',
                        data.lastName || data.lname || '',
                        data.email || '',
                        data.phone || '',
                        data.status || false,
                        new Date(data.createdAt || Date.now()),
                        new Date(data.updatedAt || Date.now())
                    )
                );
            })
        );
    }

    getById(id: string): Observable<Contact | null> {
        return this.http.get<any>(`${this.baseUrl.replace('.json', '')}/${id}.json`).pipe(
            map(data => {
                if (!data) return null;
                return new Contact(
                    id,
                    data.firstName || data.fname || '',
                    data.lastName || data.lname || '',
                    data.email || '',
                    data.phone || '',
                    data.status || false,
                    new Date(data.createdAt || Date.now()),
                    new Date(data.updatedAt || Date.now())
                );
            })
        );
    }

    create(contactData: { firstName: string; lastName: string; email: string; phone: string; status: boolean }): Observable<Contact> {
        const newContact = {
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            email: contactData.email,
            phone: contactData.phone,
            status: contactData.status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return this.http.post<{ name: string }>(this.baseUrl, newContact).pipe(
            map(response => new Contact(
                response.name,
                contactData.firstName,
                contactData.lastName,
                contactData.email,
                contactData.phone,
                contactData.status,
                new Date(),
                new Date()
            ))
        );
    }

    update(id: string, contactData: Partial<Contact>): Observable<Contact> {
        const updateData = {
            ...contactData,
            updatedAt: new Date().toISOString()
        };

        return this.http.patch<any>(`${this.baseUrl.replace('.json', '')}/${id}.json`, updateData).pipe(
            map(() => {
                // Return updated contact - in a real implementation, you'd get the full updated object
                return new Contact(
                    id,
                    contactData.firstName || '',
                    contactData.lastName || '',
                    contactData.email || '',
                    contactData.phone || '',
                    contactData.status || false,
                    new Date(),
                    new Date()
                );
            })
        );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl.replace('.json', '')}/${id}.json`);
    }

    search(query: string): Observable<Contact[]> {
        return this.getAll().pipe(
            map(contacts => contacts.filter(contact =>
                contact.fullName.toLowerCase().includes(query.toLowerCase()) ||
                contact.email.toLowerCase().includes(query.toLowerCase()) ||
                contact.phone.includes(query)
            ))
        );
    }
}
