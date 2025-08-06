import { BaseEntity } from '../../domain/base-entity';

export interface Repository<T extends BaseEntity<TId>, TId> {
  findById(id: TId): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<void>;
  delete(id: TId): Promise<void>;
  exists(id: TId): Promise<boolean>;
} 