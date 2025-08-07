export interface ContactProps {
    readonly name: string;
    readonly title: string;
    readonly email: string;
    readonly phone: string;
    readonly isPrimary: boolean;
}

/**
 * 聯絡人類
 * 儲存公司聯絡人資訊
 * 使用不可變性設計，提高效能和可預測性
 */
export class Contact {
    constructor(
        public readonly name: string,
        public readonly title: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly isPrimary: boolean
    ) { }

    static create(props: ContactProps): Contact {
        return new Contact(
            props.name,
            props.title,
            props.email,
            props.phone,
            props.isPrimary
        );
    }

    // 不可變更新方法，返回新的實例
    updateName(newName: string): Contact {
        return new Contact(
            newName,
            this.title,
            this.email,
            this.phone,
            this.isPrimary
        );
    }

    updateTitle(newTitle: string): Contact {
        return new Contact(
            this.name,
            newTitle,
            this.email,
            this.phone,
            this.isPrimary
        );
    }

    updateEmail(newEmail: string): Contact {
        return new Contact(
            this.name,
            this.title,
            newEmail,
            this.phone,
            this.isPrimary
        );
    }

    updatePhone(newPhone: string): Contact {
        return new Contact(
            this.name,
            this.title,
            this.email,
            newPhone,
            this.isPrimary
        );
    }

    setAsPrimary(): Contact {
        return new Contact(
            this.name,
            this.title,
            this.email,
            this.phone,
            true
        );
    }

    setAsSecondary(): Contact {
        return new Contact(
            this.name,
            this.title,
            this.email,
            this.phone,
            false
        );
    }

    // 業務邏輯方法
    isValid(): boolean {
        return (
            this.name.trim().length > 0 &&
            this.title.trim().length > 0 &&
            this.email.trim().length > 0 &&
            this.phone.trim().length > 0 &&
            this.isValidEmail(this.email)
        );
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getDisplayName(): string {
        return `${this.name} (${this.title})`;
    }

    getShortName(): string {
        return this.name.length > 2 ? this.name.substring(0, 2) : this.name;
    }

    // 比較方法
    equals(other: Contact): boolean {
        return (
            this.name === other.name &&
            this.title === other.title &&
            this.email === other.email &&
            this.phone === other.phone &&
            this.isPrimary === other.isPrimary
        );
    }

    // 複製方法
    clone(): Contact {
        return new Contact(
            this.name,
            this.title,
            this.email,
            this.phone,
            this.isPrimary
        );
    }
}
