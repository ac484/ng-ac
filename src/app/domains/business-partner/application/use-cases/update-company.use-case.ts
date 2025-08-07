import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

import { Company } from '../../domain/entities/company.entity';
import { COMPANY_REPOSITORY } from '../../domain/repositories/company.repository';
import { CompanyStatus } from '../../domain/value-objects/company-status.vo';
import { DynamicWorkflowStateVO } from '../../domain/value-objects/dynamic-workflow-state.vo';
import { UpdateCompanyDto, CompanyResponseDto } from '../dto/company.dto';

/**
 * 更新公司用例
 * 極簡設計，專注核心業務邏輯
 */
@Injectable({
  providedIn: 'root'
})
export class UpdateCompanyUseCase {
  private readonly companyRepository = inject(COMPANY_REPOSITORY);

  execute(id: string, dto: UpdateCompanyDto): Observable<CompanyResponseDto> {
    return this.companyRepository.getById(id).pipe(
      map(existingCompany => {
        if (!existingCompany) {
          throw new Error(`Company with id ${id} not found`);
        }

        // 處理動態工作流程數據
        let dynamicWorkflow: DynamicWorkflowStateVO | undefined = undefined;
        if (dto.dynamicWorkflow) {
          try {
            dynamicWorkflow = DynamicWorkflowStateVO.fromPlainObject(dto.dynamicWorkflow);
          } catch (error) {
            console.warn('Failed to parse dynamic workflow data:', error);
          }
        }

        // 更新公司基本資訊
        const updatedCompany = existingCompany.updateBasicInfo({
          companyName: dto.companyName,
          businessRegistrationNumber: dto.businessRegistrationNumber,
          address: dto.address,
          businessPhone: dto.businessPhone,
          fax: dto.fax,
          website: dto.website,
          dynamicWorkflow
        });

        // 更新狀態和風險等級（如果提供）
        let finalCompany = updatedCompany;
        if (dto.status) {
          finalCompany = finalCompany.updateStatus(CompanyStatus.create(dto.status));
        }

        return finalCompany;
      }),
      switchMap(company => this.companyRepository.update(id, company)),
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
