/**
 * 使用者角色值物件
 */
export class Role {
  private readonly value: string;

  constructor(role: string) {
    const trimmed = role.trim();
    if (trimmed.length === 0) {
      throw new Error('Role cannot be empty');
    }
    this.value = trimmed;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Role): boolean {
    return this.value === other.value;
  }

  static ADMIN(): Role {
    return new Role('Admin');
  }

  static EDITOR(): Role {
    return new Role('Editor');
  }

  static USER(): Role {
    return new Role('User');
  }
} 