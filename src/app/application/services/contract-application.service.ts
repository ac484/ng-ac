import { inject, Injectable } from '@angular/core';
import { Contract } from '../../domain/entities/contract.entity';
import { ContractRepository, ContractSearchCriteria } from '../../domain/repositories/contract.repository';
import { ContractDomainService } from '../../domain/services/contract-domain.service';
import { 
  CreateContractDto, 
  UpdateContractDto, 
  ContractDto, 
  ContractListDto, 
  ContractSearchDto, 
  ContractStatsDto 
} from '../dto/contract.dto';
import { 
  ClientName, 
  ClientRepresentative, 
  ContactPerson, 
  ContractName, 
  ContractStatus,
  ContactPhone,
  Notes
} from '../../domain/value-objects/contract';
import { Money } from '../../domain/value-objects/account/money.value-object';
import { CONTRACT_REPOSITORY_TOKEN } from '../../domain/repositories/contract.repository';

@Injectable({
  providedIn: 'root'
})
export class ContractApplicationService {
  private readonly contractRepository: ContractRepository = inject(CONTRACT_REPOSITORY_TOKEN);
  private readonly contractDomainService = inject(ContractDomainService);

  async createContract(dto: CreateContractDto): Promise<ContractDto> {
    try {
      // If no contract number is provided, generate one
      if (!dto.contractNumber) {
        const today = new Date();
        const dateStr = today.getFullYear().toString() +
                        String(today.getMonth() + 1).padStart(2, '0') +
                        String(today.getDate()).padStart(2, '0');
        
        const timestamp = Date.now();
        const sequence = timestamp % 10000;
        dto.contractNumber = `${dateStr}${String(sequence).padStart(4, '0')}`;
      }

      const contract = Contract.create(dto);
      await this.contractRepository.save(contract);
      return this.toDto(contract);
    } catch (error) {
      console.error('Contract creation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create contract: ${errorMessage}`);
    }
  }

  async updateContract(id: string, dto: UpdateContractDto): Promise<ContractDto> {
    try {
      const contract = await this.contractRepository.findById(id);
      if (!contract) {
        throw new Error('Contract not found');
      }

      // Update contract properties
      if (dto.clientName) {
        contract.updateClientName(new ClientName(dto.clientName));
      }
      if (dto.clientRepresentative) {
        contract.updateClientRepresentative(new ClientRepresentative(dto.clientRepresentative));
      }
      if (dto.contactPerson) {
        contract.updateContactPerson(new ContactPerson(dto.contactPerson));
      }
      if (dto.contractName) {
        contract.updateContractName(new ContractName(dto.contractName));
      }
      if (dto.amount) {
        contract.updateAmount(new Money(dto.amount));
      }
      if (dto.status) {
        contract.updateStatus(new ContractStatus(dto.status));
      }
      if (dto.contactPhone) {
        contract.updateContactPhone(new ContactPhone(dto.contactPhone));
      }
      if (dto.notes) {
        contract.updateNotes(new Notes(dto.notes));
      }

      await this.contractRepository.save(contract);
      return this.toDto(contract);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update contract: ${errorMessage}`);
    }
  }

  async deleteContract(id: string): Promise<void> {
    try {
      await this.contractRepository.delete(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete contract: ${errorMessage}`);
    }
  }

  async getContract(id: string): Promise<ContractDto> {
    try {
      const contract = await this.contractRepository.findById(id);
      if (!contract) {
        throw new Error('Contract not found');
      }
      return this.toDto(contract);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get contract: ${errorMessage}`);
    }
  }

  async getContracts(criteria?: ContractSearchDto): Promise<ContractListDto> {
    try {
      const searchCriteria: ContractSearchCriteria = {
        status: criteria?.status,
        clientName: criteria?.clientName,
        contractName: criteria?.contractName,
        startDate: criteria?.startDate,
        endDate: criteria?.endDate,
        page: criteria?.page || 1,
        pageSize: criteria?.pageSize || 10
      };

      const contracts = await this.contractRepository.findAll(searchCriteria);
      
      // Get total count based on search criteria
      let total: number;
      if (searchCriteria.status) {
        total = await this.contractRepository.countByStatus(searchCriteria.status);
      } else {
        // If no status filter, get total count of all contracts
        total = await (this.contractRepository as any).countAll();
      }

      console.log(`Found ${contracts.length} contracts, total: ${total}`);

      return {
        contracts: contracts.map((contract: Contract) => this.toDto(contract)),
        total,
        page: searchCriteria.page || 1,
        pageSize: searchCriteria.pageSize || 10
      };
    } catch (error) {
      console.error('Error in getContracts:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get contracts: ${errorMessage}`);
    }
  }

  async updateContractStatus(id: string, status: string): Promise<ContractDto> {
    try {
      const contract = await this.contractRepository.findById(id);
      if (!contract) {
        throw new Error('Contract not found');
      }

      contract.updateStatus(new ContractStatus(status));
      await this.contractRepository.save(contract);
      return this.toDto(contract);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update contract status: ${errorMessage}`);
    }
  }

  async getContractStats(): Promise<ContractStatsDto> {
    try {
      const draft = await this.contractRepository.countByStatus('draft');
      const preparing = await this.contractRepository.countByStatus('preparing');
      const inProgress = await this.contractRepository.countByStatus('in_progress');
      const completed = await this.contractRepository.countByStatus('completed');
      const total = draft + preparing + inProgress + completed;

      return {
        total,
        draft,
        preparing,
        inProgress,
        completed
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to get contract stats: ${errorMessage}`);
    }
  }

  private toDto(contract: Contract): ContractDto {
    return {
      id: contract.id,
      contractNumber: contract.contractNumber.getValue(),
      clientName: contract.clientName.getValue(),
      clientRepresentative: contract.clientRepresentative.getValue(),
      contactPerson: contract.contactPerson.getValue(),
      contractName: contract.contractName.getValue(),
      amount: contract.amount.getAmount(),
      status: contract.status.getValue(),
      contactPhone: contract.contactPhone?.getValue(),
      notes: contract.notes?.getValue(),
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt
    };
  }
} 