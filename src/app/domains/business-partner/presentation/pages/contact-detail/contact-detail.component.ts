import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactApplicationService } from '../../../application/services/contact.application.service';
import { ContactResponseDto } from '../../../application/dto/contact.dto';

@Component({
    selector: 'app-contact-detail',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="contact-detail-container">
      <div class="card mb-3" *ngIf="contactDetails; else noContactSelected">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h5 class="card-title mb-0">{{ contactDetails.fullName }}</h5>
            <div class="btn-group">
              <button type="button" class="btn btn-primary btn-sm" (click)="editContact()">Edit</button>
              <button type="button" class="btn btn-danger btn-sm" (click)="deleteContact()">Delete</button>
            </div>
          </div>
          
          <hr>
          
          <div class="contact-info">
            <div class="info-item">
              <strong>Status:</strong>
              <span [class]="contactDetails.status ? 'text-success' : 'text-danger'">
                {{ contactDetails.status ? 'Active' : 'Inactive' }}
              </span>
            </div>
            
            <div class="info-item">
              <strong>Phone:</strong>
              <span>{{ contactDetails.phone }}</span>
            </div>
            
            <div class="info-item">
              <strong>Email:</strong>
              <span>{{ contactDetails.email }}</span>
            </div>
            
            <div class="info-item">
              <strong>Created:</strong>
              <span>{{ contactDetails.createdAt | date:'medium' }}</span>
            </div>
            
            <div class="info-item">
              <strong>Last Updated:</strong>
              <span>{{ contactDetails.updatedAt | date:'medium' }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <ng-template #noContactSelected>
        <div class="no-contact-selected">
          <div class="text-center">
            <i class="fas fa-user-circle fa-3x text-muted mb-3"></i>
            <p class="text-muted">Select a contact to view details</p>
          </div>
        </div>
      </ng-template>
    </div>
  `,
    styles: [`
    .contact-detail-container {
      padding: 16px;
    }
    
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    
    .info-item:last-child {
      border-bottom: none;
    }
    
    .no-contact-selected {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed #e6e6e6;
      border-radius: 8px;
    }
    
    .btn-group {
      display: flex;
      gap: 8px;
    }
  `]
})
export class ContactDetailComponent implements OnInit {
    contactDetails: ContactResponseDto | null = null;

    constructor(private contactApplicationService: ContactApplicationService) { }

    ngOnInit(): void {
        this.contactApplicationService.getSelectedContact().subscribe(contact => {
            this.contactDetails = contact;
        });
    }

    editContact(): void {
        if (this.contactDetails) {
            // This would typically navigate to an edit form
            console.log('Edit contact:', this.contactDetails.id);
        }
    }

    deleteContact(): void {
        if (this.contactDetails && confirm(`Are you sure you want to delete ${this.contactDetails.fullName}?`)) {
            this.contactApplicationService.deleteContact(this.contactDetails.id).subscribe(() => {
                this.contactDetails = null;
                // Reload contacts list
                console.log('Contact deleted successfully');
            });
        }
    }
}

