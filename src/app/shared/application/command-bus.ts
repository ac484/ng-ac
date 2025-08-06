import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class CommandBus {
  abstract execute<TCommand, TResult>(command: TCommand): Promise<TResult>;
}
