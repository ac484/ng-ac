import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, UserCredential, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseRepository {
  constructor(private readonly auth: Auth) {}

  loginWithEmail(email: string, password: string):Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  registerWithEmail(email: string, password: string):Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }
}
