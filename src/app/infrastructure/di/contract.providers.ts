import { Provider } from '@angular/core';
import { CONTRACT_REPOSITORY_TOKEN } from '../../domain/repositories/contract.repository';
import { FirebaseContractRepository } from '../repositories/firebase-contract.repository';
import { ContractDomainService } from '../../domain/services/contract-domain.service';

export const CONTRACT_PROVIDERS: Provider[] = [
  { provide: CONTRACT_REPOSITORY_TOKEN, useClass: FirebaseContractRepository },
  ContractDomainService
]; 