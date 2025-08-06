export interface Command<TResult> {
  readonly commandType: string;
}

export interface CommandHandler<TCommand extends Command<TResult>, TResult> {
  handle(command: TCommand): Promise<TResult>;
}

export interface CommandBus {
  execute<TResult>(command: Command<TResult>): Promise<TResult>;
  register<TCommand extends Command<TResult>, TResult>(
    commandType: string,
    handler: CommandHandler<TCommand, TResult>
  ): void;
}

export class InMemoryCommandBus implements CommandBus {
  private handlers: Map<string, CommandHandler<any, any>> = new Map();

  async execute<TResult>(command: Command<TResult>): Promise<TResult> {
    const handler = this.handlers.get(command.commandType);
    
    if (!handler) {
      throw new Error(`No handler registered for command type: ${command.commandType}`);
    }

    return await handler.handle(command);
  }

  register<TCommand extends Command<TResult>, TResult>(
    commandType: string,
    handler: CommandHandler<TCommand, TResult>
  ): void {
    this.handlers.set(commandType, handler);
  }
} 