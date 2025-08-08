/**
 * 公司相關異常
 * 極簡設計，統一錯誤處理
 */

export class CompanyNotFoundException extends Error {
  constructor(companyId: string) {
    super(`Company with id ${companyId} not found`);
    this.name = 'CompanyNotFoundException';
  }
}

export class ContactNotFoundException extends Error {
  constructor(contactIndex: number) {
    super(`Contact at index ${contactIndex} not found`);
    this.name = 'ContactNotFoundException';
  }
}

export class InvalidContactIndexException extends Error {
  constructor(contactIndex: number) {
    super(`Invalid contact index: ${contactIndex}`);
    this.name = 'InvalidContactIndexException';
  }
}

/**
 * 公司驗證工具
 * 現代化設計，使用 TypeScript 類型守衛
 */
export class CompanyValidationHelper {
  /**
   * 驗證聯絡人索引
   */
  static validateContactIndex(contactIndex: number, contactsLength: number): void {
    if (contactIndex < 0 || contactIndex >= contactsLength) {
      throw new InvalidContactIndexException(contactIndex);
    }
  }

  /**
   * 類型守衛：檢查公司是否存在
   */
  static isCompanyExists(company: any): company is NonNullable<typeof company> {
    return company !== null && company !== undefined;
  }
}
