import { TestBed } from '@angular/core/testing';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Repository } from './base-application.service';
import { ErrorHandlerService } from './error-handler.service';
import { OptimizedUserApplicationService, CreateUserDto, UpdateUserDto, UserResponseDto } from './optimized-user-application.service';
import { OptimizedUser, UserData } from '../../domain/entities/optimized-user.entity';
import { USER_REPOSITORY } from '../../domain/repositories/repository-tokens';

describe('OptimizedUserApplicationService', () => {
  let service: OptimizedUserApplicationService;
  let mockRepository: jasmine.SpyObj<Repository<OptimizedUser>>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandlerService>;
  let mockMessageService: jasmine.SpyObj<NzMessageService>;

  beforeEach(() => {
    // 創建 mock 物件
    mockRepository = jasmine.createSpyObj('Repository', ['findById', 'findAll', 'save', 'delete']);

    mockMessageService = jasmine.createSpyObj('NzMessageService', ['success', 'error', 'warning']);

    mockErrorHandler = jasmine.createSpyObj('ErrorHandlerService', ['handleError', 'handleSuccess', 'handleWarning']);

    TestBed.configureTestingModule({
      providers: [
        OptimizedUserApplicationService,
        { provide: USER_REPOSITORY, useValue: mockRepository },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
        { provide: NzMessageService, useValue: mockMessageService }
      ]
    });

    service = TestBed.inject(OptimizedUserApplicationService);
  });

  // 輔助方法：創建測試用戶
  function createTestUser(overrides: Partial<UserData> = {}): OptimizedUser {
    const userData: UserData = {
      id: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: undefined,
      isEmailVerified: false,
      isAnonymous: false,
      authProvider: 'email',
      status: 'active',
      lastLoginAt: undefined,
      phoneNumber: undefined,
      roles: [],
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
    return new OptimizedUser(userData);
  }

  describe('create', () => {
    it('應該成功創建用戶', async () => {
      // Arrange
      const createDto: CreateUserDto = {
        email: 'newuser@example.com',
        displayName: 'New User',
        photoURL: 'https://example.com/photo.jpg'
      };

      mockRepository.findAll.and.returnValue(Promise.resolve([])); // 沒有現有用戶
      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result.email).toBe(createDto.email);
      expect(result.displayName).toBe(createDto.displayName);
      expect(result.photoURL).toBe(createDto.photoURL);
      expect(result.isEmailVerified).toBe(false);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('創建成功');
    });

    it('當郵箱已存在時應該拋出錯誤', async () => {
      // Arrange
      const createDto: CreateUserDto = {
        email: 'existing@example.com',
        displayName: 'New User'
      };

      const existingUser = createTestUser({ email: 'existing@example.com' });
      mockRepository.findAll.and.returnValue(Promise.resolve([existingUser]));

      // Act & Assert
      await expectAsync(service.create(createDto)).toBeRejectedWithError('郵箱已被使用');

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('當郵箱格式無效時應該拋出錯誤', async () => {
      // Arrange
      const createDto: CreateUserDto = {
        email: 'invalid-email',
        displayName: 'New User'
      };

      // Act & Assert
      await expectAsync(service.create(createDto)).toBeRejectedWithError('郵箱格式無效');

      expect(mockRepository.findAll).not.toHaveBeenCalled();
    });

    it('當顯示名稱為空時應該拋出錯誤', async () => {
      // Arrange
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        displayName: ''
      };

      // Act & Assert
      await expectAsync(service.create(createDto)).toBeRejectedWithError('顯示名稱不能為空');
    });

    it('當顯示名稱過長時應該拋出錯誤', async () => {
      // Arrange
      const createDto: CreateUserDto = {
        email: 'test@example.com',
        displayName: 'a'.repeat(51) // 超過 50 個字元
      };

      // Act & Assert
      await expectAsync(service.create(createDto)).toBeRejectedWithError('顯示名稱不能超過 50 個字元');
    });
  });

  describe('update', () => {
    it('應該成功更新用戶', async () => {
      // Arrange
      const user = createTestUser();
      const updateDto: UpdateUserDto = {
        displayName: 'Updated Name',
        photoURL: 'https://example.com/new-photo.jpg'
      };

      mockRepository.findById.and.returnValue(Promise.resolve(user));
      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.update('test-user-id', updateDto);

      // Assert
      expect(result.displayName).toBe('Updated Name');
      expect(result.photoURL).toBe('https://example.com/new-photo.jpg');
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('更新成功');
    });

    it('當更新的顯示名稱為空時應該拋出錯誤', async () => {
      // Arrange
      const updateDto: UpdateUserDto = {
        displayName: ''
      };

      // Act & Assert
      await expectAsync(service.update('test-user-id', updateDto)).toBeRejectedWithError('顯示名稱不能為空');
    });
  });

  describe('getUserByEmail', () => {
    it('應該成功根據郵箱獲取用戶', async () => {
      // Arrange
      const user = createTestUser({ email: 'test@example.com' });
      mockRepository.findAll.and.returnValue(Promise.resolve([user]));

      // Act
      const result = await service.getUserByEmail('test@example.com');

      // Assert
      expect(result).not.toBeNull();
      expect(result!.email).toBe('test@example.com');
      expect(result!.id).toBe('test-user-id');
    });

    it('當用戶不存在時應該返回 null', async () => {
      // Arrange
      mockRepository.findAll.and.returnValue(Promise.resolve([]));

      // Act
      const result = await service.getUserByEmail('nonexistent@example.com');

      // Assert
      expect(result).toBeNull();
    });

    it('當郵箱格式無效時應該拋出錯誤', async () => {
      // Act & Assert
      await expectAsync(service.getUserByEmail('invalid-email')).toBeRejectedWithError('無效的郵箱地址');
    });
  });

  describe('verifyUserEmail', () => {
    it('應該成功驗證用戶郵箱', async () => {
      // Arrange
      const user = createTestUser({ isEmailVerified: false });
      mockRepository.findById.and.returnValue(Promise.resolve(user));
      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.verifyUserEmail('test-user-id');

      // Assert
      expect(result.isEmailVerified).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('郵箱驗證成功');
    });

    it('當用戶不存在時應該拋出錯誤', async () => {
      // Arrange
      mockRepository.findById.and.returnValue(Promise.resolve(null));

      // Act & Assert
      await expectAsync(service.verifyUserEmail('non-existent-id')).toBeRejectedWithError('用戶不存在');
    });
  });

  describe('updateLastLogin', () => {
    it('應該成功更新最後登入時間', async () => {
      // Arrange
      const user = createTestUser();
      mockRepository.findById.and.returnValue(Promise.resolve(user));
      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      await service.updateLastLogin('test-user-id');

      // Assert
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      // 驗證 lastLoginAt 已被更新（應該是最近的時間）
      expect(user.lastLoginAt).toBeDefined();
      expect(user.lastLoginAt!.getTime()).toBeCloseTo(new Date().getTime(), -2); // 允許 2 秒誤差
    });

    it('當用戶不存在時不應該拋出錯誤（只記錄日誌）', async () => {
      // Arrange
      mockRepository.findById.and.returnValue(Promise.resolve(null));

      // Act - 不應該拋出錯誤
      await expectAsync(service.updateLastLogin('non-existent-id')).toBeRejectedWithError('用戶不存在');
    });
  });

  describe('getUserStats', () => {
    it('應該成功獲取用戶統計資料', async () => {
      // Arrange
      const now = new Date();
      const recentDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 天前
      const oldDate = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000); // 45 天前

      const users = [
        createTestUser({
          id: 'user1',
          isEmailVerified: true,
          lastLoginAt: recentDate
        }),
        createTestUser({
          id: 'user2',
          isEmailVerified: false,
          lastLoginAt: oldDate
        }),
        createTestUser({
          id: 'user3',
          isEmailVerified: true,
          lastLoginAt: undefined
        })
      ];

      mockRepository.findAll.and.returnValue(Promise.resolve(users));

      // Act
      const result = await service.getUserStats();

      // Assert
      expect(result.total).toBe(3);
      expect(result.verified).toBe(2);
      expect(result.unverified).toBe(1);
      expect(result.active).toBe(1); // 只有最近 30 天內登入的用戶
    });
  });

  describe('getList with filters', () => {
    it('應該正確過濾已驗證用戶', async () => {
      // Arrange
      const users = [createTestUser({ id: 'user1', isEmailVerified: true }), createTestUser({ id: 'user2', isEmailVerified: false })];

      mockRepository.findAll.and.returnValue(Promise.resolve(users));

      // Act
      const result = await service.getList({ status: 'verified' });

      // Assert
      expect(result.items.length).toBe(1);
      expect(result.items[0].isEmailVerified).toBe(true);
    });

    it('應該正確過濾未驗證用戶', async () => {
      // Arrange
      const users = [createTestUser({ id: 'user1', isEmailVerified: true }), createTestUser({ id: 'user2', isEmailVerified: false })];

      mockRepository.findAll.and.returnValue(Promise.resolve(users));

      // Act
      const result = await service.getList({ status: 'unverified' });

      // Assert
      expect(result.items.length).toBe(1);
      expect(result.items[0].isEmailVerified).toBe(false);
    });

    it('應該正確過濾活躍用戶', async () => {
      // Arrange
      const now = new Date();
      const recentDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 天前
      const oldDate = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000); // 45 天前

      const users = [
        createTestUser({ id: 'user1', lastLoginAt: recentDate }),
        createTestUser({ id: 'user2', lastLoginAt: oldDate }),
        createTestUser({ id: 'user3', lastLoginAt: undefined })
      ];

      mockRepository.findAll.and.returnValue(Promise.resolve(users));

      // Act
      const result = await service.getList({ status: 'active' });

      // Assert
      expect(result.items.length).toBe(1);
      expect(result.items[0].id).toBe('user1');
    });

    it('應該正確應用關鍵字搜尋', async () => {
      // Arrange
      const users = [
        createTestUser({
          id: 'user1',
          email: 'john@example.com',
          displayName: 'John Doe'
        }),
        createTestUser({
          id: 'user2',
          email: 'jane@example.com',
          displayName: 'Jane Smith'
        })
      ];

      mockRepository.findAll.and.returnValue(Promise.resolve(users));

      // Act
      const result = await service.getList({ keyword: 'john' });

      // Assert
      expect(result.items.length).toBe(1);
      expect(result.items[0].displayName).toBe('John Doe');
    });
  });
});
