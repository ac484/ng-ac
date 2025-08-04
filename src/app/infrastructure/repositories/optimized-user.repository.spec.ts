import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

import { OptimizedUserRepository } from './optimized-user.repository';
import { OptimizedUser, UserData } from '../../domain/entities/optimized-user.entity';
import { SearchCriteria } from '../../domain/interfaces/search-criteria.interface';

describe('OptimizedUserRepository', () => {
  let repository: OptimizedUserRepository;
  let mockFirestore: jasmine.SpyObj<Firestore>;

  beforeEach(() => {
    mockFirestore = jasmine.createSpyObj('Firestore', ['app']);

    TestBed.configureTestingModule({
      providers: [OptimizedUserRepository, { provide: Firestore, useValue: mockFirestore }]
    });

    repository = TestBed.inject(OptimizedUserRepository);
  });

  describe('fromFirestore', () => {
    it('should convert Firestore document to OptimizedUser entity', () => {
      // Arrange
      const mockData = {
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        isEmailVerified: true,
        isAnonymous: false,
        authProvider: 'google',
        status: 'active',
        createdAt: { toDate: () => new Date('2023-01-01') },
        updatedAt: { toDate: () => new Date('2023-01-02') },
        lastLoginAt: { toDate: () => new Date('2023-01-03') },
        phoneNumber: '+1234567890',
        roles: ['user'],
        permissions: ['read']
      };
      const id = 'test-user-id';

      // Act
      const result = (repository as any).fromFirestore(mockData, id);

      // Assert
      expect(result).toBeInstanceOf(OptimizedUser);
      expect(result.id).toBe(id);
      expect(result.email).toBe('test@example.com');
      expect(result.displayName).toBe('Test User');
      expect(result.photoURL).toBe('https://example.com/photo.jpg');
      expect(result.isEmailVerified).toBe(true);
      expect(result.isAnonymous).toBe(false);
      expect(result.authProvider).toBe('google');
      expect(result.status).toBe('active');
      expect(result.createdAt).toEqual(new Date('2023-01-01'));
      expect(result.updatedAt).toEqual(new Date('2023-01-02'));
      expect(result.lastLoginAt).toEqual(new Date('2023-01-03'));
      expect(result.phoneNumber).toBe('+1234567890');
      expect(result.roles).toEqual(['user']);
      expect(result.permissions).toEqual(['read']);
    });

    it('should handle missing optional fields', () => {
      // Arrange
      const mockData = {
        email: 'test@example.com',
        displayName: 'Test User'
      };
      const id = 'test-user-id';

      // Act
      const result = (repository as any).fromFirestore(mockData, id);

      // Assert
      expect(result).toBeInstanceOf(OptimizedUser);
      expect(result.id).toBe(id);
      expect(result.email).toBe('test@example.com');
      expect(result.displayName).toBe('Test User');
      expect(result.photoURL).toBeUndefined();
      expect(result.isEmailVerified).toBe(false);
      expect(result.isAnonymous).toBe(false);
      expect(result.authProvider).toBe('email');
      expect(result.status).toBe('active');
      expect(result.lastLoginAt).toBeUndefined();
      expect(result.phoneNumber).toBeUndefined();
      expect(result.roles).toEqual([]);
      expect(result.permissions).toEqual([]);
    });
  });

  describe('toFirestore', () => {
    it('should convert OptimizedUser entity to Firestore document', () => {
      // Arrange
      const userData: UserData = {
        id: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        isEmailVerified: true,
        isAnonymous: false,
        authProvider: 'google',
        status: 'active',
        lastLoginAt: new Date('2023-01-03'),
        phoneNumber: '+1234567890',
        roles: ['user'],
        permissions: ['read'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      };
      const user = new OptimizedUser(userData);

      // Act
      const result = (repository as any).toFirestore(user);

      // Assert
      expect(result).toEqual({
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        isEmailVerified: true,
        isAnonymous: false,
        authProvider: 'google',
        status: 'active',
        lastLoginAt: new Date('2023-01-03'),
        phoneNumber: '+1234567890',
        roles: ['user'],
        permissions: ['read'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      });
    });

    it('should handle undefined optional fields', () => {
      // Arrange
      const userData: UserData = {
        id: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
        isEmailVerified: false,
        isAnonymous: false,
        authProvider: 'email',
        status: 'active',
        roles: [],
        permissions: [],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      };
      const user = new OptimizedUser(userData);

      // Act
      const result = (repository as any).toFirestore(user);

      // Assert
      expect(result).toEqual({
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
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      });
    });
  });

  describe('findByEmail', () => {
    it('should call findAll with email filter', async () => {
      // Arrange
      const email = 'test@example.com';
      const userData: UserData = {
        id: 'test-id',
        email,
        displayName: 'Test User',
        isEmailVerified: true,
        isAnonymous: false,
        authProvider: 'email',
        status: 'active',
        roles: [],
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const mockUser = new OptimizedUser(userData);

      spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockUser]));

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(repository.findAll).toHaveBeenCalledWith({
        filters: { email: email.toLowerCase() }
      });
      expect(result).toBe(mockUser);
    });

    it('should return null when no user found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      spyOn(repository, 'findAll').and.returnValue(Promise.resolve([]));

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('existsByEmail', () => {
    it('should return true when user exists', async () => {
      // Arrange
      const email = 'test@example.com';
      const userData: UserData = {
        id: 'test-id',
        email,
        displayName: 'Test User',
        isEmailVerified: true,
        isAnonymous: false,
        authProvider: 'email',
        status: 'active',
        roles: [],
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const mockUser = new OptimizedUser(userData);

      spyOn(repository, 'findByEmail').and.returnValue(Promise.resolve(mockUser));

      // Act
      const result = await repository.existsByEmail(email);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when user does not exist', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      spyOn(repository, 'findByEmail').and.returnValue(Promise.resolve(null));

      // Act
      const result = await repository.existsByEmail(email);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('findByStatus', () => {
    it('should call findAll with status criteria', async () => {
      // Arrange
      const status = 'active';
      const userData1: UserData = {
        id: 'test-id-1',
        email: 'user1@example.com',
        displayName: 'User 1',
        isEmailVerified: true,
        isAnonymous: false,
        authProvider: 'email',
        status: 'active',
        roles: [],
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const userData2: UserData = {
        id: 'test-id-2',
        email: 'user2@example.com',
        displayName: 'User 2',
        isEmailVerified: true,
        isAnonymous: false,
        authProvider: 'email',
        status: 'active',
        roles: [],
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const mockUsers = [new OptimizedUser(userData1), new OptimizedUser(userData2)];

      spyOn(repository, 'findAll').and.returnValue(Promise.resolve(mockUsers));

      // Act
      const result = await repository.findByStatus(status);

      // Assert
      expect(repository.findAll).toHaveBeenCalledWith({
        status,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      expect(result).toEqual(mockUsers);
    });
  });

  describe('error handling', () => {
    it('should propagate errors from base methods', async () => {
      // Arrange
      const email = 'test@example.com';
      const mockError = new Error('Database error');
      spyOn(repository, 'findAll').and.returnValue(Promise.reject(mockError));

      // Act & Assert
      await expectAsync(repository.findByEmail(email)).toBeRejectedWith(mockError);
    });
  });

  describe('logging', () => {
    it('should log operations', async () => {
      // Arrange
      const email = 'test@example.com';
      spyOn(repository as any, 'logOperation');
      spyOn(repository, 'findAll').and.returnValue(Promise.resolve([]));

      // Act
      await repository.findByEmail(email);

      // Assert
      expect((repository as any).logOperation).toHaveBeenCalledWith('findByEmail', { email });
      expect((repository as any).logOperation).toHaveBeenCalledWith('findByEmail', { email, found: false });
    });

    it('should log errors', async () => {
      // Arrange
      const email = 'test@example.com';
      const mockError = new Error('Test error');
      spyOn(repository as any, 'logError');
      spyOn(repository, 'findAll').and.returnValue(Promise.reject(mockError));

      // Act
      try {
        await repository.findByEmail(email);
      } catch (error) {
        // Expected to throw
      }

      // Assert
      expect((repository as any).logError).toHaveBeenCalledWith('findByEmail', mockError, { email });
    });
  });
});
