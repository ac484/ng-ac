import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Company } from '../../domain/entities/company.entity';
import { Contact } from '../../domain/entities/contact.entity';
import { CompanyRepository, COMPANY_REPOSITORY } from '../../domain/repositories/company.repository';
import { CreateCompanyDto, CompanyResponseDto } from '../dto/company.dto';

/**
 * 創建公司用例
 * 極簡設計，專注核心業務邏輯
 */
@Injectable({
  providedIn: 'root'
})
export class CreateCompanyUseCase {
  private readonly companyRepository = inject(COMPANY_REPOSITORY);

  execute(dto: CreateCompanyDto): Observable<CompanyResponseDto> {
    // 轉換 DTO 為領域對象
    const contacts = (dto.contacts || []).map(c => Contact.create(c));

    const company = Company.create({
      ...dto,
      contacts
    });

    // 保存並返回
    return this.companyRepository.create(company).pipe(map(savedCompany => this.toResponseDto(savedCompany)));
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
