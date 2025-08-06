import { Provider, InjectionToken } from '@angular/core';
import { ContactRepository } from './domain/repositories/contact.repository.interface';
import { ContactRepositoryImpl } from './infrastructure/repositories/contact.repository.impl';

export const CONTACT_REPOSITORY = new InjectionToken<ContactRepository>('ContactRepository');

export const BUSINESS_PARTNER_PROVIDERS: Provider[] = [
  {
    provide: CONTACT_REPOSITORY,
    useClass: ContactRepositoryImpl
  }
];
