import { ValueObject } from '../../../../shared/domain/value-object';
import { v4 as uuidv4 } from 'uuid';

export class UserId extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  public static create(id?: string): UserId {
    return new UserId({ value: id || uuidv4() });
  }

  get value(): string {
    return this.props.value;
  }
}
