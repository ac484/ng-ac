/**
 * @fileoverview Firebase 基礎服務 (Firebase Base Service)
 * @description 提供 Firebase 應用實例和基本功能
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Infrastructure Layer Firebase Service
 * - 職責：Firebase 應用管理、基礎服務提供
 * - 依賴：@angular/fire
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案提供 Firebase 基礎功能
 * - 使用極簡主義設計，避免過度複雜化
 * - 嚴格遵守 @angular/fire > firebase > firestore 交互順序
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

@Injectable({
  providedIn: 'root'
})
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

  /**
   * 獲取 Firebase 應用實例
   */
  getApp(): FirebaseApp {
    return this.app;
  }

  /**
   * 獲取 Firebase Auth 實例
   */
  getAuth(): Auth {
    return this.auth;
  }

  /**
   * 獲取 Firestore 實例
   */
  getFirestore(): Firestore {
    return this.firestore;
  }

  /**
   * 獲取 Storage 實例
   */
  getStorage(): Storage {
    return this.storage;
  }

  /**
   * 獲取 Functions 實例
   */
  getFunctions(): Functions {
    return this.functions;
  }

  /**
   * 獲取 Messaging 實例
   */
  getMessaging(): Messaging {
    return this.messaging;
  }

  /**
   * 獲取 Performance 實例
   */
  getPerformance(): Performance {
    return this.performance;
  }

  /**
   * 獲取 RemoteConfig 實例
   */
  getRemoteConfig(): RemoteConfig {
    return this.remoteConfig;
  }

  /**
   * 獲取 Analytics 實例
   */
  getAnalytics(): Analytics {
    return this.analytics;
  }

  /**
   * 獲取 AppCheck 實例
   */
  getAppCheck(): AppCheck {
    return this.appCheck;
  }

  /**
   * 獲取 VertexAI 實例
   */
  getVertexAI(): VertexAI {
    return this.vertexAI;
  }
}
