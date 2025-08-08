import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Company } from '../../domain/entities/company.entity';
import { Contact } from '../../domain/entities/contact.entity';
import { COMPANY_REPOSITORY } from '../../domain/repositories/company.repository';
import { CreateCompanyDto, CompanyResponseDto } from '../dto/company.dto';
import { CompanyMapper } from '../mappers/company.mapper';

/**
 * 創建公司用例
 * 極簡設計，專注核心業務邏輯
 */
@Injectable({
  providedIn: 'root'
})
export class CreateCompanyUseCase {
  private readonly companyRepository = inject(COMPANY_REPOSITORY);
  private readonly companyMapper = inject(CompanyMapper);

  execute(dto: CreateCompanyDto): Observable<CompanyResponseDto> {
    // 轉換 DTO 為領域對象
    const contacts = (dto.contacts || []).map(c => Contact.create(c));

    const company = Company.create({
      ...dto,
      contacts
    });

    // 保存並返回
    return this.companyRepository.create(company).pipe(map(savedCompany => this.companyMapper.toResponseDto(savedCompany)));
  }
}
