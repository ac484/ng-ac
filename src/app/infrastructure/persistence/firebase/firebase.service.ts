/**
 * @ai-context {
 *   "role": "Infrastructure/Repository",
 *   "purpose": "Firebase基礎服務-應用實例管理",
 *   "constraints": ["@angular/fire整合", "單例模式", "極簡主義"],
 *   "dependencies": ["@angular/fire/*"],
 *   "security": "medium",
 *   "lastmod": "2025-01-18"
 * }
 * @usage firebaseService.getAuth(), firebaseService.getFirestore()
 * @see docs/01-angular20-architecture.md
 */

import { Injectable } from '@angular/core';
import { Analytics } from '@angular/fire/analytics';
import { FirebaseApp } from '@angular/fire/app';
import { AppCheck } from '@angular/fire/app-check';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Functions } from '@angular/fire/functions';
import { Messaging } from '@angular/fire/messaging';
import { Performance } from '@angular/fire/performance';
import { RemoteConfig } from '@angular/fire/remote-config';
import { Storage } from '@angular/fire/storage';
import { VertexAI } from '@angular/fire/vertexai';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(
    private app: FirebaseApp,
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage,
    private functions: Functions,
    private messaging: Messaging,
    private performance: Performance,
    private remoteConfig: RemoteConfig,
    private analytics: Analytics,
    private appCheck: AppCheck,
    private vertexAI: VertexAI
  ) {}

  getApp(): FirebaseApp {
    return this.app;
  }

  getAuth(): Auth {
    return this.auth;
  }

  getFirestore(): Firestore {
    return this.firestore;
  }

  getStorage(): Storage {
    return this.storage;
  }

  getFunctions(): Functions {
    return this.functions;
  }

  getMessaging(): Messaging {
    return this.messaging;
  }

  getPerformance(): Performance {
    return this.performance;
  }

  getRemoteConfig(): RemoteConfig {
    return this.remoteConfig;
  }

  getAnalytics(): Analytics {
    return this.analytics;
  }

  getAppCheck(): AppCheck {
    return this.appCheck;
  }

  getVertexAI(): VertexAI {
    return this.vertexAI;
  }
}
