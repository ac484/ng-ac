/**
 * 權限字串值物件
 */
export class Permission {
  private readonly value: string;

  constructor(permission: string) {
    const trimmed = permission.trim();
    if (trimmed.length === 0) {
      throw new Error('Permission cannot be empty');
    }
    this.value = trimmed;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Permission): boolean {
    return this.value === other.value;
  }

  static CONTRACT_EDIT(): Permission {
    return new Permission('contract.edit');
  }

  static USER_READ(): Permission {
    return new Permission('user.read');
  }

  static USER_WRITE(): Permission {
    return new Permission('user.write');
  }
} 