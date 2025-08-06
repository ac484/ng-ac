// src/app/domain/contract-extraction/infrastructure/providers.ts
import { Provider } from '@angular/core';
import { CONTRACT_EXTRACTION_REPOSITORY } from '../domain/repositories/contract-extraction.repository';
import { FirebaseContractExtractionRepository } from './firebase/firebase-contract-extraction.repository';

export const CONTRACT_EXTRACTION_PROVIDERS: Provider[] = [
    {
        provide: CONTRACT_EXTRACTION_REPOSITORY,
        useClass: FirebaseContractExtractionRepository
    }
]; 