export interface DomainEvent {
  dateTimeOccurred: Date;
  getAggregateId(): any;
}
