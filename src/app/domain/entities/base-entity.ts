/**
 * Base entity class for all domain entities
 * Provides common functionality like ID management and equality comparison
 */
export abstract class BaseEntity<TProps> {
  protected readonly props: TProps;

  constructor(props: TProps) {
    this.props = props;
  }

  /**
   * Compare this entity with another entity for equality
   * Entities are considered equal if they have the same ID
   */
  equals(other: BaseEntity<TProps>): boolean {
    return this.props === other.props;
  }

  /**
   * Get the entity props
   */
  getProps(): TProps {
    return this.props;
  }
} 