import { BaseAggregateRoot } from '@shared';
import { ContactId } from '../value-objects/contact-id.vo';

export interface ContactProps {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 聯絡人實體
 * 封裝聯絡人的核心業務邏輯
 */
export class Contact extends BaseAggregateRoot<ContactId> {
    private constructor(
        id: ContactId,
        private _firstName: string,
        private _lastName: string,
        private _email: string,
        private _phone: string,
        private _status: boolean,
        private _createdAt: Date,
        private _updatedAt: Date
    ) {
        super(id);
    }

    /**
     * 創建新聯絡人
     */
    static create(props: Omit<ContactProps, 'createdAt' | 'updatedAt'>): Contact {
        const now = new Date();
        return new Contact(
            ContactId.generate(),
            props.firstName,
            props.lastName,
            props.email,
            props.phone,
            props.status,
            now,
            now
        );
    }

    /**
     * 從 Firestore 數據重建
     */
    static fromFirestore(id: string, data: any): Contact {
        return new Contact(
            ContactId.create(id),
            data.firstName || '',
            data.lastName || '',
            data.email || '',
            data.phone || '',
            data.status || false,
            new Date(data.createdAt || Date.now()),
            new Date(data.updatedAt || Date.now())
        );
    }

    /**
     * 轉換為 Firestore 數據
     */
    toFirestore(): any {
        return {
            firstName: this._firstName,
            lastName: this._lastName,
            email: this._email,
            phone: this._phone,
            status: this._status,
            createdAt: this._createdAt.toISOString(),
            updatedAt: this._updatedAt.toISOString()
        };
    }

    // Getters
    get firstName(): string { return this._firstName; }
    get lastName(): string { return this._lastName; }
    get email(): string { return this._email; }
    get phone(): string { return this._phone; }
    get status(): boolean { return this._status; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date { return this._updatedAt; }
    get fullName(): string { return `${this._firstName} ${this._lastName}`; }
    get initials(): string {
        return `${this._firstName.charAt(0)}${this._lastName.charAt(0)}`.toUpperCase();
    }

    /**
     * 更新聯絡人資料
     */
    update(props: Partial<Omit<ContactProps, 'createdAt' | 'updatedAt'>>): void {
        if (props.firstName !== undefined) this._firstName = props.firstName;
        if (props.lastName !== undefined) this._lastName = props.lastName;
        if (props.email !== undefined) this._email = props.email;
        if (props.phone !== undefined) this._phone = props.phone;
        if (props.status !== undefined) this._status = props.status;
        this._updatedAt = new Date();
    }

    /**
     * 切換狀態
     */
    toggleStatus(): void {
        this._status = !this._status;
        this._updatedAt = new Date();
    }
}
