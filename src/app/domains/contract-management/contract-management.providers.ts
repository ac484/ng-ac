import { Provider, InjectionToken } from '@angular/core';

import { ContractRepository } from './domain/repositories/contract.repository';
import { FirestoreContractRepository } from './infrastructure/repositories/firestore-contract.repository';

export const CONTRACT_REPOSITORY = new InjectionToken<ContractRepository>('ContractRepository');

export const CONTRACT_MANAGEMENT_PROVIDERS: Provider[] = [
  {
    provide: CONTRACT_REPOSITORY,
    useClass: FirestoreContractRepository
  }
];
