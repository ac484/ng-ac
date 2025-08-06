// src/app/domain/acceptance-management/application/dto/acceptance.dto.ts
export interface CreateAcceptanceCommand {
    name: string;
    criteria: string;
}

export interface UpdateAcceptanceCommand {
    id: string;
    name?: string;
    criteria?: string;
    status?: string;
}

export interface AcceptanceDto {
    id: string;
    name: string;
    criteria: string;
    status: string;
} 