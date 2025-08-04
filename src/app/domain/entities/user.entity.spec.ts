import { User, CreateUserData, UserStatus } from './user.entity';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a new user with valid data', () => {
      // Arrange
      const userData: CreateUserData = {
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg'
      };

      // Act
      const user = User.create(userData);

      // Assert
      expect(user.email).toBe(userData.email);
      expect(user.displayName).toBe(userData.displayName);
      expect(user.photoURL).toBe(userData.photoURL);
      expect(user.isEmailVerified).toBe(false);
      expect(user.isAnonymous).toBe(false);
      expect(user.authProvider).toBe('email');
      expect(user.status).toBe('active');
      expect(user.roles).toEqual([]);
      expect(user.permissions).toEqual([]);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should create anonymous user', () => {
      // Act
      const user = User.createAnonymous();

      // Assert
      expect(user.isAnonymous).toBe(true);
      expect(user.authProvider).toBe('anonymous');
      expect(user.displayName).toBe('Anonymous User');
      expect(user.email).toContain('anonymous-');
      expect(user.email).toContain('@temp.local');
    });

    it('should add domain event when user is created', () => {
      // Arrange
      const userData: CreateUserData = {
        email: 'test@example.com',
        displayName: 'Test User'
      };

      // Act
      const user = User.create(userData);

      // Assert
      expect(user.hasDomainEvents()).toBe(true);
      expect(user.getDomainEventCount()).toBe(1);

      const events = user.getDomainEvents();
      expect(events[0].type).toBe('UserCreated');
      expect(events[0].userId).toBe(user.id);
      expect(events[0].email).toBe(userData.email);
    });
  });

  describe('updateEmail', () => {
    it('should update email with valid format', () => {
      // Arrange
      const user = User.create({
        email: 'old@example.com',
        displayName: 'Test User'
      });
      const newEmail = 'new@example.com';

      // Act
      user.updateEmail(newEmail);

      // Assert
      expect(user.email).toBe(newEmail);
      expect(user.isEmailVerified).toBe(false);
      expect(user.hasDomainEvents()).toBe(true);

      const events = user.getDomainEvents();
      const updateEvent = events.find(e => e.type === 'UserEmailUpdated');
      expect(updateEvent).toBeDefined();
      expect(updateEvent.oldEmail).toBe('old@example.com');
      expect(updateEvent.newEmail).toBe(newEmail);
    });

    it('should throw error for invalid email format', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });

      // Act & Assert
      expect(() => user.updateEmail('invalid-email')).toThrowError('無效的電子郵件格式');
    });

    it('should throw error for anonymous user', () => {
      // Arrange
      const user = User.createAnonymous();

      // Act & Assert
      expect(() => user.updateEmail('test@example.com')).toThrowError('匿名用戶無法更新電子郵件');
    });
  });

  describe('updateProfile', () => {
    it('should update profile information', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Old Name'
      });
      const newDisplayName = 'New Name';
      const newPhotoURL = 'https://example.com/new-photo.jpg';

      // Act
      user.updateProfile(newDisplayName, newPhotoURL);

      // Assert
      expect(user.displayName).toBe(newDisplayName);
      expect(user.photoURL).toBe(newPhotoURL);

      const events = user.getDomainEvents();
      const updateEvent = events.find(e => e.type === 'UserProfileUpdated');
      expect(updateEvent).toBeDefined();
      expect(updateEvent.displayName).toBe(newDisplayName);
      expect(updateEvent.photoURL).toBe(newPhotoURL);
    });

    it('should throw error for empty display name', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });

      // Act & Assert
      expect(() => user.updateProfile('')).toThrowError('顯示名稱不能為空');
      expect(() => user.updateProfile('   ')).toThrowError('顯示名稱不能為空');
    });
  });

  describe('status management', () => {
    it('should update status and emit event', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });

      // Act
      user.updateStatus('suspended');

      // Assert
      expect(user.status).toBe('suspended');
      expect(user.isActive()).toBe(false);

      const events = user.getDomainEvents();
      const statusEvent = events.find(e => e.type === 'UserStatusChanged');
      expect(statusEvent).toBeDefined();
      expect(statusEvent.oldStatus).toBe('active');
      expect(statusEvent.newStatus).toBe('suspended');
    });

    it('should not emit event if status unchanged', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });
      user.clearDomainEvents(); // 清除創建事件

      // Act
      user.updateStatus('active'); // 相同狀態

      // Assert
      expect(user.hasDomainEvents()).toBe(false);
    });

    it('should activate user account', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });
      user.updateStatus('inactive');
      user.clearDomainEvents();

      // Act
      user.activate();

      // Assert
      expect(user.status).toBe('active');
      expect(user.isActive()).toBe(true);

      const events = user.getDomainEvents();
      const activateEvent = events.find(e => e.type === 'UserActivated');
      expect(activateEvent).toBeDefined();
    });

    it('should deactivate user account', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });
      user.clearDomainEvents();

      // Act
      user.deactivate();

      // Assert
      expect(user.status).toBe('inactive');
      expect(user.isActive()).toBe(false);

      const events = user.getDomainEvents();
      const deactivateEvent = events.find(e => e.type === 'UserDeactivated');
      expect(deactivateEvent).toBeDefined();
    });

    it('should suspend user account', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });
      user.clearDomainEvents();

      // Act
      user.suspend();

      // Assert
      expect(user.status).toBe('suspended');
      expect(user.isActive()).toBe(false);

      const events = user.getDomainEvents();
      const suspendEvent = events.find(e => e.type === 'UserDeactivated');
      expect(suspendEvent).toBeDefined();
      expect(suspendEvent.reason).toBe('Account suspended');
    });
  });

  describe('email verification', () => {
    it('should verify email for regular user', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });

      // Act
      user.verifyEmail();

      // Assert
      expect(user.isEmailVerified).toBe(true);

      const events = user.getDomainEvents();
      const verifyEvent = events.find(e => e.type === 'UserEmailVerified');
      expect(verifyEvent).toBeDefined();
    });

    it('should throw error for anonymous user', () => {
      // Arrange
      const user = User.createAnonymous();

      // Act & Assert
      expect(() => user.verifyEmail()).toThrowError('匿名用戶無法驗證電子郵件');
    });

    it('should not emit event if already verified', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });
      user.verifyEmail();
      user.clearDomainEvents();

      // Act
      user.verifyEmail(); // 再次驗證

      // Assert
      expect(user.hasDomainEvents()).toBe(false);
    });
  });

  describe('role and permission management', () => {
    it('should add and remove roles', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });

      // Act
      user.addRole('admin');
      user.addRole('user');

      // Assert
      expect(user.roles).toContain('admin');
      expect(user.roles).toContain('user');
      expect(user.hasRole('admin')).toBe(true);
      expect(user.hasRole('user')).toBe(true);
      expect(user.hasRole('guest')).toBe(false);

      // Act - Remove role
      user.removeRole('admin');

      // Assert
      expect(user.roles).not.toContain('admin');
      expect(user.roles).toContain('user');
      expect(user.hasRole('admin')).toBe(false);
    });

    it('should add and remove permissions', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });

      // Act
      user.addPermission('read');
      user.addPermission('write');

      // Assert
      expect(user.permissions).toContain('read');
      expect(user.permissions).toContain('write');
      expect(user.hasPermission('read')).toBe(true);
      expect(user.hasPermission('write')).toBe(true);
      expect(user.hasPermission('delete')).toBe(false);

      // Act - Remove permission
      user.removePermission('write');

      // Assert
      expect(user.permissions).not.toContain('write');
      expect(user.permissions).toContain('read');
      expect(user.hasPermission('write')).toBe(false);
    });

    it('should not add duplicate roles or permissions', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });

      // Act
      user.addRole('admin');
      user.addRole('admin'); // 重複
      user.addPermission('read');
      user.addPermission('read'); // 重複

      // Assert
      expect(user.roles.filter(r => r === 'admin').length).toBe(1);
      expect(user.permissions.filter(p => p === 'read').length).toBe(1);
    });

    it('should throw error for empty role or permission names', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });

      // Act & Assert
      expect(() => user.addRole('')).toThrowError('角色名稱不能為空');
      expect(() => user.addRole('   ')).toThrowError('角色名稱不能為空');
      expect(() => user.addPermission('')).toThrowError('權限名稱不能為空');
      expect(() => user.addPermission('   ')).toThrowError('權限名稱不能為空');
    });
  });

  describe('validation', () => {
    it('should validate valid user', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });

      // Act
      const result = user.validate();

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should detect invalid email', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });
      user.email = 'invalid-email'; // 直接設置無效郵件

      // Act
      const result = user.validate();

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('無效的電子郵件格式');
    });

    it('should detect empty display name', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });
      user.displayName = ''; // 直接設置空名稱

      // Act
      const result = user.validate();

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('顯示名稱不能為空');
    });

    it('should detect anonymous user with verified email', () => {
      // Arrange
      const user = User.createAnonymous();
      user.isEmailVerified = true; // 直接設置矛盾狀態

      // Act
      const result = user.validate();

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('匿名用戶不能有已驗證的電子郵件');
    });

    it('should detect invalid status', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });
      (user as any).status = 'invalid-status'; // 直接設置無效狀態

      // Act
      const result = user.validate();

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('無效的用戶狀態');
    });
  });

  describe('utility methods', () => {
    it('should provide correct summary', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });
      user.addRole('admin');
      user.addPermission('read');

      // Act
      const summary = user.getSummary();

      // Assert
      expect(summary.id).toBe(user.id);
      expect(summary.email).toBe(user.email);
      expect(summary.displayName).toBe(user.displayName);
      expect(summary.status).toBe(user.status);
      expect(summary.isActive).toBe(true);
      expect(summary.isAnonymous).toBe(false);
      expect(summary.roles).toEqual(['admin']);
      expect(summary.permissions).toEqual(['read']);
    });

    it('should convert to Delon auth format', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg'
      });
      user.verifyEmail();
      user.addRole('admin');
      user.addPermission('read');

      // Act
      const delonUser = user.toDelonAuthUser();

      // Assert
      expect(delonUser.id).toBe(user.id);
      expect(delonUser.name).toBe(user.displayName);
      expect(delonUser.email).toBe(user.email);
      expect(delonUser.avatar).toBe(user.photoURL);
      expect(delonUser.isAnonymous).toBe(false);
      expect(delonUser.emailVerified).toBe(true);
      expect(delonUser.roles).toEqual(['admin']);
      expect(delonUser.permissions).toEqual(['read']);
    });

    it('should serialize to JSON correctly', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });

      // Act
      const json = user.toJSON();

      // Assert
      expect(json.id).toBe(user.id);
      expect(json.email).toBe(user.email);
      expect(json.displayName).toBe(user.displayName);
      expect(json.createdAt).toBe(user.createdAt.toISOString());
      expect(json.updatedAt).toBe(user.updatedAt.toISOString());
    });
  });

  describe('business logic', () => {
    it('should determine if user can perform actions', () => {
      // Arrange
      const activeUser = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });

      const anonymousUser = User.createAnonymous();

      const suspendedUser = User.create({
        email: 'suspended@example.com',
        displayName: 'Suspended User'
      });
      suspendedUser.updateStatus('suspended');

      // Assert
      expect(activeUser.canPerformActions()).toBe(true);
      expect(anonymousUser.canPerformActions()).toBe(false);
      expect(suspendedUser.canPerformActions()).toBe(false);
    });

    it('should record login correctly', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });
      const beforeLogin = new Date();

      // Act
      user.recordLogin();

      // Assert
      expect(user.lastLoginAt).toBeDefined();
      expect(user.lastLoginAt!.getTime()).toBeGreaterThanOrEqual(beforeLogin.getTime());

      const events = user.getDomainEvents();
      const loginEvent = events.find(e => e.type === 'UserLoggedIn');
      expect(loginEvent).toBeDefined();
      expect(loginEvent.userId).toBe(user.id);
    });
  });

  describe('backward compatibility', () => {
    it('should maintain compatibility with existing interfaces', () => {
      // Arrange
      const user = User.create({
        email: 'test@example.com',
        displayName: 'Test User'
      });

      // Assert - Check that all expected properties exist
      expect(user.id).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.displayName).toBeDefined();
      expect(user.status).toBeDefined();
      expect(user.isAnonymous).toBeDefined();
      expect(user.isEmailVerified).toBeDefined();
      expect(user.authProvider).toBeDefined();
      expect(user.roles).toBeDefined();
      expect(user.permissions).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();

      // Assert - Check that all expected methods exist
      expect(typeof user.isActive).toBe('function');
      expect(typeof user.canPerformActions).toBe('function');
      expect(typeof user.hasRole).toBe('function');
      expect(typeof user.hasPermission).toBe('function');
      expect(typeof user.validate).toBe('function');
      expect(typeof user.getSummary).toBe('function');
      expect(typeof user.toDelonAuthUser).toBe('function');
    });
  });
});
