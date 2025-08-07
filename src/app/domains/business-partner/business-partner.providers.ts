import { Provider } from '@angular/core';
import { CompanyRepositoryImpl } from './infrastructure/repositories/company.repository.impl';
import { COMPANY_REPOSITORY } from './domain/repositories/company.repository.interface';

/**
 * Business Partner Domain Providers
 */
export const BUSINESS_PARTNER_PROVIDERS: Provider[] = [
  { provide: COMPANY_REPOSITORY, useClass: CompanyRepositoryImpl }
];
