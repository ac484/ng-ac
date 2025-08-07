import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Company } from '../../domain/entities/company.entity';
import { CompanyRepository, COMPANY_REPOSITORY } from '../../domain/repositories/company.repository';
import { CompanyResponseDto } from '../dto/company.dto';

/**
 * 獲取公司列表用例
 * 極簡設計，專注核心業務邏輯
 */
@Injectable({
    providedIn: 'root'
})
export class GetCompaniesUseCase {
    private readonly companyRepository = inject(COMPANY_REPOSITORY);

    execute(): Observable<CompanyResponseDto[]> {
        return this.companyRepository.getAll().pipe(
            map(companies => companies.map(company => this.toResponseDto(company)))
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
            contacts: company.contacts.map(c => ({
                name: c.name,
                title: c.title,
                email: c.email,
                phone: c.phone,
                isPrimary: c.isPrimary
            })),
            dynamicWorkflow: company.dynamicWorkflow?.toPlainObject(),
            createdAt: company.createdAt.toISOString(),
            updatedAt: company.updatedAt.toISOString()
        };
    }
}