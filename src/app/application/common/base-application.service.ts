import { ApplicationError } from "../../domain/errors/custom-errors";
import { BaseFirebaseRepository, SearchCriteria } from "../../infrastructure/common/base-firebase.repository";

export abstract class BaseApplicationService<T, CreateDto, UpdateDto> {
  constructor(
    protected repository: BaseFirebaseRepository<T>,
  ) {}

  async findAll(criteria?: SearchCriteria): Promise<T[]> {
    try {
      return await this.repository.findAll(criteria);
    } catch (error) {
      console.error('Find all failed', error);
      throw new ApplicationError('Find all failed', error as Error);
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      console.error(`Find by id ${id} failed`, error);
      throw new ApplicationError(`Find by id ${id} failed`, error as Error);
    }
  }

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