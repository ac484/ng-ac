import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { Company } from '../../domain/entities/company.entity';
import { COMPANY_REPOSITORY, CompanyRepository } from '../../domain/repositories/company.repository.interface';
import { CreateCompanyDto, UpdateCompanyDto, CompanyResponseDto } from '../dto/create-company.dto';
import { CompanyStatus } from '../../domain/value-objects/company-status.vo';
import { RiskLevel } from '../../domain/value-objects/risk-level.vo';
import { Contact } from '../../domain/entities/contact.entity';

@Injectable({
    providedIn: 'root'
})
export class CompanyApplicationService {
    private readonly companyRepository = inject(COMPANY_REPOSITORY);

    getAllCompanies(): Observable<CompanyResponseDto[]> {
        return this.companyRepository.getAll().pipe(
            map(companies => companies.map(company => this.toResponseDto(company)))
        );
    }

    getCompanyById(id: string): Observable<CompanyResponseDto | null> {
        return this.companyRepository.getById(id).pipe(
            map(company => company ? this.toResponseDto(company) : null)
        );
    }

    createCompany(dto: CreateCompanyDto): Observable<CompanyResponseDto> {
        const company = Company.create({
            ...dto,
            status: CompanyStatus.create(dto.status),
            riskLevel: RiskLevel.create(dto.riskLevel),
            contacts: dto.contacts.map(c => Contact.create(c))
        });
        return this.companyRepository.create(company).pipe(
            map(createdCompany => this.toResponseDto(createdCompany))
        );
    }

    updateCompany(id: string, dto: UpdateCompanyDto): Observable<CompanyResponseDto> {
        return this.companyRepository.getById(id).pipe(
            switchMap(company => {
                if (!company) {
                    throw new Error('Company not found');
                }

                Object.assign(company, {
                    ...dto,
                    status: dto.status ? CompanyStatus.create(dto.status) : company.status,
                    riskLevel: dto.riskLevel ? RiskLevel.create(dto.riskLevel) : company.riskLevel,
                    contacts: dto.contacts ? dto.contacts.map(c => Contact.create(c)) : company.contacts,
                    updatedAt: new Date()
                });

                return this.companyRepository.update(id, company);
            }),
            map(updatedCompany => this.toResponseDto(updatedCompany))
        );
    }

    deleteCompany(id: string): Observable<void> {
        return this.companyRepository.delete(id);
    }

    searchCompanies(query: string): Observable<CompanyResponseDto[]> {
        return this.companyRepository.search(query).pipe(
            map(companies => companies.map(company => this.toResponseDto(company)))
        );
    }

    private toResponseDto(company: Company): CompanyResponseDto {
        return {
            id: company.companyId.value,
            companyName: company.companyName,
            businessRegistrationNumber: company.businessRegistrationNumber,
            status: company.status.value,
            address: company.address,
            businessPhone: company.businessPhone,
            fax: company.fax,
            website: company.website,
            contractCount: company.contractCount,
            latestContractDate: company.latestContractDate?.toISOString() ?? null,
            partnerSince: company.partnerSince.toISOString(),
            cooperationScope: company.cooperationScope,
            businessModel: company.businessModel,
            creditScore: company.creditScore,
            riskLevel: company.riskLevel.value,
            reviewHistory: company.reviewHistory,
            blacklistReason: company.blacklistReason,
            contacts: company.contacts,
            createdAt: company.createdAt.toISOString(),
            updatedAt: company.updatedAt.toISOString()
        };
    }
}
