/**
 * 測試工具類別
 * 提供通用測試工具，包括 Mock 資料生成器、ng-zorro-antd 測試模組配置和標準化的測試設定
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  UserOutline,
  SettingOutline,
  PlusOutline,
  EditOutline,
  DeleteOutline,
  SearchOutline,
  EyeOutline,
  DownloadOutline,
  UploadOutline,
  ReloadOutline
} from '@ant-design/icons-angular/icons';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { provideNzI18n, zh_TW } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

// Jasmine 類型宣告
declare const jasmine: any;
declare const spyOn: any;

/**
 * 測試配置介面
 */
export interface TestConfig {
  imports?: any[];
  declarations?: any[];
  providers?: any[];
  schemas?: any[];
  useAnimations?: boolean;
  useRouter?: boolean;
  useHttp?: boolean;
  useForms?: boolean;
  useNzConfig?: boolean;
}

/**
 * Mock 資料生成器
 */
export class MockDataGenerator {
  /**
   * 生成隨機 ID
   */
  static generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * 生成隨機字串
   */
  static generateString(length = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 生成隨機電子郵件
   */
  static generateEmail(): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${this.generateString(8)}@${domain}`;
  }

  /**
   * 生成隨機電話號碼
   */
  static generatePhone(): string {
    return `09${Math.floor(Math.random() * 90000000) + 10000000}`;
  }

  /**
   * 生成隨機日期
   */
  static generateDate(start: Date = new Date(2020, 0, 1), end: Date = new Date()): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  /**
   * 生成隨機金額
   */
  static generateAmount(min = 100, max = 10000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 生成用戶 Mock 資料
   */
  static generateUser(overrides: Partial<any> = {}): any {
    return {
      id: this.generateId(),
      email: this.generateEmail(),
      displayName: this.generateString(10),
      photoURL: `https://via.placeholder.com/150/007bff/ffffff?text=${this.generateString(2)}`,
      createdAt: this.generateDate(),
      updatedAt: this.generateDate(),
      isActive: Math.random() > 0.2,
      ...overrides
    };
  }

  /**
   * 生成帳戶 Mock 資料
   */
  static generateAccount(overrides: Partial<any> = {}): any {
    return {
      id: this.generateId(),
      name: `帳戶 ${this.generateString(5)}`,
      balance: this.generateAmount(),
      currency: 'TWD',
      type: ['checking', 'savings', 'credit'][Math.floor(Math.random() * 3)],
      status: ['active', 'inactive', 'suspended'][Math.floor(Math.random() * 3)],
      createdAt: this.generateDate(),
      updatedAt: this.generateDate(),
      ...overrides
    };
  }

  /**
   * 生成交易 Mock 資料
   */
  static generateTransaction(overrides: Partial<any> = {}): any {
    return {
      id: this.generateId(),
      amount: this.generateAmount(),
      currency: 'TWD',
      type: ['income', 'expense', 'transfer'][Math.floor(Math.random() * 3)],
      category: ['food', 'transport', 'entertainment', 'shopping', 'bills'][Math.floor(Math.random() * 5)],
      description: `交易 ${this.generateString(8)}`,
      status: ['pending', 'completed', 'failed', 'cancelled'][Math.floor(Math.random() * 4)],
      createdAt: this.generateDate(),
      updatedAt: this.generateDate(),
      ...overrides
    };
  }

  /**
   * 生成列表 Mock 資料
   */
  static generateList<T>(generator: () => T, count = 10, overrides: Partial<T> = {}): T[] {
    return Array.from({ length: count }, () => ({
      ...generator(),
      ...overrides
    }));
  }

  /**
   * 生成分頁 Mock 資料
   */
  static generatePaginatedData<T>(
    generator: () => T,
    page = 1,
    pageSize = 10,
    total = 100
  ): { data: T[]; total: number; page: number; pageSize: number } {
    const data = this.generateList(generator, Math.min(pageSize, total - (page - 1) * pageSize));
    return {
      data,
      total,
      page,
      pageSize
    };
  }
}

/**
 * ng-zorro-antd 測試模組配置
 */
export class NzTestingModule {
  /**
   * 基礎 ng-zorro-antd 配置
   */
  static getNzConfig(): NzConfig {
    return {
      message: {
        nzDuration: 3000,
        nzMaxStack: 7,
        nzPauseOnHover: true,
        nzAnimate: true
      },
      notification: {
        nzDuration: 4500,
        nzMaxStack: 8,
        nzPauseOnHover: true,
        nzAnimate: true,
        nzPlacement: 'topRight'
      }
    };
  }

  /**
   * 提供 ng-zorro-antd 測試配置
   */
  static getNzProviders(): any[] {
    return [
      provideNzConfig(this.getNzConfig()),
      provideNzI18n(zh_TW),
      provideNzIcons([
        UserOutline,
        SettingOutline,
        PlusOutline,
        EditOutline,
        DeleteOutline,
        SearchOutline,
        EyeOutline,
        DownloadOutline,
        UploadOutline,
        ReloadOutline
      ])
    ];
  }

  /**
   * 建立 ng-zorro-antd 服務 Mock
   */
  static createNzServiceMocks(): {
    messageService: any;
    notificationService: any;
    modalService: any;
  } {
    const messageService = jasmine.createSpyObj('NzMessageService', ['success', 'error', 'info', 'warning', 'loading', 'remove']);

    const notificationService = jasmine.createSpyObj('NzNotificationService', ['success', 'error', 'info', 'warning', 'blank', 'remove']);

    const modalService = jasmine.createSpyObj('NzModalService', ['create', 'confirm', 'info', 'success', 'warning', 'error']);

    return {
      messageService,
      notificationService,
      modalService
    };
  }
}

/**
 * 標準化測試設定
 */
export class TestUtils {
  /**
   * 建立標準測試模組配置
   */
  static createTestingModule(config: TestConfig = {}): TestModuleMetadata {
    const {
      imports = [],
      declarations = [],
      providers = [],
      schemas = [],
      useAnimations = true,
      useRouter = true,
      useHttp = true,
      useForms = true,
      useNzConfig = true
    } = config;

    const baseImports = [];
    const baseProviders = [];

    // 基礎模組
    if (useAnimations) {
      baseImports.push(BrowserAnimationsModule);
    }

    if (useRouter) {
      baseImports.push(RouterTestingModule);
    }

    if (useHttp) {
      baseImports.push(HttpClientTestingModule);
    }

    if (useForms) {
      baseImports.push(FormsModule, ReactiveFormsModule);
    }

    // ng-zorro-antd 配置
    if (useNzConfig) {
      baseProviders.push(...NzTestingModule.getNzProviders());
    }

    return {
      imports: [...baseImports, ...imports],
      declarations: [...declarations],
      providers: [...baseProviders, ...providers],
      schemas: [...schemas]
    };
  }

  /**
   * 建立組件測試環境
   */
  static async createComponentFixture<T>(component: any, config: TestConfig = {}): Promise<ComponentFixture<T>> {
    await TestBed.configureTestingModule(
      this.createTestingModule({
        declarations: [component],
        ...config
      })
    ).compileComponents();

    return TestBed.createComponent<T>(component);
  }

  /**
   * 建立服務測試環境
   */
  static async createServiceTestBed<T>(service: any, config: TestConfig = {}): Promise<T> {
    await TestBed.configureTestingModule(
      this.createTestingModule({
        providers: [service, ...(config.providers || [])],
        ...config
      })
    ).compileComponents();

    return TestBed.inject<T>(service);
  }

  /**
   * 觸發變更檢測
   */
  static detectChanges(fixture: ComponentFixture<any>): void {
    fixture.detectChanges();
  }

  /**
   * 等待非同步操作完成
   */
  static async waitForAsync(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  /**
   * 模擬點擊事件
   */
  static click(element: HTMLElement): void {
    element.click();
  }

  /**
   * 模擬輸入事件
   */
  static input(element: HTMLInputElement, value: string): void {
    element.value = value;
    element.dispatchEvent(new Event('input'));
  }

  /**
   * 模擬鍵盤事件
   */
  static keydown(element: HTMLElement, key: string): void {
    element.dispatchEvent(new KeyboardEvent('keydown', { key }));
  }

  /**
   * 模擬滑鼠事件
   */
  static mouseEvent(element: HTMLElement, type: 'mouseenter' | 'mouseleave' | 'mouseover' | 'mouseout'): void {
    element.dispatchEvent(new MouseEvent(type));
  }

  /**
   * 檢查元素是否存在
   */
  static hasElement(fixture: ComponentFixture<any>, selector: string): boolean {
    return fixture.debugElement.query(By.css(selector)) !== null;
  }

  /**
   * 檢查元素文字內容
   */
  static getElementText(fixture: ComponentFixture<any>, selector: string): string {
    const element = fixture.debugElement.query(By.css(selector));
    return element ? element.nativeElement.textContent.trim() : '';
  }

  /**
   * 檢查元素屬性
   */
  static getElementAttribute(fixture: ComponentFixture<any>, selector: string, attribute: string): string {
    const element = fixture.debugElement.query(By.css(selector));
    return element ? element.nativeElement.getAttribute(attribute) : '';
  }

  /**
   * 檢查元素類別
   */
  static hasElementClass(fixture: ComponentFixture<any>, selector: string, className: string): boolean {
    const element = fixture.debugElement.query(By.css(selector));
    return element ? element.nativeElement.classList.contains(className) : false;
  }

  /**
   * 模擬 HTTP 請求
   */
  static mockHttpRequest(url: string, method: string, response: any, status = 200): void {
    // 這裡可以整合 HttpTestingController 的 Mock
    console.log(`Mock HTTP ${method} ${url}:`, response);
  }

  /**
   * 建立錯誤測試環境
   */
  static createErrorTestEnvironment(): void {
    // 設定錯誤處理測試環境
    spyOn(console, 'error').and.stub();
    spyOn(console, 'warn').and.stub();
  }

  /**
   * 清理測試環境
   */
  static cleanupTestEnvironment(): void {
    TestBed.resetTestingModule();
  }
}

/**
 * 測試資料常數
 */
export const TEST_DATA = {
  USERS: MockDataGenerator.generateList(MockDataGenerator.generateUser, 5),
  ACCOUNTS: MockDataGenerator.generateList(MockDataGenerator.generateAccount, 5),
  TRANSACTIONS: MockDataGenerator.generateList(MockDataGenerator.generateTransaction, 10),
  PAGINATED_USERS: MockDataGenerator.generatePaginatedData(MockDataGenerator.generateUser, 1, 10, 50),
  PAGINATED_ACCOUNTS: MockDataGenerator.generatePaginatedData(MockDataGenerator.generateAccount, 1, 10, 30),
  PAGINATED_TRANSACTIONS: MockDataGenerator.generatePaginatedData(MockDataGenerator.generateTransaction, 1, 20, 100)
};
