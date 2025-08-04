import { Injectable } from '@angular/core';
import { Principal } from '../../domain/entities/principal.entity';
import { PrincipalRepository } from '../../domain/repositories/principal.repository';
import { PrincipalName } from '../../domain/value-objects/principal/principal-name.value-object';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactPerson } from '../../domain/value-objects/principal/contact-person.value-object';
import { ContactEmail } from '../../domain/value-objects/principal/contact-email.value-object';
import { ContactPhone } from '../../domain/value-objects/principal/contact-phone.value-object';
import { WorkflowStep } from '../../interface/components/principal/principal-workflow.component';

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
        ],
        workflowSteps: [
          {
            id: '1',
            name: '請款申請',
            type: 'application',
            order: 0,
            config: {
              required: true,
              autoApprove: false,
              timeout: 24
            },
            description: '提交請款申請',
            isActive: true,
            stateTransitions: [
              {
                id: '1-1',
                fromState: 'draft',
                toState: 'submitted',
                action: 'submit',
                description: '提交申請',
                isActive: true
              },
              {
                id: '1-2',
                fromState: 'submitted',
                toState: 'withdrawn',
                action: 'withdraw',
                description: '撤回申請',
                isActive: true
              }
            ]
          },
          {
            id: '2',
            name: '部門審核',
            type: 'review',
            order: 1,
            config: {
              required: true,
              approvers: ['部門主管'],
              minApprovers: 1,
              approvalLevel: 1
            },
            description: '部門主管初步審核',
            isActive: true,
            stateTransitions: [
              {
                id: '2-1',
                fromState: 'submitted',
                toState: 'under_review',
                action: 'submit',
                description: '開始審核',
                isActive: true
              },
              {
                id: '2-2',
                fromState: 'under_review',
                toState: 'approved',
                action: 'approve',
                description: '通過審核',
                isActive: true
              },
              {
                id: '2-3',
                fromState: 'under_review',
                toState: 'rejected',
                action: 'reject',
                description: '拒絕申請',
                isActive: true
              }
            ]
          },
          {
            id: '3',
            name: '財務檢查',
            type: 'finance_check',
            order: 2,
            config: {
              required: true,
              amountLimit: 100000,
              currency: 'TWD',
              budgetCode: 'FIN001'
            },
            description: '財務合規性檢查',
            isActive: true,
            stateTransitions: [
              {
                id: '3-1',
                fromState: 'approved',
                toState: 'finance_check',
                action: 'submit',
                description: '開始財務檢查',
                isActive: true
              },
              {
                id: '3-2',
                fromState: 'finance_check',
                toState: 'payment_processing',
                action: 'approve',
                description: '財務檢查通過',
                isActive: true
              }
            ]
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
        ],
        workflowSteps: [
          {
            id: '1',
            name: '請款申請',
            type: 'application',
            order: 0,
            config: {
              required: true,
              autoApprove: false,
              timeout: 24
            },
            description: '提交請款申請',
            isActive: true,
            stateTransitions: []
          }
        ]
      },
      {
        name: 'DEF Solutions',
        status: 'inactive' as const,
        description: 'Consulting services',
        contacts: [],
        workflowSteps: []
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

      const workflowSteps = data.workflowSteps.map((stepData: any) => ({
        id: stepData.id,
        name: stepData.name,
        type: stepData.type,
        order: stepData.order,
        config: stepData.config,
        description: stepData.description,
        isActive: stepData.isActive,
        stateTransitions: stepData.stateTransitions
      })) as WorkflowStep[];

      return Principal.create({
        name: PrincipalName.fromString(data.name),
        status: data.status,
        description: data.description,
        contacts: contacts,
        workflowSteps: workflowSteps
      });
    });
  }
} 