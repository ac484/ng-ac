import { ApplicationError } from "../../domain/errors/custom-errors";
import { BaseFirebaseRepository } from "../../infrastructure/common/base-firebase.repository";

export abstract class BaseApplicationService<T, CreateDto, UpdateDto> {
  constructor(
    protected repository: BaseFirebaseRepository<T>,
  ) {}

  async create(dto: CreateDto): Promise<T> {
    try {
      const entity = this.createEntity(dto);
      await this.repository.save(entity as T & { id: string });
      return entity;
    } catch (error) {
      console.error('Create failed', error);
      throw new ApplicationError('Create failed', error as Error);
    }
  }

  async update(id: string, dto: UpdateDto): Promise<T> {
    try {
      const entity = await this.repository.findById(id);
      if (!entity) {
        throw new Error('Entity not found');
      }

      this.updateEntity(entity, dto);
      await this.repository.save(entity as T & { id:string });
      return entity;
    } catch (error) {
      console.error('Update failed', error);
      throw new ApplicationError('Update failed', error as Error);
    }
  }

  protected abstract createEntity(dto: CreateDto): T;
  protected abstract updateEntity(entity: T, dto: UpdateDto): void;
} 