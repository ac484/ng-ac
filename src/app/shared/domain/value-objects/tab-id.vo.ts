import { ValueObject } from './base.vo';

export interface TabIdProps {
  value: string;
}

export class TabId extends ValueObject<TabIdProps> {
  private constructor(props: TabIdProps) {
    super(props);
  }

  static create(value: string): TabId {
    if (!value || value.trim().length === 0) {
      throw new Error('Tab ID cannot be empty');
    }
    return new TabId({ value: value.trim() });
  }

  static generate(): TabId {
    return new TabId({ value: `tab_${Date.now()}_${Math.random().toString(36).substring(2, 11)}` });
  }

  get value(): string {
    return this.props.value;
  }

  override equals(vo?: TabId): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (this === vo) {
      return true;
    }
    return this.props.value === vo.props.value;
  }

  override toString(): string {
    return this.props.value;
  }
}
