import { Repository } from '../application/interfaces/repository.interface';
import { BaseEntity } from '../domain/base-entity';

export abstract class BaseRepository<TEntity extends BaseEntity<TId>, TId> implements Repository<TEntity, TId> {
  
  abstract findById(id: TId): Promise<TEntity | null>;
  abstract findAll(): Promise<TEntity[]>;
  abstract save(entity: TEntity): Promise<void>;
  abstract delete(id: TId): Promise<void>;
  
}
