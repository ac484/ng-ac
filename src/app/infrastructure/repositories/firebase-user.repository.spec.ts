import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { FirebaseUserRepository } from './firebase-user.repository';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { SearchCriteria } from '../../domain/interfaces/search-criteria.interface';

describe('FirebaseUserRepository', () => {
    let repository: FirebaseUserRepository;
    let mockFirestore: jasmine.SpyObj<Firestore>;

    beforeEach(() => {
        const firestoreSpy = jasmine.createSpyObj('Firestore', ['collection', 'doc']);

        TestBed.configureTestingModule({
            providers: [
                FirebaseUserRepository,
                { provide: Firestore, useValue: firestoreSpy }
            ]
        });

        repository = TestBed.inject(FirebaseUserRepository);
        mockFirestore = TestBed.inject(Firestore) as jasmine.SpyObj<Firestore>;
    });

    it('should be created', () => {
        expect(repository).toBeTruthy();
    });

    describe('fromFirestore', () => {
        it('should convert Firestore document to User entity', () => {
            // Arrange
            const firestoreData = {
                email: 'test@example.com',
                displayName: 'Test User',
                photoURL: 'https://example.com/photo.jpg',
                isEmailVerified: true,
                isAnonymous: false,
                authProvider: 'google',
                status: 'active' as UserStatus,
                lastLoginAt: { toDate: () => new Date('2023-01-01') },
                phoneNumber: '+1234567890',
                roles: ['user'],
                permissions: ['read'],
                createdAt: { toDate: () => new Date('2023-01-01') },
                updatedAt: { toDate: () => new Date('2023-01-02') }
            };
            const id = 'test-user-id';

            // Act
            const user = (repository as any).fromFirestore(firestoreData, id);

            // Assert
            expect(user).toBeInstanceOf(User);
            expect(user.id).toBe(id);
            expect(user.email).toBe('test@example.com');
            expect(user.displayName).toBe('Test User');
            expect(user.photoURL).toBe('https://example.com/photo.jpg');
            expect(user.isEmailVerified).toBe(true);
            expect(user.isAnonymous).toBe(false);
            expect(user.authProvider).toBe('google');
            expect(user.status).toBe('active');
            expect(user.phoneNumber).toBe('+1234567890');
            expect(user.roles).toEqual(['user']);
            expect(user.permissions).toEqual(['read']);
        });

        it('should handle missing optional fields', () => {
            // Arrange
            const firestoreData = {
                email: 'test@example.com',
                displayName: 'Test User'
            };
            const id = 'test-user-id';

            // Act
            const user = (repository as any).fromFirestore(firestoreData, id);

            // Assert
            expect(user).toBeInstanceOf(User);
            expect(user.id).toBe(id);
            expect(user.email).toBe('test@example.com');
            expect(user.displayName).toBe('Test User');
            expect(user.photoURL).toBeUndefined();
            expect(user.isEmailVerified).toBe(false);
            expect(user.isAnonymous).toBe(false);
            expect(user.authProvider).toBe('email');
            expect(user.status).toBe('active');
            expect(user.roles).toEqual([]);
            expect(user.permissions).toEqual([]);
        });
    });

    describe('toFirestore', () => {
        it('should convert User entity to Firestore document', () => {
            // Arrange
            const userData = {
                id: 'test-user-id',
                email: 'test@example.com',
                displayName: 'Test User',
                photoURL: 'https://example.com/photo.jpg',
                isEmailVerified: true,
                isAnonymous: false,
                authProvider: 'google',
                status: 'active' as UserStatus,
                lastLoginAt: new Date('2023-01-01'),
                phoneNumber: '+1234567890',
                roles: ['user'],
                permissions: ['read'],
                createdAt: new Date('2023-01-01'),
                updatedAt: new Date('2023-01-02')
            };
            const user = new User(userData);

            // Act
            const firestoreData = (repository as any).toFirestore(user);

            // Assert
            expect(firestoreData).toEqual({
                email: 'test@example.com',
                displayName: 'Test User',
                photoURL: 'https://example.com/photo.jpg',
                status: 'active',
                isAnonymous: false,
                isEmailVerified: true,
                authProvider: 'google',
                roles: ['user'],
                permissions: ['read'],
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt,
                phoneNumber: '+1234567890',
                lastLoginAt: userData.lastLoginAt
            });
        });
    });

    describe('findByEmail', () => {
        it('should find user by email using search criteria', async () => {
            // Arrange
            const email = 'test@example.com';
            const mockUser = new User({
                id: 'test-id',
                email,
                displayName: 'Test User',
                isEmailVerified: false,
                isAnonymous: false,
                authProvider: 'email',
                status: 'active' as UserStatus,
                roles: [],
                permissions: [],
                createdAt: new Date(),
                updatedAt: new Date()
            });

            spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockUser]));

            // Act
            const result = await repository.findByEmail(email);

            // Assert
            expect(result).toBe(mockUser);
            expect(repository.findAll).toHaveBeenCalledWith(jasmine.objectContaining({
                sortBy: 'createdAt',
                sortOrder: 'desc'
            }));
        });

        it('should return null when user not found', async () => {
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
            const mockUser = new User({
                id: 'test-id',
                email,
                displayName: 'Test User',
                isEmailVerified: false,
                isAnonymous: false,
                authProvider: 'email',
                status: 'active' as UserStatus,
                roles: [],
                permissions: [],
                createdAt: new Date(),
                updatedAt: new Date()
            });

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

    describe('findAll', () => {
        it('should find all users with default criteria when no status provided', async () => {
            // Arrange
            const mockUsers = [
                new User({
                    id: 'user1',
                    email: 'user1@example.com',
                    displayName: 'User 1',
                    isEmailVerified: false,
                    isAnonymous: false,
                    authProvider: 'email',
                    status: 'active' as UserStatus,
                    roles: [],
                    permissions: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            ];

            spyOn(Object.getPrototypeOf(Object.getPrototypeOf(repository)), 'findAll').and.returnValue(Promise.resolve(mockUsers));

            // Act
            const result = await repository.findAll();

            // Assert
            expect(result).toBe(mockUsers);
            expect(Object.getPrototypeOf(Object.getPrototypeOf(repository)).findAll).toHaveBeenCalledWith({
                sortBy: 'createdAt',
                sortOrder: 'desc'
            });
        });

        it('should find users with status filter', async () => {
            // Arrange
            const criteria = { status: 'active' };
            const mockUsers = [
                new User({
                    id: 'user1',
                    email: 'user1@example.com',
                    displayName: 'User 1',
                    isEmailVerified: false,
                    isAnonymous: false,
                    authProvider: 'email',
                    status: 'active' as UserStatus,
                    roles: [],
                    permissions: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            ];

            spyOn(Object.getPrototypeOf(Object.getPrototypeOf(repository)), 'findAll').and.returnValue(Promise.resolve(mockUsers));

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result).toBe(mockUsers);
            expect(Object.getPrototypeOf(Object.getPrototypeOf(repository)).findAll).toHaveBeenCalledWith({
                sortBy: 'createdAt',
                sortOrder: 'desc',
                status: 'active'
            });
        });
    });

    describe('findByStatus', () => {
        it('should find users by status', async () => {
            // Arrange
            const status = 'active';
            const mockUsers = [
                new User({
                    id: 'user1',
                    email: 'user1@example.com',
                    displayName: 'User 1',
                    isEmailVerified: false,
                    isAnonymous: false,
                    authProvider: 'email',
                    status: 'active' as UserStatus,
                    roles: [],
                    permissions: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            ];

            spyOn(repository, 'findAll').and.returnValue(Promise.resolve(mockUsers));

            // Act
            const result = await repository.findByStatus(status);

            // Assert
            expect(result).toBe(mockUsers);
            expect(repository.findAll).toHaveBeenCalledWith({ status });
        });
    });
});