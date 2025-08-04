import { TestBed } from '@angular/core/testing';
import { MockUserRepository } from './mock-user.repository';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { SearchCriteria } from '../../domain/interfaces/search-criteria.interface';

describe('MockUserRepository', () => {
    let repository: MockUserRepository;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockUserRepository]
        });

        repository = TestBed.inject(MockUserRepository);
        repository.clearMockData(); // Start with clean data for each test
    });

    it('should be created', () => {
        expect(repository).toBeTruthy();
    });

    describe('findById', () => {
        it('should find user by ID', async () => {
            // Arrange
            const user = User.create({
                email: 'test@example.com',
                displayName: 'Test User'
            });
            repository.addMockUser(user);

            // Act
            const result = await repository.findById(user.id);

            // Assert
            expect(result).toBe(user);
        });

        it('should return null when user not found', async () => {
            // Act
            const result = await repository.findById('nonexistent-id');

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('findByEmail', () => {
        it('should find user by email (case insensitive)', async () => {
            // Arrange
            const user = User.create({
                email: 'Test@Example.com',
                displayName: 'Test User'
            });
            repository.addMockUser(user);

            // Act
            const result = await repository.findByEmail('test@example.com');

            // Assert
            expect(result).toBe(user);
        });

        it('should return null when user not found', async () => {
            // Act
            const result = await repository.findByEmail('nonexistent@example.com');

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('existsByEmail', () => {
        it('should return true when user exists', async () => {
            // Arrange
            const user = User.create({
                email: 'test@example.com',
                displayName: 'Test User'
            });
            repository.addMockUser(user);

            // Act
            const result = await repository.existsByEmail('test@example.com');

            // Assert
            expect(result).toBe(true);
        });

        it('should return false when user does not exist', async () => {
            // Act
            const result = await repository.existsByEmail('nonexistent@example.com');

            // Assert
            expect(result).toBe(false);
        });

        it('should be case insensitive', async () => {
            // Arrange
            const user = User.create({
                email: 'Test@Example.com',
                displayName: 'Test User'
            });
            repository.addMockUser(user);

            // Act
            const result = await repository.existsByEmail('test@example.com');

            // Assert
            expect(result).toBe(true);
        });
    });

    describe('findAll', () => {
        beforeEach(() => {
            // Add some test users
            const users = [
                User.create({ email: 'user1@example.com', displayName: 'User 1' }),
                User.create({ email: 'user2@example.com', displayName: 'User 2' }),
                User.create({ email: 'user3@example.com', displayName: 'User 3' })
            ];

            // Set different statuses
            users[1].status = 'inactive' as UserStatus;

            users.forEach(user => repository.addMockUser(user));
        });

        it('should find all users when no status provided', async () => {
            // Act
            const result = await repository.findAll();

            // Assert
            expect(result.length).toBe(3);
            expect(result.every(user => user instanceof User)).toBe(true);
        });

        it('should filter users by status', async () => {
            // Act
            const result = await repository.findAll({ status: 'active' });

            // Assert
            expect(result.length).toBe(2);
            expect(result.every(user => user.status === 'active')).toBe(true);
        });

        it('should sort users by createdAt desc by default', async () => {
            // Act
            const result = await repository.findAll();

            // Assert
            expect(result.length).toBe(3);
            for (let i = 0; i < result.length - 1; i++) {
                expect(result[i].createdAt.getTime()).toBeGreaterThanOrEqual(result[i + 1].createdAt.getTime());
            }
        });
    });

    describe('findByStatus', () => {
        beforeEach(() => {
            // Add some test users with different statuses
            const activeUser = User.create({ email: 'active@example.com', displayName: 'Active User' });
            const inactiveUser = User.create({ email: 'inactive@example.com', displayName: 'Inactive User' });
            inactiveUser.status = 'inactive' as UserStatus;

            repository.addMockUser(activeUser);
            repository.addMockUser(inactiveUser);
        });

        it('should find users by status', async () => {
            // Act
            const activeUsers = await repository.findByStatus('active');
            const inactiveUsers = await repository.findByStatus('inactive');

            // Assert
            expect(activeUsers.length).toBe(1);
            expect(activeUsers[0].status).toBe('active');
            expect(inactiveUsers.length).toBe(1);
            expect(inactiveUsers[0].status).toBe('inactive');
        });
    });

    describe('save', () => {
        it('should save new user', async () => {
            // Arrange
            const user = User.create({
                email: 'new@example.com',
                displayName: 'New User'
            });

            // Act
            await repository.save(user);
            const result = await repository.findById(user.id);

            // Assert
            expect(result).toBe(user);
        });

        it('should update existing user', async () => {
            // Arrange
            const user = User.create({
                email: 'test@example.com',
                displayName: 'Test User'
            });
            repository.addMockUser(user);

            // Modify user
            user.displayName = 'Updated User';

            // Act
            await repository.save(user);
            const result = await repository.findById(user.id);

            // Assert
            expect(result?.displayName).toBe('Updated User');
        });
    });

    describe('delete', () => {
        it('should delete user by ID', async () => {
            // Arrange
            const user = User.create({
                email: 'test@example.com',
                displayName: 'Test User'
            });
            repository.addMockUser(user);

            // Act
            await repository.delete(user.id);
            const result = await repository.findById(user.id);

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('count', () => {
        it('should count all users', async () => {
            // Arrange
            const users = [
                User.create({ email: 'user1@example.com', displayName: 'User 1' }),
                User.create({ email: 'user2@example.com', displayName: 'User 2' }),
                User.create({ email: 'user3@example.com', displayName: 'User 3' })
            ];

            users.forEach(user => repository.addMockUser(user));

            // Act
            const result = await repository.count();

            // Assert
            expect(result).toBe(3);
        });
    });

    describe('applyKeywordSearch', () => {
        it('should search users by display name and email', async () => {
            // Arrange
            const users = [
                User.create({ email: 'john.doe@example.com', displayName: 'John Doe' }),
                User.create({ email: 'jane.smith@example.com', displayName: 'Jane Smith' }),
                User.create({ email: 'bob.wilson@example.com', displayName: 'Bob Wilson' })
            ];

            users.forEach(user => repository.addMockUser(user));

            // Act
            const criteria: SearchCriteria = { keyword: 'john' };
            const result = await (repository as any).findAll(criteria);

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].displayName).toBe('John Doe');
        });

        it('should search users by email', async () => {
            // Arrange
            const users = [
                User.create({ email: 'john.doe@example.com', displayName: 'John Doe' }),
                User.create({ email: 'jane.smith@example.com', displayName: 'Jane Smith' })
            ];

            users.forEach(user => repository.addMockUser(user));

            // Act
            const criteria: SearchCriteria = { keyword: 'smith' };
            const result = await (repository as any).findAll(criteria);

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].email).toBe('jane.smith@example.com');
        });
    });

    describe('initialization', () => {
        it('should initialize with mock data', async () => {
            // Arrange & Act
            const newRepository = new MockUserRepository();

            // Assert
            expect(await newRepository.count()).toBeGreaterThan(0);
        });
    });
});