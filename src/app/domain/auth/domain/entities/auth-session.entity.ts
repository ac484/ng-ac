import { BaseEntity } from '../../../../shared/domain/base-entity';
import { SessionId } from '../value-objects/session-id.vo';
import { UserId } from '../../../user/domain/value-objects/user-id.vo';

export class AuthSession extends BaseEntity<SessionId> {
    constructor(id: SessionId, public readonly userId: UserId, public readonly token: string, public readonly expiresAt: Date) {
        super(id);
    }
}
