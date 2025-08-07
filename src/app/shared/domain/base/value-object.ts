export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (this === vo) {
      return true;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
