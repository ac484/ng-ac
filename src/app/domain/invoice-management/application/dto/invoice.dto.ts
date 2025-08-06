// src/app/domain/invoice-management/application/dto/invoice.dto.ts
export interface CreateInvoiceCommand {
    contractId: string;
    amount: number;
}

export interface UpdateInvoiceCommand {
    id: string;
    amount?: number;
    status?: string;
}

export interface InvoiceDto {
    id: string;
    contractId: string;
    amount: number;
    status: string;
} 