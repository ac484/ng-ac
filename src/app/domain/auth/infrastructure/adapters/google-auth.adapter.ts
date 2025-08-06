import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthAdapter {
  constructor() {}

  get provider(): GoogleAuthProvider {
    return new GoogleAuthProvider();
  }
}
