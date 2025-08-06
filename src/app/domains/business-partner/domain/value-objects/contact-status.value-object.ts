export enum ContactStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export class ContactStatusValueObject {
    constructor(private readonly status: ContactStatus) { }

    get value(): ContactStatus {
        return this.status;
    }

    get isActive(): boolean {
        return this.status === ContactStatus.ACTIVE;
    }

    get displayText(): string {
        return this.status === ContactStatus.ACTIVE ? 'Active' : 'Inactive';
    }

    get cssClass(): string {
        return this.status === ContactStatus.ACTIVE ? 'text-success' : 'text-danger';
    }

    static create(status: boolean): ContactStatusValueObject {
        return new ContactStatusValueObject(status ? ContactStatus.ACTIVE : ContactStatus.INACTIVE);
    }

    toggle(): ContactStatusValueObject {
        const newStatus = this.status === ContactStatus.ACTIVE ? ContactStatus.INACTIVE : ContactStatus.ACTIVE;
        return new ContactStatusValueObject(newStatus);
    }
}

