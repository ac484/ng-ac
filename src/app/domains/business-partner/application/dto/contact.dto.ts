export interface CreateContactDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: boolean;
}

export interface UpdateContactDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    status?: boolean;
}

export interface ContactResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    fullName: string;
    initials: string;
}

export interface ContactSearchDto {
    query: string;
}

