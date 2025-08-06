import { Provider } from '@angular/core';
import { ContactRepositoryImpl } from './infrastructure/repositories/contact.repository.impl';

export const BUSINESS_PARTNER_PROVIDERS: Provider[] = [
  ContactRepositoryImpl
];
