/**
 * 測試工具示範測試
 * 展示如何使用 TestUtils、MockDataGenerator 和 NzTestingModule
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TestUtils, MockDataGenerator, NzTestingModule, TEST_DATA } from './test-utils';

// 測試用組件
@Component({
  template: `
    <div class="test-component">
      <h1>{{ title }}</h1>
      <button class="test-button" (click)="onClick()">Click me</button>
      <input class="test-input" [(ngModel)]="inputValue" />
      <div class="test-content" [class.active]="isActive">
        {{ content }}
      </div>
    </div>
  `
})
class TestComponent {
  title = 'Test Component';
  inputValue = '';
  content = 'Test content';
  isActive = false;

  onClick(): void {
    this.isActive = !this.isActive;
  }
}

describe('TestUtils', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    // 使用 TestUtils 建立測試環境
    fixture = await TestUtils.createComponentFixture<TestComponent>(TestComponent, {
      useForms: true,
      useNzConfig: true
    });
    component = fixture.componentInstance;
    TestUtils.detectChanges(fixture);
  });

  afterEach(() => {
    TestUtils.cleanupTestEnvironment();
  });

  describe('Component Testing', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should have correct title', () => {
      expect(TestUtils.getElementText(fixture, 'h1')).toBe('Test Component');
    });

    it('should handle click events', () => {
      const button = fixture.debugElement.query(By.css('.test-button'));
      expect(button).toBeTruthy();

      TestUtils.click(button.nativeElement);
      TestUtils.detectChanges(fixture);

      expect(component.isActive).toBe(true);
      expect(TestUtils.hasElementClass(fixture, '.test-content', 'active')).toBe(true);
    });

    it('should handle input events', () => {
      const input = fixture.debugElement.query(By.css('.test-input'));
      expect(input).toBeTruthy();

      TestUtils.input(input.nativeElement, 'test value');
      TestUtils.detectChanges(fixture);

      expect(component.inputValue).toBe('test value');
    });
  });

  describe('Element Utilities', () => {
    it('should check element existence', () => {
      expect(TestUtils.hasElement(fixture, '.test-component')).toBe(true);
      expect(TestUtils.hasElement(fixture, '.non-existent')).toBe(false);
    });

    it('should get element text', () => {
      expect(TestUtils.getElementText(fixture, 'h1')).toBe('Test Component');
    });

    it('should get element attributes', () => {
      const button = fixture.debugElement.query(By.css('.test-button'));
      button.nativeElement.setAttribute('data-test', 'test-value');
      TestUtils.detectChanges(fixture);

      expect(TestUtils.getElementAttribute(fixture, '.test-button', 'data-test')).toBe('test-value');
    });

    it('should check element classes', () => {
      expect(TestUtils.hasElementClass(fixture, '.test-content', 'active')).toBe(false);

      component.isActive = true;
      TestUtils.detectChanges(fixture);

      expect(TestUtils.hasElementClass(fixture, '.test-content', 'active')).toBe(true);
    });
  });
});

describe('MockDataGenerator', () => {
  describe('Basic Generators', () => {
    it('should generate random ID', () => {
      const id1 = MockDataGenerator.generateId();
      const id2 = MockDataGenerator.generateId();

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('should generate random string', () => {
      const str = MockDataGenerator.generateString(10);
      expect(str.length).toBe(10);
      expect(typeof str).toBe('string');
    });

    it('should generate valid email', () => {
      const email = MockDataGenerator.generateEmail();
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should generate valid phone number', () => {
      const phone = MockDataGenerator.generatePhone();
      expect(phone).toMatch(/^09\d{8}$/);
    });

    it('should generate valid amount', () => {
      const amount = MockDataGenerator.generateAmount(100, 1000);
      expect(amount).toBeGreaterThanOrEqual(100);
      expect(amount).toBeLessThanOrEqual(1000);
    });

    it('should generate valid date', () => {
      const date = MockDataGenerator.generateDate();
      expect(date instanceof Date).toBe(true);
      expect(date.getTime()).toBeGreaterThan(0);
    });
  });

  describe('Entity Generators', () => {
    it('should generate user data', () => {
      const user = MockDataGenerator.generateUser();

      expect(user.id).toBeTruthy();
      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(user.displayName).toBeTruthy();
      expect(user.photoURL).toBeTruthy();
      expect(user.createdAt instanceof Date).toBe(true);
      expect(user.updatedAt instanceof Date).toBe(true);
      expect(typeof user.isActive).toBe('boolean');
    });

    it('should generate account data', () => {
      const account = MockDataGenerator.generateAccount();

      expect(account.id).toBeTruthy();
      expect(account.name).toMatch(/^帳戶 /);
      expect(typeof account.balance).toBe('number');
      expect(account.currency).toBe('TWD');
      expect(['checking', 'savings', 'credit']).toContain(account.type);
      expect(['active', 'inactive', 'suspended']).toContain(account.status);
    });

    it('should generate transaction data', () => {
      const transaction = MockDataGenerator.generateTransaction();

      expect(transaction.id).toBeTruthy();
      expect(typeof transaction.amount).toBe('number');
      expect(transaction.currency).toBe('TWD');
      expect(['income', 'expense', 'transfer']).toContain(transaction.type);
      expect(['food', 'transport', 'entertainment', 'shopping', 'bills']).toContain(transaction.category);
      expect(transaction.description).toMatch(/^交易 /);
      expect(['pending', 'completed', 'failed', 'cancelled']).toContain(transaction.status);
    });

    it('should allow overrides', () => {
      const user = MockDataGenerator.generateUser({
        email: 'test@example.com',
        displayName: 'Test User'
      });

      expect(user.email).toBe('test@example.com');
      expect(user.displayName).toBe('Test User');
      expect(user.id).toBeTruthy(); // 其他欄位應該保持隨機生成
    });
  });

  describe('List Generators', () => {
    it('should generate list of users', () => {
      const users = MockDataGenerator.generateList(MockDataGenerator.generateUser, 3);

      expect(users.length).toBe(3);
      users.forEach(user => {
        expect(user.id).toBeTruthy();
        expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });

    it('should generate paginated data', () => {
      const paginated = MockDataGenerator.generatePaginatedData(MockDataGenerator.generateUser, 2, 5, 20);

      expect(paginated.data.length).toBe(5);
      expect(paginated.total).toBe(20);
      expect(paginated.page).toBe(2);
      expect(paginated.pageSize).toBe(5);
    });
  });
});

describe('NzTestingModule', () => {
  describe('Configuration', () => {
    it('should provide valid NzConfig', () => {
      const config = NzTestingModule.getNzConfig();

      expect(config.message).toBeDefined();
      if (config.message) {
        expect(config.message.nzDuration).toBe(3000);
        expect(config.message.nzMaxStack).toBe(7);
      }

      expect(config.notification).toBeDefined();
      if (config.notification) {
        expect(config.notification.nzDuration).toBe(4500);
        expect(config.notification.nzMaxStack).toBe(8);
      }
    });

    it('should provide Nz providers', () => {
      const providers = NzTestingModule.getNzProviders();

      expect(providers.length).toBeGreaterThan(0);
      expect(providers.some(p => p.provide === 'NZ_CONFIG')).toBe(true);
    });
  });

  describe('Service Mocks', () => {
    it('should create service mocks', () => {
      const mocks = NzTestingModule.createNzServiceMocks();

      expect(mocks.messageService).toBeDefined();
      expect(mocks.notificationService).toBeDefined();
      expect(mocks.modalService).toBeDefined();

      // 測試方法存在
      expect(typeof mocks.messageService.success).toBe('function');
      expect(typeof mocks.notificationService.success).toBe('function');
      expect(typeof mocks.modalService.create).toBe('function');
    });
  });
});

describe('TEST_DATA Constants', () => {
  it('should provide test data', () => {
    expect(TEST_DATA.USERS.length).toBe(5);
    expect(TEST_DATA.ACCOUNTS.length).toBe(5);
    expect(TEST_DATA.TRANSACTIONS.length).toBe(10);

    expect(TEST_DATA.PAGINATED_USERS.data.length).toBe(10);
    expect(TEST_DATA.PAGINATED_USERS.total).toBe(50);

    expect(TEST_DATA.PAGINATED_ACCOUNTS.data.length).toBe(10);
    expect(TEST_DATA.PAGINATED_ACCOUNTS.total).toBe(30);

    expect(TEST_DATA.PAGINATED_TRANSACTIONS.data.length).toBe(20);
    expect(TEST_DATA.PAGINATED_TRANSACTIONS.total).toBe(100);
  });

  it('should have valid user data', () => {
    TEST_DATA.USERS.forEach(user => {
      expect(user.id).toBeTruthy();
      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(user.displayName).toBeTruthy();
    });
  });

  it('should have valid account data', () => {
    TEST_DATA.ACCOUNTS.forEach(account => {
      expect(account.id).toBeTruthy();
      expect(account.name).toMatch(/^帳戶 /);
      expect(typeof account.balance).toBe('number');
      expect(account.currency).toBe('TWD');
    });
  });

  it('should have valid transaction data', () => {
    TEST_DATA.TRANSACTIONS.forEach(transaction => {
      expect(transaction.id).toBeTruthy();
      expect(typeof transaction.amount).toBe('number');
      expect(transaction.currency).toBe('TWD');
      expect(transaction.description).toMatch(/^交易 /);
    });
  });
});
