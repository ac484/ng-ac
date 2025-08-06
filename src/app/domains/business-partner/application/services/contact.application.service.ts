import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactRepositoryImpl } from '../../infrastructure/repositories/contact.repository.impl';
import { CreateContactDto, UpdateContactDto, ContactResponseDto } from '../dto/create-contact.dto';

/**
 * 聯絡人應用服務
 * 協調領域對象和外部服務
 */
@Injectable({
    providedIn: 'root'
})
export class ContactApplicationService {
    private readonly contactRepository = inject(ContactRepositoryImpl);

    getAllContacts(): Observable<ContactResponseDto[]> {
        return this.contactRepository.getAll().pipe(
            map((contacts: Contact[]) => contacts.map(contact => this.toResponseDto(contact)))
        );
    }

    getContactById(id: string): Observable<ContactResponseDto | null> {
        return this.contactRepository.getById(id).pipe(
            map((contact: Contact | null) => contact ? this.toResponseDto(contact) : null)
        );
    }

    createContact(dto: CreateContactDto): Observable<ContactResponseDto> {
        const contact = Contact.create(dto);
        return this.contactRepository.create(contact).pipe(
            map((createdContact: Contact) => this.toResponseDto(createdContact))
        );
    }

    updateContact(id: string, dto: UpdateContactDto): Observable<ContactResponseDto> {
        return this.contactRepository.getById(id).pipe(
            switchMap((contact: Contact | null) => {
                if (!contact) {
                    throw new Error('Contact not found');
                }
                contact.update(dto);
                return this.contactRepository.update(id, contact);
            }),
            map((updatedContact: Contact) => this.toResponseDto(updatedContact))
        );
    }

    deleteContact(id: string): Observable<void> {
        return this.contactRepository.delete(id);
    }

    searchContacts(query: string): Observable<ContactResponseDto[]> {
        return this.contactRepository.search(query).pipe(
            map((contacts: Contact[]) => contacts.map(contact => this.toResponseDto(contact)))
        );
    }

    private toResponseDto(contact: Contact): ContactResponseDto {
        return {
            id: contact.contactId, // 修復：使用公共 getter 方法
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            status: contact.status,
            fullName: contact.fullName,
            initials: contact.initials,
            createdAt: contact.createdAt.toISOString(),
            updatedAt: contact.updatedAt.toISOString()
        };
    }
}
