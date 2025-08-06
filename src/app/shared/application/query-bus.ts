export interface Query<TResult> {
  readonly queryType: string;
}

export interface QueryHandler<TQuery extends Query<TResult>, TResult> {
  handle(query: TQuery): Promise<TResult>;
}

export interface QueryBus {
  execute<TResult>(query: Query<TResult>): Promise<TResult>;
  register<TQuery extends Query<TResult>, TResult>(
    queryType: string,
    handler: QueryHandler<TQuery, TResult>
  ): void;
}

export class InMemoryQueryBus implements QueryBus {
  private handlers: Map<string, QueryHandler<any, any>> = new Map();

  async execute<TResult>(query: Query<TResult>): Promise<TResult> {
    const handler = this.handlers.get(query.queryType);
    
    if (!handler) {
      throw new Error(`No handler registered for query type: ${query.queryType}`);
    }

    return await handler.handle(query);
  }

  register<TQuery extends Query<TResult>, TResult>(
    queryType: string,
    handler: QueryHandler<TQuery, TResult>
  ): void {
    this.handlers.set(queryType, handler);
  }
} 