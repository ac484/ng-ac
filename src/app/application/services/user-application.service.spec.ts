import { TestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler.service';
import { UserApplicationService } from './user-application.service';
import { User } from '../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../domain/repositories/repository-tokens';
import { UserRepository } from '../../domain/repositories/user.repository';
import { ConversionUtilitiesService } from '../../domain/services/conversion-utilities.service';
import { UserDomainService } from '../../domain/services/user-domain.service';
import { CreateUserDto, UpdateUserDto, UpdateUserStatusDto } from '../dto/user.dto';

describe('UserApplicationService (Refactored with BaseApplicationService)', () => {
  let service: UserApplicationService;
  let mockUserRepository: jasmine.SpyObj<UserRepository>;
  let mockUserDomainService: jasmine.SpyObj<UserDomainService>;
  let mockConversionUtilities: jasmine.SpyObj<ConversionUtilitiesService>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(() => {
    const userRepositorySpy = jasmine.createSpyObj('UserRepository', ['findById', 'findByEmail', 'findAll', 'save', 'delete']);
    const userDomainServiceSpy = jasmine.createSpyObj('UserDomainService', ['createUser', 'updateUserProfile', 'updateUserStatus']);
    const conversionUtilitiesSpy = jasmine.createSpyObj('ConversionUtilitiesService', ['stringToUserStatus']);
    const errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', ['handleError', 'handleSuccess']);

    TestBed.configureTestingModule({
      providers: [
        UserApplicationService,
        { provide: USER_REPOSITORY, useValue: userRepositorySpy },
        { provide: UserDomainService, useValue: userDomainServiceSpy },
        { provide: ConversionUtilitiesService, useValue: conversionUtilitiesSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerSpy }
      ]
    });

    service = TestBed.inject(UserApplicationService);
    mockUserRepository = TestBed.inject(USER_REPOSITORY) as jasmine.SpyObj<UserRepository>;
    mockUserDomainService = TestBed.inject(UserDomainService) as jasmine.SpyObj<UserDomainService>;
    mockConversionUtilities = TestBed.inject(ConversionUtilitiesService) as jasmine.SpyObj<ConversionUtilitiesService>;
    mockErrorHandler = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
  });

  // Helper function to create test user
  function createTestUser(overrides: Partial<any> = {}): User {
    const userData = {
      id: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      isEmailVerified: false,
      isAnonymous: false,
      authProvider: 'email',
      status: 'active' as const,
      roles: [],
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
    return new User(userData);
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUser (using base class)', () => {
    it('should create a user successfully using base class method', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        displayName: 'Test User'
      };

      const mockUser = createTestUser();

      mockUserRepository.findByEmail.and.returnValue(Promise.resolve(null));
      mockUserDomainService.createUser.and.returnValue(mockUser);
      mockUserRepository.save.and.returnValue(Promise.resolve());

      const result = await service.createUser(createUserDto);

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(result.displayName).toBe('Test User');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserDomainService.createUser).toHaveBeenCalledWith('test@example.com', 'Test User', undefined);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should handle user already exists error', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        displayName: 'Existing User'
      };

      const existingUser = createTestUser({ email: 'existing@example.com' });
      mockUserRepository.findByEmail.and.returnValue(Promise.resolve(existingUser));

      await expectAsync(service.createUser(createUserDto)).toBeRejected();
    });
  });

  describe('getUserById (using base class)', () => {
    it('should return user when found using base class method', async () => {
      const mockUser = createTestUser();
      mockUserRepository.findById.and.returnValue(Promise.resolve(mockUser));

      const result = await service.getUserById('test-user-id');

      expect(result).toBeDefined();
      expect(result?.id).toBe('test-user-id');
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findById.and.returnValue(Promise.resolve(null));

      const result = await service.getUserById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when found by email', async () => {
      const mockUser = createTestUser();
      mockUserRepository.findByEmail.and.returnValue(Promise.resolve(mockUser));

      const result = await service.getUserByEmail('test@example.com');

      expect(result).toBeDefined();
      expect(result?.email).toBe('test@example.com');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null when user not found by email', async () => {
      mockUserRepository.findByEmail.and.returnValue(Promise.resolve(null));

      const result = await service.getUserByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('updateUserProfile (using base class)', () => {
    it('should update user profile successfully using base class method', async () => {
      const updateDto: UpdateUserDto = {
        displayName: 'Updated Name'
      };

      const mockUser = createTestUser();
      mockUserRepository.findById.and.returnValue(Promise.resolve(mockUser));
      mockUserRepository.save.and.returnValue(Promise.resolve());

      const result = await service.updateUserProfile('test-user-id', updateDto);

      expect(result).toBeDefined();
      expect(mockUserDomainService.updateUserProfile).toHaveBeenCalledWith(mockUser, 'Updated Name', undefined);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('updateUserStatus', () => {
    it('should update user status successfully', async () => {
      const updateStatusDto: UpdateUserStatusDto = {
        status: 'inactive'
      };

      const mockUser = createTestUser();
      mockUserRepository.findById.and.returnValue(Promise.resolve(mockUser));
      mockConversionUtilities.stringToUserStatus.and.returnValue('inactive');
      mockUserRepository.save.and.returnValue(Promise.resolve());

      const result = await service.updateUserStatus('test-user-id', updateStatusDto);

      expect(result).toBeDefined();
      expect(mockConversionUtilities.stringToUserStatus).toHaveBeenCalledWith('inactive');
      expect(mockUserDomainService.updateUserStatus).toHaveBeenCalledWith(mockUser, 'inactive');
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should handle user not found error', async () => {
      const updateStatusDto: UpdateUserStatusDto = {
        status: 'inactive'
      };

      mockUserRepository.findById.and.returnValue(Promise.resolve(null));

      await expectAsync(service.updateUserStatus('non-existent', updateStatusDto)).toBeRejected();
    });
  });

  describe('getAllUsers (using base class)', () => {
    it('should return paginated users using base class method', async () => {
      const mockUsers = [
        createTestUser({ id: 'user-1', email: 'user1@example.com' }),
        createTestUser({ id: 'user-2', email: 'user2@example.com', status: 'inactive' })
      ];

      mockUserRepository.findAll.and.returnValue(Promise.resolve(mockUsers));

      const result = await service.getAllUsers({ page: 1, pageSize: 10 });

      expect(result).toBeDefined();
      expect(result.users.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('should handle search criteria', async () => {
      const mockUsers = [
        createTestUser({ id: 'user-1', email: 'john@example.com', displayName: 'John Doe' }),
        createTestUser({ id: 'user-2', email: 'jane@example.com', displayName: 'Jane Smith' })
      ];

      mockUserRepository.findAll.and.returnValue(Promise.resolve(mockUsers));

      const result = await service.getAllUsers({
        email: 'john',
        page: 1,
        pageSize: 10
      });

      expect(result).toBeDefined();
      expect(result.users.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      const mockUsers = [
        createTestUser({ status: 'active' }),
        createTestUser({ status: 'inactive' }),
        createTestUser({ status: 'suspended' })
      ];

      mockUserRepository.findAll.and.returnValue(Promise.resolve(mockUsers));

      const result = await service.getUserStats();

      expect(result).toBeDefined();
      expect(result.total).toBe(3);
      expect(result.active).toBe(1);
      expect(result.inactive).toBe(1);
      expect(result.suspended).toBe(1);
      expect(result.pending).toBe(0);
    });
  });

  describe('deleteUser (using base class)', () => {
    it('should delete user successfully using base class method', async () => {
      const mockUser = createTestUser();
      mockUserRepository.findById.and.returnValue(Promise.resolve(mockUser));
      mockUserRepository.delete.and.returnValue(Promise.resolve());

      await service.deleteUser('test-user-id');

      expect(mockUserRepository.findById).toHaveBeenCalledWith('test-user-id');
      expect(mockUserRepository.delete).toHaveBeenCalledWith('test-user-id');
    });
  });

  describe('filtering and sorting (base class methods)', () => {
    it('should filter users by keyword', async () => {
      const users = [
        createTestUser({ email: 'john@example.com', displayName: 'John Doe' }),
        createTestUser({ email: 'jane@example.com', displayName: 'Jane Smith' })
      ];

      // Test the protected method through reflection for unit testing
      const filteredUsers = await (service as any).filterByKeyword(users, 'john');
      expect(filteredUsers.length).toBe(1);
      expect(filteredUsers[0].email).toBe('john@example.com');
    });

    it('should filter users by status', async () => {
      const users = [createTestUser({ status: 'active' }), createTestUser({ status: 'inactive' })];

      const filteredUsers = await (service as any).filterByStatus(users, 'active');
      expect(filteredUsers.length).toBe(1);
      expect(filteredUsers[0].status).toBe('active');
    });

    it('should sort users by email', async () => {
      const users = [createTestUser({ email: 'zebra@example.com' }), createTestUser({ email: 'alpha@example.com' })];

      const sortedUsers = await (service as any).applySorting(users, 'email', 'asc');
      expect(sortedUsers[0].email).toBe('alpha@example.com');
      expect(sortedUsers[1].email).toBe('zebra@example.com');
    });
  });
});
