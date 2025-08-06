import { inject, Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  UserCredential, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously,
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithRedirect,
  updateProfile
} from '@angular/fire/auth';
import { DA_SERVICE_TOKEN, ITokenService, ITokenModel } from '@delon/auth';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LoginRequest } from '../../application/auth/auth.models';

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

  createUserWithEmail(credentials: { email: string; password: string; displayName?: string }): Observable<ITokenModel> {
    return from(createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password)).pipe(
      switchMap((userCredential: UserCredential) => {
        // Update display name if provided
        if (credentials.displayName) {
          return from(updateProfile(userCredential.user, { displayName: credentials.displayName })).pipe(
            switchMap(() => from(userCredential.user.getIdToken()))
          );
        }
        return from(userCredential.user.getIdToken());
      }),
      map(token => {
        const tokenModel: ITokenModel = { token, uid: this.auth.currentUser?.uid };
        this.tokenService.set(tokenModel);
        return tokenModel;
      })
    );
  }

  getRedirectResult(): Promise<UserCredential | null> {
    return getRedirectResult(this.auth);
  }

  signInWithRedirect(provider: GoogleAuthProvider): Promise<void> {
    return signInWithRedirect(this.auth, provider);
  }

  logout(): void {
    this.auth.signOut();
    this.tokenService.clear();
  }
} 