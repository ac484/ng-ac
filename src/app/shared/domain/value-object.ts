export abstract class ValueObject<T> {
  protected constructor(protected readonly props: T) {
    this.validate(props);
  }

  protected abstract validate(props: T): void;

  equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (this === other) {
      return true;
    }
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }

  getValue(): T {
    return { ...this.props };
  }
} 