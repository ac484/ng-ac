import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class QueryBus {
  abstract execute<TQuery, TResult>(query: TQuery): Promise<TResult>;
}
