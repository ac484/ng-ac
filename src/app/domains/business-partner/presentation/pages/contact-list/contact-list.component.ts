import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactApplicationService } from '../../../application/services/contact.application.service';
import { ContactResponseDto } from '../../../application/dto/contact.dto';

@Component({
    selector: 'app-contact-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="contact-list-container">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h4>Contacts</h4>
        <button class="btn btn-primary btn-sm" (click)="addNewContact()">Add new contact</button>
      </div>
      
      <div class="search-container mb-3">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Search contacts..." 
          [(ngModel)]="searchQuery"
          (input)="onSearch()"
          *ngIf="contacts.length > 0">
      </div>

      <div class="contacts-container">
        <div 
          class="card mb-3 w-100 contact-item" 
          role="button" 
          [class.selected]="contact.id === selectedContactId"
          (click)="selectContact(contact)"
          *ngFor="let contact of filteredContacts; let index = index">
          
          <div class="row no-gutters">
            <div class="col-2 d-flex align-items-center justify-content-center">
              <div class="contact-avatar" [class]="getAvatarClass(index)">
                {{ contact.initials }}
              </div>
            </div>
            <div class="card-body col-10" [class.inactive]="!contact.status">
              <h5 class="card-title text-truncate">{{ contact.fullName }}</h5>
              <p class="card-text">{{ contact.phone }} - {{ contact.email }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="!contacts.length" class="text-center text-muted">
          <p>No contacts found. Add your first contact!</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .contact-list-container {
      padding: 16px;
    }
    
    .contact-item {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .contact-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .contact-item.selected {
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
    }
    
    .contact-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 16px;
    }
    
    .card-body.inactive {
      border-right: 10px solid #dc3545;
    }
    
    .card-body:not(.inactive) {
      border-right: 10px solid #28a745;
    }
    
    .avatar-blue { background: #007bff; }
    .avatar-red { background: #dc3545; }
    .avatar-green { background: #28a745; }
    .avatar-yellow { background: #ffc107; }
    .avatar-purple { background: #6f42c1; }
    .avatar-pink { background: #e83e8c; }
  `]
})
export class ContactListComponent implements OnInit {
    contacts: ContactResponseDto[] = [];
    filteredContacts: ContactResponseDto[] = [];
    selectedContactId: string | null = null;
    searchQuery: string = '';

    constructor(private contactApplicationService: ContactApplicationService) { }

    ngOnInit(): void {
        this.loadContacts();
    }

    loadContacts(): void {
        this.contactApplicationService.getAllContacts().subscribe(contacts => {
            this.contacts = contacts;
            this.filteredContacts = contacts;
        });
    }

    selectContact(contact: ContactResponseDto): void {
        this.selectedContactId = contact.id;
        this.contactApplicationService.selectContact(contact);
    }

    addNewContact(): void {
        // This would typically navigate to a form component
        console.log('Add new contact clicked');
    }

    onSearch(): void {
        if (!this.searchQuery.trim()) {
            this.filteredContacts = this.contacts;
            return;
        }

        this.contactApplicationService.searchContacts({ query: this.searchQuery }).subscribe(results => {
            this.filteredContacts = results;
        });
    }

    getAvatarClass(index: number): string {
        const colors = ['avatar-blue', 'avatar-red', 'avatar-green', 'avatar-yellow', 'avatar-purple', 'avatar-pink'];
        return colors[index % colors.length];
    }
}

