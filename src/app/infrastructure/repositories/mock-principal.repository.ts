import { Injectable } from '@angular/core';
import { Principal } from '../../domain/entities/principal.entity';
import { PrincipalRepository } from '../../domain/repositories/principal.repository';
import { PrincipalName } from '../../domain/value-objects/principal/principal-name.value-object';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactPerson } from '../../domain/value-objects/principal/contact-person.value-object';
import { ContactEmail } from '../../domain/value-objects/principal/contact-email.value-object';
import { ContactPhone } from '../../domain/value-objects/principal/contact-phone.value-object';

/**
 * Mock implementation of PrincipalRepository for development and testing
 */
@Injectable({
  providedIn: 'root'
})
export class MockPrincipalRepository implements PrincipalRepository {

  private principals: Principal[] = [];

  constructor() {
    this.initializeMockData();
  }

  /**
   * Find principal by ID
   */
  async findById(id: string): Promise<Principal | null> {
    const principal = this.principals.find(p => p.id.getValue() === id);
    return principal || null;
  }

  /**
   * Find principal by name
   */
  async findByName(name: string): Promise<Principal | null> {
    const principal = this.principals.find(p => p.name.getValue() === name);
    return principal || null;
  }

  /**
   * Find all principals with optional status filtering
   */
  async findAll(status?: string): Promise<Principal[]> {
    if (status) {
      return this.principals.filter(p => p.status === status);
    }
    return [...this.principals];
  }

  /**
   * Save principal (create or update)
   */
  async save(principal: Principal): Promise<void> {
    const existingIndex = this.principals.findIndex(p => p.id.getValue() === principal.id.getValue());
    
    if (existingIndex !== -1) {
      this.principals[existingIndex] = principal;
    } else {
      this.principals.push(principal);
    }
  }

  /**
   * Delete principal by ID
   */
  async delete(id: string): Promise<void> {
    this.principals = this.principals.filter(p => p.id.getValue() !== id);
  }

  /**
   * Check if principal exists by name
   */
  async existsByName(name: string): Promise<boolean> {
    return this.principals.some(p => p.name.getValue() === name);
  }

  /**
   * Get total count of principals
   */
  async count(): Promise<number> {
    return this.principals.length;
  }

  /**
   * Find principals by status
   */
  async findByStatus(status: string): Promise<Principal[]> {
    return this.principals.filter(p => p.status === status);
  }

  /**
   * Initialize mock data
   */
  private initializeMockData(): void {
    const mockPrincipals = [
      {
        name: 'ABC Corporation',
        status: 'active' as const,
        description: 'Leading technology company',
        contacts: [
          {
            name: 'John Smith',
            email: 'john.smith@abc.com',
            phone: '+1-555-0101'
          },
          {
            name: 'Jane Doe',
            email: 'jane.doe@abc.com',
            phone: '+1-555-0102'
          }
        ]
      },
      {
        name: 'XYZ Industries',
        status: 'active' as const,
        description: 'Manufacturing and logistics',
        contacts: [
          {
            name: 'Mike Johnson',
            email: 'mike.johnson@xyz.com',
            phone: '+1-555-0201'
          }
        ]
      },
      {
        name: 'DEF Solutions',
        status: 'inactive' as const,
        description: 'Consulting services',
        contacts: []
      }
    ];

    this.principals = mockPrincipals.map(data => {
      const contacts = data.contacts.map(contactData => 
        Contact.create({
          name: ContactPerson.fromString(contactData.name),
          email: ContactEmail.fromString(contactData.email),
          phone: ContactPhone.fromString(contactData.phone)
        })
      );

      return Principal.create({
        name: PrincipalName.fromString(data.name),
        status: data.status,
        description: data.description,
        contacts: contacts
      });
    });
  }
} 