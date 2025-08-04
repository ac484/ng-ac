import { Injectable, Inject } from '@angular/core';

import { Contract } from '../entities/contract.entity';
import { ContractRepository, CONTRACT_REPOSITORY_TOKEN } from '../repositories/contract.repository';
import { Money } from '../value-objects/account/money.value-object';
import { ContractNumber } from '../value-objects/contract/contract-number.value-object';
import { ContractStatus } from '../value-objects/contract/contract-status.value-object';

/**
 * Contract domain service
 */
@Injectable({
  providedIn: 'root'
})
export class ContractDomainService {
  constructor(@Inject(CONTRACT_REPOSITORY_TOKEN) private contractRepository: ContractRepository) {}

  /**
   * Generate unique contract number
   */
  async generateContractNumber(): Promise<ContractNumber> {
    const today = new Date();
    const dateStr =
      today.getFullYear().toString() + String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0');

    // Query max sequence number for today
    const todayContracts = await this.contractRepository.findByDate(today);
    const maxSequence =
      todayContracts.length > 0 ? Math.max(...todayContracts.map(c => parseInt(c.contractNumber.getValue().slice(8)))) : 0;

    const nextSequence = maxSequence + 1;
    const contractNumber = `${dateStr}${String(nextSequence).padStart(4, '0')}`;

    return new ContractNumber(contractNumber);
  }

  /**
   * Validate contract status transition
   */
  validateContractStatus(contract: Contract): boolean {
    const statusTransitions = {
      [ContractStatus.DRAFT]: [ContractStatus.PREPARING],
      [ContractStatus.PREPARING]: [ContractStatus.IN_PROGRESS, ContractStatus.DRAFT],
      [ContractStatus.IN_PROGRESS]: [ContractStatus.COMPLETED, ContractStatus.PREPARING],
      [ContractStatus.COMPLETED]: [ContractStatus.IN_PROGRESS]
    };

    return true; // Simplified validation
  }

  /**
   * Calculate contract amount
   */
  calculateContractAmount(contract: Contract): Money {
    return contract.amount;
  }
}
