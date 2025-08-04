import { Injectable, Inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';

import { Contact } from '../../domain/entities/contact.entity';
import { Principal } from '../../domain/entities/principal.entity';
import { PrincipalRepository } from '../../domain/repositories/principal.repository';
import { PRINCIPAL_REPOSITORY } from '../../domain/repositories/repository-tokens';
import { ContactEmail } from '../../domain/value-objects/principal/contact-email.value-object';
import { ContactPerson } from '../../domain/value-objects/principal/contact-person.value-object';
import { ContactPhone } from '../../domain/value-objects/principal/contact-phone.value-object';
import { PrincipalName } from '../../domain/value-objects/principal/principal-name.value-object';
import { WorkflowStep } from '../../interface/components/principal/principal-workflow.component';

export interface CreatePrincipalRequest {
  name: string;
  status: 'active' | 'inactive';
  description?: string;
}

export interface UpdatePrincipalRequest {
  id: string;
  name?: string;
  status?: 'active' | 'inactive';
  description?: string;
}

export interface CreateContactRequest {
  principalId: string;
  name: string;
  email: string;
  phone: string;
}

export interface UpdateContactRequest {
  principalId: string;
  contactId: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface UpdateWorkflowRequest {
  principalId: string;
  workflowSteps: WorkflowStep[];
}

@Injectable({
  providedIn: 'root'
})
export class PrincipalApplicationService {
  constructor(@Inject(PRINCIPAL_REPOSITORY) private principalRepository: PrincipalRepository) {}

  getPrincipals(): Observable<Principal[]> {
    return from(this.principalRepository.findAll());
  }

  getPrincipalById(id: string): Observable<Principal | null> {
    return from(this.principalRepository.findById(id));
  }

  createPrincipal(request: CreatePrincipalRequest): Observable<Principal> {
    return from(this.createPrincipalAsync(request));
  }

  private async createPrincipalAsync(request: CreatePrincipalRequest): Promise<Principal> {
    // Check if principal already exists
    const existingPrincipal = await this.principalRepository.findByName(request.name);
    if (existingPrincipal) {
      throw new Error('Principal with this name already exists');
    }

    const principal = Principal.create({
      name: PrincipalName.fromString(request.name),
      status: request.status,
      description: request.description,
      contacts: [],
      workflowSteps: []
    });

    await this.principalRepository.save(principal);
    return principal;
  }

  updatePrincipal(request: UpdatePrincipalRequest): Observable<Principal | null> {
    return from(this.updatePrincipalAsync(request));
  }

  private async updatePrincipalAsync(request: UpdatePrincipalRequest): Promise<Principal | null> {
    const principal = await this.principalRepository.findById(request.id);
    if (!principal) {
      return null;
    }

    if (request.name) {
      principal.updateName(PrincipalName.fromString(request.name));
    }

    if (request.status) {
      principal.updateStatus(request.status);
    }

    if (request.description !== undefined) {
      principal.updateDescription(request.description);
    }

    await this.principalRepository.save(principal);
    return principal;
  }

  deletePrincipal(id: string): Observable<boolean> {
    return from(this.deletePrincipalAsync(id));
  }

  private async deletePrincipalAsync(id: string): Promise<boolean> {
    const principal = await this.principalRepository.findById(id);
    if (!principal) {
      return false;
    }

    await this.principalRepository.delete(id);
    return true;
  }

  createContact(request: CreateContactRequest): Observable<Contact | null> {
    return from(this.createContactAsync(request));
  }

  private async createContactAsync(request: CreateContactRequest): Promise<Contact | null> {
    const principal = await this.principalRepository.findById(request.principalId);
    if (!principal) {
      return null;
    }

    const contact = Contact.create({
      name: ContactPerson.fromString(request.name),
      email: ContactEmail.fromString(request.email),
      phone: ContactPhone.fromString(request.phone)
    });

    principal.addContact(contact);
    await this.principalRepository.save(principal);
    return contact;
  }

  updateContact(request: UpdateContactRequest): Observable<Contact | null> {
    return from(this.updateContactAsync(request));
  }

  private async updateContactAsync(request: UpdateContactRequest): Promise<Contact | null> {
    const principal = await this.principalRepository.findById(request.principalId);
    if (!principal) {
      return null;
    }

    const contact = principal.contacts.find(c => c.id === request.contactId);
    if (!contact) {
      return null;
    }

    if (request.name) {
      contact.updateName(ContactPerson.fromString(request.name));
    }

    if (request.email) {
      contact.updateEmail(ContactEmail.fromString(request.email));
    }

    if (request.phone) {
      contact.updatePhone(ContactPhone.fromString(request.phone));
    }

    principal.updateContact(contact);
    await this.principalRepository.save(principal);
    return contact;
  }

  deleteContact(principalId: string, contactId: string): Observable<boolean> {
    return from(this.deleteContactAsync(principalId, contactId));
  }

  private async deleteContactAsync(principalId: string, contactId: string): Promise<boolean> {
    const principal = await this.principalRepository.findById(principalId);
    if (!principal) {
      return false;
    }

    principal.removeContact(contactId);
    await this.principalRepository.save(principal);
    return true;
  }

  updateWorkflow(request: UpdateWorkflowRequest): Observable<boolean> {
    return from(this.updateWorkflowAsync(request));
  }

  private async updateWorkflowAsync(request: UpdateWorkflowRequest): Promise<boolean> {
    const principal = await this.principalRepository.findById(request.principalId);
    if (!principal) {
      return false;
    }

    principal.updateWorkflowSteps(request.workflowSteps);
    await this.principalRepository.save(principal);
    return true;
  }
}
