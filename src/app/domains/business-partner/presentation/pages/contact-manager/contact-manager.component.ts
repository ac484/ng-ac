import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from '../contact-list/contact-list.component';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
    selector: 'app-contact-manager',
    standalone: true,
    imports: [CommonModule, ContactListComponent, ContactDetailComponent, ContactFormComponent],
    template: `
    <div class="contact-manager-container">
      <div class="row">
        <div class="col-md-6">
          <app-contact-list></app-contact-list>
        </div>
        <div class="col-md-6">
          <app-contact-detail></app-contact-detail>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .contact-manager-container {
      padding: 16px;
    }
    
    .row {
      margin: 0;
    }
    
    .col-md-6 {
      padding: 0 8px;
    }
  `]
})
export class ContactManagerComponent {
    constructor() { }
}

