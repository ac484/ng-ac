export abstract class DomainEvent {
    public readonly occurredOn: Date;
    public readonly eventId: string;

    constructor() {
        this.occurredOn = new Date();
        this.eventId = this.generateEventId();
    }

    private generateEventId(): string {
        return `${this.constructor.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    abstract getEventName(): string;
}
