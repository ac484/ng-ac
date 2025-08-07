import { Component } from '@angular/core';
import { CompanyListComponent } from '../components/company-list.component';

@Component({
  selector: 'app-company-manager',
  standalone: true,
  imports: [CompanyListComponent],
  template: `
    <div class="company-manager">
      <app-company-list></app-company-list>
    </div>
  `,
  styles: [`
    .company-manager {
      height: 100%;
      background: #f5f5f5;
    }
  `]
})
export class CompanyManagerComponent { }
