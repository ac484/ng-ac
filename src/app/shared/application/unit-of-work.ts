import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class UnitOfWork {
  abstract execute<T>(work: () => Promise<T>): Promise<T>;
}
