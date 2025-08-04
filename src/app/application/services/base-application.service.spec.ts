import { TestBed } from '@angular/core/testing';
import { NzMessageService } from 'ng-zorro-antd/message';

import { BaseApplicationService, Repository, ValidationError, NotFoundError, ApplicationError } from './base-application.service';
import { ErrorHandlerService } from './error-handler.service';
import { OptimizedBaseEntity, BaseEntityData, createEntityData } from '../../domain/entities/optimized-base-entity';
import { BaseCreateDto, BaseUpdateDto, BaseResponseDto, SearchCriteriaDto } from '../dto/base.dto';

// 測試用的實體
class TestEntity extends OptimizedBaseEntity {
  name: string;
  status: string;

  constructor(data: BaseEntityData & { name: string; status: string }) {
    super(data);
    this.name = data.name;
    this.status = data.status;
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors = this.validateBase();

    if (!this.name || this.name.trim() === '') {
      errors.push('名稱不能為空');
    }

    if (!this.status) {
      errors.push('狀態不能為空');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  updateName(name: string): void {
    this.name = name;
    this.touch();
  }
}

// 測試用的 DTOs
interface TestCreateDto extends BaseCreateDto {
  name: string;
  status: string;
}

interface TestUpdateDto extends BaseUpdateDto {
  name?: string;
  status?: string;
}

interface TestResponseDto extends BaseResponseDto {
  name: string;
  status: string;
}

// 測試用的應用服務
class TestApplicationService extends BaseApplicationService<TestEntity, TestCreateDto, TestUpdateDto, TestResponseDto> {
  protected async createEntity(dto: TestCreateDto): Promise<TestEntity> {
    const entityData = createEntityData();
    return new TestEntity({
      ...entityData,
      name: dto.name,
      status: dto.status
    });
  }

  protected async updateEntity(entity: TestEntity, dto: TestUpdateDto): Promise<void> {
    if (dto.name !== undefined) {
      entity.updateName(dto.name);
    }
    if (dto.name !== undefined) {
      entity.updateName(dto.name);
    }
    if (dto.status !== undefined) {
      entity.status = dto.status;
      entity.touch();
    }
  }

  protected mapToResponseDto(entity: TestEntity): TestResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  protected override validateCreateDto(dto: TestCreateDto): void {
    super.validateCreateDto(dto);
    if (!dto.name) {
      throw new ValidationError('名稱不能為空');
    }
    if (!dto.status) {
      throw new ValidationError('狀態不能為空');
    }
  }

  protected override async filterByKeyword(entities: TestEntity[], keyword: string): Promise<TestEntity[]> {
    return entities.filter(entity => entity.name.toLowerCase().includes(keyword.toLowerCase()));
  }

  protected override async filterByStatus(entities: TestEntity[], status: string): Promise<TestEntity[]> {
    return entities.filter(entity => entity.status === status);
  }
}

describe('BaseApplicationService', () => {
  let service: TestApplicationService;
  let mockRepository: jasmine.SpyObj<Repository<TestEntity>>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandlerService>;
  let mockMessageService: jasmine.SpyObj<NzMessageService>;

  beforeEach(() => {
    // 創建 mock 物件
    mockRepository = jasmine.createSpyObj('Repository', ['findById', 'findAll', 'save', 'delete']);

    mockMessageService = jasmine.createSpyObj('NzMessageService', ['success', 'error', 'warning']);

    mockErrorHandler = jasmine.createSpyObj('ErrorHandlerService', ['handleError', 'handleSuccess', 'handleWarning']);

    TestBed.configureTestingModule({
      providers: [{ provide: NzMessageService, useValue: mockMessageService }]
    });

    service = new TestApplicationService(mockRepository, mockErrorHandler);
  });

  describe('create', () => {
    it('應該成功創建實體', async () => {
      // Arrange
      const createDto: TestCreateDto = {
        name: '測試實體',
        status: 'active'
      };

      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result.name).toBe(createDto.name);
      expect(result.status).toBe(createDto.status);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('創建成功');
    });

    it('當 DTO 無效時應該拋出 ValidationError', async () => {
      // Arrange
      const invalidDto: TestCreateDto = {
        name: '',
        status: 'active'
      };

      // Act & Assert
      await expectAsync(service.create(invalidDto)).toBeRejectedWithError(ValidationError, '名稱不能為空');

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('當實體驗證失敗時應該拋出 ValidationError', async () => {
      // Arrange
      const createDto: TestCreateDto = {
        name: '測試實體',
        status: '' // 無效狀態
      };

      // Act & Assert
      await expectAsync(service.create(createDto)).toBeRejectedWithError(ValidationError);

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('當儲存庫拋出錯誤時應該處理錯誤', async () => {
      // Arrange
      const createDto: TestCreateDto = {
        name: '測試實體',
        status: 'active'
      };

      const repositoryError = new Error('儲存失敗');
      mockRepository.save.and.returnValue(Promise.reject(repositoryError));

      // Act & Assert
      await expectAsync(service.create(createDto)).toBeRejectedWithError(ApplicationError, '創建失敗');

      expect(mockErrorHandler.handleError).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('應該成功獲取實體', async () => {
      // Arrange
      const entityData = createEntityData('test-id');
      const entity = new TestEntity({
        ...entityData,
        name: '測試實體',
        status: 'active'
      });

      mockRepository.findById.and.returnValue(Promise.resolve(entity));

      // Act
      const result = await service.getById('test-id');

      // Assert
      expect(result).not.toBeNull();
      expect(result!.id).toBe('test-id');
      expect(result!.name).toBe('測試實體');
      expect(result!.status).toBe('active');
      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
    });

    it('當實體不存在時應該返回 null', async () => {
      // Arrange
      mockRepository.findById.and.returnValue(Promise.resolve(null));

      // Act
      const result = await service.getById('non-existent-id');

      // Assert
      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith('non-existent-id');
    });

    it('當 ID 為空時應該拋出 ValidationError', async () => {
      // Act & Assert
      await expectAsync(service.getById('')).toBeRejectedWithError(ValidationError, 'ID 不能為空');

      expect(mockRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('應該成功更新實體', async () => {
      // Arrange
      const entityData = createEntityData('test-id');
      const entity = new TestEntity({
        ...entityData,
        name: '原始名稱',
        status: 'active'
      });

      const updateDto: TestUpdateDto = {
        name: '更新後名稱'
      };

      mockRepository.findById.and.returnValue(Promise.resolve(entity));
      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.update('test-id', updateDto);

      // Assert
      expect(result.name).toBe('更新後名稱');
      expect(result.status).toBe('active'); // 未更新的欄位保持不變
      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('更新成功');
    });

    it('當實體不存在時應該拋出 NotFoundError', async () => {
      // Arrange
      const updateDto: TestUpdateDto = {
        name: '更新後名稱'
      };

      mockRepository.findById.and.returnValue(Promise.resolve(null));

      // Act & Assert
      await expectAsync(service.update('non-existent-id', updateDto)).toBeRejectedWithError(NotFoundError, '實體不存在');

      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('應該成功刪除實體', async () => {
      // Arrange
      const entityData = createEntityData('test-id');
      const entity = new TestEntity({
        ...entityData,
        name: '測試實體',
        status: 'active'
      });

      mockRepository.findById.and.returnValue(Promise.resolve(entity));
      mockRepository.delete.and.returnValue(Promise.resolve());

      // Act
      await service.delete('test-id');

      // Assert
      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockRepository.delete).toHaveBeenCalledWith('test-id');
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('刪除成功');
    });

    it('當實體不存在時應該拋出 NotFoundError', async () => {
      // Arrange
      mockRepository.findById.and.returnValue(Promise.resolve(null));

      // Act & Assert
      await expectAsync(service.delete('non-existent-id')).toBeRejectedWithError(NotFoundError, '實體不存在');

      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('getList', () => {
    it('應該成功獲取實體列表', async () => {
      // Arrange
      const entities = [
        new TestEntity({
          ...createEntityData('id1'),
          name: '實體1',
          status: 'active'
        }),
        new TestEntity({
          ...createEntityData('id2'),
          name: '實體2',
          status: 'inactive'
        })
      ];

      mockRepository.findAll.and.returnValue(Promise.resolve(entities));

      // Act
      const result = await service.getList();

      // Assert
      expect(result.items.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrevious).toBe(false);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('應該正確處理分頁', async () => {
      // Arrange
      const entities = Array.from(
        { length: 25 },
        (_, i) =>
          new TestEntity({
            ...createEntityData(`id${i + 1}`),
            name: `實體${i + 1}`,
            status: 'active'
          })
      );

      mockRepository.findAll.and.returnValue(Promise.resolve(entities));

      const criteria: SearchCriteriaDto = {
        page: 2,
        pageSize: 10
      };

      // Act
      const result = await service.getList(criteria);

      // Assert
      expect(result.items.length).toBe(10);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(10);
      expect(result.hasNext).toBe(true);
      expect(result.hasPrevious).toBe(true);
    });

    it('應該正確應用關鍵字搜尋', async () => {
      // Arrange
      const entities = [
        new TestEntity({
          ...createEntityData('id1'),
          name: '測試實體',
          status: 'active'
        }),
        new TestEntity({
          ...createEntityData('id2'),
          name: '其他實體',
          status: 'active'
        })
      ];

      mockRepository.findAll.and.returnValue(Promise.resolve(entities));

      const criteria: SearchCriteriaDto = {
        keyword: '測試'
      };

      // Act
      const result = await service.getList(criteria);

      // Assert
      expect(result.items.length).toBe(1);
      expect(result.items[0].name).toBe('測試實體');
      expect(result.total).toBe(1);
    });

    it('應該正確應用狀態過濾', async () => {
      // Arrange
      const entities = [
        new TestEntity({
          ...createEntityData('id1'),
          name: '實體1',
          status: 'active'
        }),
        new TestEntity({
          ...createEntityData('id2'),
          name: '實體2',
          status: 'inactive'
        })
      ];

      mockRepository.findAll.and.returnValue(Promise.resolve(entities));

      const criteria: SearchCriteriaDto = {
        status: 'active'
      };

      // Act
      const result = await service.getList(criteria);

      // Assert
      expect(result.items.length).toBe(1);
      expect(result.items[0].status).toBe('active');
      expect(result.total).toBe(1);
    });

    it('應該正確應用日期範圍過濾', async () => {
      // Arrange
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const entities = [
        new TestEntity({
          id: 'id1',
          name: '昨天的實體',
          status: 'active',
          createdAt: yesterday,
          updatedAt: yesterday
        }),
        new TestEntity({
          id: 'id2',
          name: '今天的實體',
          status: 'active',
          createdAt: now,
          updatedAt: now
        }),
        new TestEntity({
          id: 'id3',
          name: '明天的實體',
          status: 'active',
          createdAt: tomorrow,
          updatedAt: tomorrow
        })
      ];

      mockRepository.findAll.and.returnValue(Promise.resolve(entities));

      const criteria: SearchCriteriaDto = {
        startDate: now.toISOString(),
        endDate: now.toISOString()
      };

      // Act
      const result = await service.getList(criteria);

      // Assert
      expect(result.items.length).toBe(1);
      expect(result.items[0].name).toBe('今天的實體');
    });
  });
});
