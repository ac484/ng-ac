import { Injectable } from '@angular/core';
import { ContractId } from '../../domain/entities/contract.entity';
import { ContractSearchCriteria } from '../../presentation/features/components/contract-search';

@Injectable({
  providedIn: 'root'
})
export class ContractSearchService {
  
  filterContracts(contracts: ContractId[], criteria: ContractSearchCriteria): ContractId[] {
    return contracts.filter(contract => {
      // 關鍵字搜索
      if (criteria.keyword) {
        const keyword = criteria.keyword.toLowerCase();
        const matchesKeyword = 
          contract.contractNumber.toLowerCase().includes(keyword) ||
          contract.contractName.toLowerCase().includes(keyword) ||
          contract.clientCompany.toLowerCase().includes(keyword);
        if (!matchesKeyword) return false;
      }

      // 狀態篩選
      if (criteria.status && contract.status !== criteria.status) {
        return false;
      }

      // 合約類型篩選
      if (criteria.contractType && contract.contractType !== criteria.contractType) {
        return false;
      }

      // 風險等級篩選
      if (criteria.riskLevel && contract.riskLevel !== criteria.riskLevel) {
        return false;
      }

      // 日期範圍篩選
      if (criteria.startDate && contract.startDate < criteria.startDate) {
        return false;
      }
      if (criteria.endDate && contract.endDate > criteria.endDate) {
        return false;
      }

      // 客戶公司篩選
      if (criteria.clientCompany && 
          !contract.clientCompany.toLowerCase().includes(criteria.clientCompany.toLowerCase())) {
        return false;
      }

      return true;
    });
  }
}
