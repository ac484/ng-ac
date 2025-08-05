import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
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

  logout(): void {
    this.auth.signOut();
    this.tokenService.clear();
  }
} 