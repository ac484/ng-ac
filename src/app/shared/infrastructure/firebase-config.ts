import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseConfig {
  static getFirebaseConfig() {
    return {
      apiKey: environment['firebase'].apiKey,
      authDomain: environment['firebase'].authDomain,
      projectId: environment['firebase'].projectId,
      storageBucket: environment['firebase'].storageBucket,
      messagingSenderId: environment['firebase'].messagingSenderId,
      appId: environment['firebase'].appId
    };
  }

  static getAngularFireModules() {
    return [
      AngularFireModule.initializeApp(this.getFirebaseConfig()),
      AngularFirestoreModule,
      AngularFireAuthModule,
      AngularFireStorageModule
    ];
  }
} 