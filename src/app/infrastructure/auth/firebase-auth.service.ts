import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, UserCredential, GoogleAuthProvider, signInWithPopup, signInAnonymously, getRedirectResult, signInWithRedirect, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { DA_SERVICE_TOKEN, ITokenService, ITokenModel } from '@delon/auth';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LoginRequest } from '../../application/auth/auth.models';

export interface CreateUserRequest {
  email: string;
  password: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private readonly auth: Auth = inject(Auth);
  private readonly tokenService: ITokenService = inject(DA_SERVICE_TOKEN);

  login(credentials: LoginRequest): Observable<ITokenModel> {
    return from(signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)).pipe(
      switchMap((userCredential: UserCredential) => from(userCredential.user.getIdToken())),
      map(token => {
        const tokenModel: ITokenModel = { token, uid: this.auth.currentUser?.uid };
        this.tokenService.set(tokenModel);
        return tokenModel;
      })
    );
  }

  createUserWithEmail(request: CreateUserRequest): Observable<ITokenModel> {
    return from(createUserWithEmailAndPassword(this.auth, request.email, request.password)).pipe(
      switchMap(async (userCredential: UserCredential) => {
        if (request.displayName) {
          await updateProfile(userCredential.user, { displayName: request.displayName });
        }
        return userCredential.user.getIdToken();
      }),
      map(token => {
        const tokenModel: ITokenModel = { token, uid: this.auth.currentUser?.uid };
        this.tokenService.set(tokenModel);
        return tokenModel;
      })
    );
  }

  loginWithGoogle(): Observable<ITokenModel> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
      switchMap((userCredential: UserCredential) => from(userCredential.user.getIdToken())),
      map(token => {
        const tokenModel: ITokenModel = { token, uid: this.auth.currentUser?.uid };
        this.tokenService.set(tokenModel);
        return tokenModel;
      })
    );
  }

  loginWithGoogleRedirect(): void {
    signInWithRedirect(this.auth, new GoogleAuthProvider());
  }

  getRedirectResult(): Promise<UserCredential | null> {
    return getRedirectResult(this.auth);
  }

  loginAnonymously(): Observable<ITokenModel> {
    return from(signInAnonymously(this.auth)).pipe(
      switchMap((userCredential: UserCredential) => from(userCredential.user.getIdToken())),
      map(token => {
        const tokenModel: ITokenModel = { token, uid: this.auth.currentUser?.uid };
        this.tokenService.set(tokenModel);
        return tokenModel;
      })
    );
  }

  logout(): void {
    this.auth.signOut();
    this.tokenService.clear();
  }
} 