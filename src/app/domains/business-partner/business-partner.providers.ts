import { Provider } from '@angular/core';

import { COMPANY_REPOSITORY } from './domain/repositories/company.repository';
import { CompanyFirebaseRepository } from './infrastructure/repositories/company-firebase.repository';

/**
 * Business Partner 模組提供者
 * 極簡設計，只配置必要的依賴注入
 */
export const BUSINESS_PARTNER_PROVIDERS: Provider[] = [
  // Repository 實現
  {
    provide: COMPANY_REPOSITORY,
    useClass: CompanyFirebaseRepository
  }
];
