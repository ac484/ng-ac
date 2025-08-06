export interface Contract {
  id?: string;
  contractNumber: string;
  contractName: string;
  clientCompany: string;
  clientRepresentative: string;
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContractId extends Contract {
  id: string;
}
