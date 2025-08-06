// src/app/domain/contract-management/application/dto/contract.dto.ts
export interface CreateContractCommand {
    name: string;
    terms: string;
}

export interface UpdateContractCommand {
    id: string;
    name?: string;
    terms?: string;
    status?: string;
}

export interface ContractDto {
    id: string;
    name: string;
    terms: string;
    status: string;
} 