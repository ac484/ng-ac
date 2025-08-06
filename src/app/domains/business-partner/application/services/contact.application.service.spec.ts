import { TestBed } from '@angular/core/testing';
import { ContactApplicationService } from './contact.application.service';
import { ContactRepositoryImpl } from '../../infrastructure/repositories/contact.repository.impl';
import { Contact } from '../../domain/entities/contact.entity';
import { CreateContactDto, UpdateContactDto, ContactResponseDto } from '../dto/create-contact.dto';
import { of, throwError } from 'rxjs';

describe('ContactApplicationService', () => {
    let service: ContactApplicationService;
    let mockRepository: jasmine.SpyObj<ContactRepositoryImpl>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('ContactRepositoryImpl', [
            'getAll', 'getById', 'create', 'update', 'delete', 'search'
        ]);

        TestBed.configureTestingModule({
            providers: [
                ContactApplicationService,
                { provide: ContactRepositoryImpl, useValue: spy }
            ]
        });

        service = TestBed.inject(ContactApplicationService);
        mockRepository = TestBed.inject(ContactRepositoryImpl) as jasmine.SpyObj<ContactRepositoryImpl>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAllContacts', () => {
        it('should return contacts from repository', (done) => {
            const mockContacts = [
                Contact.create({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                    status: true
                })
            ];

            mockRepository.getAll.and.returnValue(of(mockContacts));

            service.getAllContacts().subscribe({
                next: (contacts) => {
                    expect(contacts).toBeDefined();
                    expect(contacts.length).toBe(1);
                    expect(contacts[0].firstName).toBe('John');
                    done();
                },
                error: done.fail
            });
        });

        it('should handle repository errors', (done) => {
            const error = new Error('Repository error');
            mockRepository.getAll.and.returnValue(throwError(() => error));

            service.getAllContacts().subscribe({
                next: () => done.fail('Should have failed'),
                error: (err) => {
                    expect(err).toBe(error);
                    done();
                }
            });
        });
    });

    describe('createContact', () => {
        it('should create contact successfully', (done) => {
            const createDto: CreateContactDto = {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                phone: '0987654321',
                status: true
            };

            const mockContact = Contact.create(createDto);
            mockRepository.create.and.returnValue(of(mockContact));

            service.createContact(createDto).subscribe({
                next: (contact) => {
                    expect(contact).toBeDefined();
                    expect(contact.firstName).toBe('Jane');
                    expect(mockRepository.create).toHaveBeenCalledWith(jasmine.any(Contact));
                    done();
                },
                error: done.fail
            });
        });
    });

    describe('updateContact', () => {
        it('should update contact successfully', (done) => {
            const contactId = 'test-id';
            const updateDto: UpdateContactDto = {
                firstName: 'Updated',
                email: 'updated@example.com'
            };

            const mockContact = Contact.create({
                firstName: 'Original',
                lastName: 'Contact',
                email: 'original@example.com',
                phone: '1234567890',
                status: true
            });

            mockRepository.getById.and.returnValue(of(mockContact));
            mockRepository.update.and.returnValue(of(mockContact));

            service.updateContact(contactId, updateDto).subscribe({
                next: (contact) => {
                    expect(contact).toBeDefined();
                    expect(mockRepository.getById).toHaveBeenCalledWith(contactId);
                    expect(mockRepository.update).toHaveBeenCalledWith(contactId, jasmine.any(Contact));
                    done();
                },
                error: done.fail
            });
        });

        it('should throw error when contact not found', (done) => {
            const contactId = 'non-existent-id';
            const updateDto: UpdateContactDto = { firstName: 'Updated' };

            mockRepository.getById.and.returnValue(of(null));

            service.updateContact(contactId, updateDto).subscribe({
                next: () => done.fail('Should have failed'),
                error: (error) => {
                    expect(error.message).toBe('Contact not found');
                    done();
                }
            });
        });
    });

    describe('deleteContact', () => {
        it('should delete contact successfully', (done) => {
            const contactId = 'test-id';
            mockRepository.delete.and.returnValue(of(void 0));

            service.deleteContact(contactId).subscribe({
                next: () => {
                    expect(mockRepository.delete).toHaveBeenCalledWith(contactId);
                    done();
                },
                error: done.fail
            });
        });
    });

    describe('searchContacts', () => {
        it('should search contacts successfully', (done) => {
            const query = 'john';
            const mockContacts = [
                Contact.create({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phone: '1234567890',
                    status: true
                })
            ];

            mockRepository.search.and.returnValue(of(mockContacts));

            service.searchContacts(query).subscribe({
                next: (contacts) => {
                    expect(contacts).toBeDefined();
                    expect(contacts.length).toBe(1);
                    expect(mockRepository.search).toHaveBeenCalledWith(query);
                    done();
                },
                error: done.fail
            });
        });
    });
});
