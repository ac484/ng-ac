export interface CreateContactDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: boolean;
}

export interface UpdateContactDto extends Partial<CreateContactDto> { }

export interface ContactResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: boolean;
    fullName: string;
    initials: string;
    createdAt: string;
    updatedAt: string;
}
