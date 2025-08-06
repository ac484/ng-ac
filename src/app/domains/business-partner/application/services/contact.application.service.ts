import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactDomainService } from '../../domain/services/contact.service';
import { CreateContactDto, UpdateContactDto, ContactResponseDto, ContactSearchDto } from '../dto/contact.dto';

@Injectable({
    providedIn: 'root'
})
export class ContactApplicationService {
    constructor(private contactDomainService: ContactDomainService) { }

    getAllContacts(): Observable<ContactResponseDto[]> {
        return this.contactDomainService.loadContacts().pipe(
            map(contacts => contacts.map(contact => this.mapToResponseDto(contact)))
        );
    }

    getContactById(id: string): Observable<ContactResponseDto | null> {
        return this.contactDomainService.getContactById(id).pipe(
            map(contact => contact ? this.mapToResponseDto(contact) : null)
        );
    }

    createContact(dto: CreateContactDto): Observable<ContactResponseDto> {
        const contactData = {
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            status: dto.status
        };
        return this.contactDomainService.createContact(contactData).pipe(
            map(contact => this.mapToResponseDto(contact))
        );
    }

    updateContact(id: string, dto: UpdateContactDto): Observable<ContactResponseDto> {
        return this.contactDomainService.updateContact(id, dto).pipe(
            map(contact => this.mapToResponseDto(contact))
        );
    }

    deleteContact(id: string): Observable<void> {
        return this.contactDomainService.deleteContact(id);
    }

    searchContacts(dto: ContactSearchDto): Observable<ContactResponseDto[]> {
        return this.contactDomainService.searchContacts(dto.query).pipe(
            map(contacts => contacts.map(contact => this.mapToResponseDto(contact)))
        );
    }

    selectContact(contact: ContactResponseDto | null): void {
        if (contact) {
            // Convert back to domain entity for selection
            const domainContact = this.mapToDomainEntity(contact);
            this.contactDomainService.selectContact(domainContact);
        } else {
            this.contactDomainService.selectContact(null);
        }
    }

    getSelectedContact(): Observable<ContactResponseDto | null> {
        return this.contactDomainService.selectedContact$.pipe(
            map(contact => contact ? this.mapToResponseDto(contact) : null)
        );
    }

    private mapToResponseDto(contact: Contact): ContactResponseDto {
        return {
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            status: contact.status,
            createdAt: contact.createdAt.toISOString(),
            updatedAt: contact.updatedAt.toISOString(),
            fullName: contact.fullName,
            initials: contact.initials
        };
    }

    private mapToDomainEntity(dto: ContactResponseDto): Contact {
        return new Contact(
            dto.id,
            dto.firstName,
            dto.lastName,
            dto.email,
            dto.phone,
            dto.status,
            new Date(dto.createdAt),
            new Date(dto.updatedAt)
        );
    }
}
