import { Routes } from '@angular/router';

import { ContractDetailComponent } from '../components/contract/contract-detail.component';
import { ContractFormComponent } from '../components/contract/contract-form.component';
import { ContractListComponent } from '../components/contract/contract-list.component';

export const CONTRACT_ROUTES: Routes = [
  {
    path: 'contracts',
    children: [
      { path: '', component: ContractListComponent },
      { path: 'create', component: ContractFormComponent },
      { path: ':id', component: ContractDetailComponent },
      { path: ':id/edit', component: ContractFormComponent }
    ]
  }
];
