import { Repository } from '../application/interfaces/repository.interface';
import { BaseEntity } from '../domain/base-entity';
import { ValueObject } from '../domain/value-object';

export abstract class BaseRepository<TEntity extends BaseEntity<TId>, TId extends ValueObject<any>> implements Repository<TEntity, TId> {

  abstract findById(id: TId): Promise<TEntity | null>;
  abstract findAll(): Promise<TEntity[]>;
  abstract save(entity: TEntity): Promise<void>;
  abstract delete(id: TId): Promise<void>;

}
