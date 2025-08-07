import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

import { Company } from '../../domain/entities/company.entity';
import { Contact } from '../../domain/entities/contact.entity';
import { COMPANY_REPOSITORY } from '../../domain/repositories/company.repository';
import { CompanyResponseDto, ContactDto } from '../dto/company.dto';

/**
 * 更新公司聯絡人用例
 * 極簡設計，專注聯絡人管理邏輯
 */
@Injectable({
    providedIn: 'root'
})
export class UpdateCompanyContactUseCase {
    private readonly companyRepository = inject(COMPANY_REPOSITORY);

    /**
     * 新增聯絡人
     */
    addContact(companyId: string, contactDto: ContactDto): Observable<CompanyResponseDto> {
        return this.companyRepository.getById(companyId).pipe(
            map(existingCompany => {
                if (!existingCompany) {
                    throw new Error(`Company with id ${companyId} not found`);
                }

                const newContact = Contact.create({
                    name: contactDto.name,
                    title: contactDto.title,
                    email: contactDto.email,
                    phone: contactDto.phone,
                    isPrimary: contactDto.isPrimary
                });

                return existingCompany.addContact(newContact);
            }),
            switchMap(company => this.companyRepository.update(companyId, company)),
            map(updatedCompany => this.toResponseDto(updatedCompany))
        );
    }

    /**
     * 更新聯絡人
     */
    updateContact(companyId: string, contactIndex: number, contactDto: ContactDto): Observable<CompanyResponseDto> {
        return this.companyRepository.getById(companyId).pipe(
            map(existingCompany => {
                if (!existingCompany) {
                    throw new Error(`Company with id ${companyId} not found`);
                }

                const updatedContact = Contact.create({
                    name: contactDto.name,
                    title: contactDto.title,
                    email: contactDto.email,
                    phone: contactDto.phone,
                    isPrimary: contactDto.isPrimary
                });

                return existingCompany.updateContact(contactIndex, updatedContact);
            }),
            switchMap(company => this.companyRepository.update(companyId, company)),
            map(updatedCompany => this.toResponseDto(updatedCompany))
        );
    }

    /**
     * 刪除聯絡人
     */
    removeContact(companyId: string, contactIndex: number): Observable<CompanyResponseDto> {
        return this.companyRepository.getById(companyId).pipe(
            map(existingCompany => {
                if (!existingCompany) {
                    throw new Error(`Company with id ${companyId} not found`);
                }

                return existingCompany.removeContact(contactIndex);
            }),
            switchMap(company => this.companyRepository.update(companyId, company)),
            map(updatedCompany => this.toResponseDto(updatedCompany))
        );
    }

    private toResponseDto(company: Company): CompanyResponseDto {
        return {
            id: company.companyId.value,
            companyName: company.companyName,
            businessRegistrationNumber: company.businessRegistrationNumber,
            address: company.address,
            businessPhone: company.businessPhone,
            status: company.status.value,
            riskLevel: company.riskLevel.value,
            fax: company.fax,
            website: company.website,
            contacts: company.contacts.map(contact => ({
                name: contact.name,
                title: contact.title,
                email: contact.email,
                phone: contact.phone,
                isPrimary: contact.isPrimary
            })),
            dynamicWorkflow: company.dynamicWorkflow?.toPlainObject(),
            createdAt: company.createdAt.toISOString(),
            updatedAt: company.updatedAt.toISOString()
        };
    }
}