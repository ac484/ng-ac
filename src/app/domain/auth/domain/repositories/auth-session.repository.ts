import { Repository } from 'src/app/shared/application/interfaces/repository.interface';
import { AuthSession } from '../entities/auth-session.entity';
import { SessionId } from '../value-objects/session-id.vo';
import { UserId } from '../../../user/domain/value-objects/user-id.vo';

export abstract class AuthSessionRepository implements Repository<AuthSession, SessionId> {
    abstract findById(id: SessionId): Promise<AuthSession | null>;
    abstract findAll(): Promise<AuthSession[]>;
    abstract save(entity: AuthSession): Promise<void>;
    abstract delete(id: SessionId): Promise<void>;
    abstract findByUserId(userId: UserId): Promise<AuthSession | null>;
}
