
export abstract class Specification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

class AndSpecification<T> extends Specification<T> {
  constructor(private readonly one: Specification<T>, private readonly other: Specification<T>) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.one.isSatisfiedBy(candidate) && this.other.isSatisfiedBy(candidate);
  }
}

class OrSpecification<T> extends Specification<T> {
  constructor(private readonly one: Specification<T>, private readonly other: Specification<T>) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.one.isSatisfiedBy(candidate) || this.other.isSatisfiedBy(candidate);
  }
}

class NotSpecification<T> extends Specification<T> {
  constructor(private readonly wrapped: Specification<T>) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return !this.wrapped.isSatisfiedBy(candidate);
  }
}
