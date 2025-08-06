export class Contact {
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public status: boolean,
        public createdAt: Date,
        public updatedAt: Date
    ) { }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    get initials(): string {
        const first = this.firstName ? this.firstName[0] : '';
        const last = this.lastName ? this.lastName[0] : '';
        return `${first}${last}`.toUpperCase();
    }

    update(data: Partial<Contact>): Contact {
        return new Contact(
            this.id,
            data.firstName ?? this.firstName,
            data.lastName ?? this.lastName,
            data.email ?? this.email,
            data.phone ?? this.phone,
            data.status ?? this.status,
            this.createdAt,
            new Date()
        );
    }

    toggleStatus(): Contact {
        return new Contact(
            this.id,
            this.firstName,
            this.lastName,
            this.email,
            this.phone,
            !this.status,
            this.createdAt,
            new Date()
        );
    }
}

