import { Provider } from '@angular/core';

import { CONTRACT_REPOSITORY_TOKEN } from '../../domain/repositories/contract.repository';
import { ContractDomainService } from '../../domain/services/contract-domain.service';
import { FirebaseContractRepository } from '../repositories/firebase-contract.repository';

export const CONTRACT_PROVIDERS: Provider[] = [
  { provide: CONTRACT_REPOSITORY_TOKEN, useClass: FirebaseContractRepository },
  ContractDomainService
];
