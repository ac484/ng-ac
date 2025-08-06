import { Component } from '@angular/core';
import { ContactListComponent } from '../components/contact-list.component';

@Component({
    selector: 'app-contact-manager',
    standalone: true,
    imports: [ContactListComponent],
    template: `
    <div class="contact-manager">
      <app-contact-list></app-contact-list>
    </div>
  `,
    styles: [`
    .contact-manager {
      height: 100%;
      background: #f5f5f5;
    }
  `]
})
export class ContactManagerComponent { }
