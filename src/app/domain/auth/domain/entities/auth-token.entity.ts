import { BaseEntity } from '../../../../shared/domain/base-entity';

export class AuthToken extends BaseEntity<string> {
    constructor(id: string, public readonly token: string, public readonly expiresAt: Date) {
        super(id);
    }
}
