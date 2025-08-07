export interface ContactProps {
    name: string;
    title: string;
    email: string;
    phone: string;
    isPrimary: boolean;
}

/**
 * 聯絡人類
 * 儲存公司聯絡人資訊
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
}
