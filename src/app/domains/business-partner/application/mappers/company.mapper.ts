import { Injectable } from '@angular/core';

import { Company } from '../../domain/entities/company.entity';
import { CompanyResponseDto } from '../dto/company.dto';

/**
 * 公司映射器
 * 極簡設計，統一處理 Entity 到 DTO 的轉換
 */
@Injectable({
  providedIn: 'root'
})
export class CompanyMapper {
  /**
   * 將 Company Entity 轉換為 CompanyResponseDto
   */
  toResponseDto(company: Company): CompanyResponseDto {
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

  /**
   * 批量轉換
   */
  toResponseDtoList(companies: Company[]): CompanyResponseDto[] {
    return companies.map(company => this.toResponseDto(company));
  }
}
