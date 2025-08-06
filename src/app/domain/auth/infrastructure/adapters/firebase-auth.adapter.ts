import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthAdapter {
  constructor(private readonly auth: Auth) {}

  // Adapter methods to wrap firebase auth functions
}
