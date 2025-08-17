/**
 * @fileoverview 應用配置檔案 (Application Configuration)
 * @description 存放應用程式的所有配置，包括 Firebase 服務、路由、動畫等
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Infrastructure Layer Configuration
 * - 職責：應用配置管理、服務提供者配置、Firebase 整合
 * - 依賴：Angular Core, Angular Fire, 路由配置
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放配置，不包含業務邏輯
 * - Firebase 配置包含敏感信息，請妥善保管
 * - 所有服務提供者必須在此檔案中註冊
 */

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

// Firebase Analytics 服務 - 提供網站分析、螢幕追蹤和用戶追蹤功能
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
// Firebase 應用程式初始化 - 設定 Firebase 專案配置
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// Firebase App Check 服務 - 提供 reCAPTCHA 企業版驗證，防止濫用
import { initializeAppCheck, provideAppCheck, ReCaptchaEnterpriseProvider } from '@angular/fire/app-check';
// Firebase 身份驗證服務 - 處理用戶登入、註冊和身份管理
import { getAuth, provideAuth } from '@angular/fire/auth';
// Firebase Firestore 資料庫服務 - 提供 NoSQL 雲端資料庫功能
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
// Firebase Cloud Functions 服務 - 執行伺服器端程式碼
import { getFunctions, provideFunctions } from '@angular/fire/functions';
// Firebase Cloud Messaging 服務 - 處理推播通知
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
// Firebase Performance 服務 - 監控應用程式效能指標
import { getPerformance, providePerformance } from '@angular/fire/performance';
// Firebase Remote Config 服務 - 遠端配置管理，無需更新應用程式
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
// Firebase Storage 服務 - 雲端檔案儲存和管理
import { getStorage, provideStorage } from '@angular/fire/storage';
// Firebase VertexAI 服務 - 整合 Google AI 模型和機器學習功能
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        // 提供路由功能 - 處理應用程式內的頁面導航
        provideRouter(routes),
        // 提供動畫功能 - 支援 Angular 動畫系統
        provideAnimations(),
        // 提供 HTTP 客戶端 - 處理 API 請求和後端通訊
        provideHttpClient(withInterceptors([
            // add interceptors here when implemented
        ])),
        // 初始化 Firebase 應用程式 - 設定專案 ID、API 金鑰等配置
        provideFirebaseApp(() => initializeApp({
            projectId: "acc-ng",
            appId: "1:713375778540:web:ddf84d3016300c2abb87c9",
            storageBucket: "acc-ng.firebasestorage.app",
            apiKey: "AIzaSyD0mftbDKLDXTDttoXUQwnHNQUeJEwADQc",
            authDomain: "acc-ng.firebaseapp.com",
            messagingSenderId: "713375778540",
            measurementId: "G-FWEJ2HQYZD"
        })),
        // 提供 Firebase 身份驗證服務
        provideAuth(() => getAuth()),
        // 提供 Firebase Analytics 分析服務
        provideAnalytics(() => getAnalytics()),
        // 提供螢幕追蹤服務 - 追蹤用戶在不同頁面的瀏覽行為
        ScreenTrackingService,
        // 提供用戶追蹤服務 - 追蹤用戶在應用程式中的活動
        UserTrackingService,
        // 提供 Firebase App Check 服務 - 使用 reCAPTCHA 企業版防止濫用
        provideAppCheck(() => {
            const provider = new ReCaptchaEnterpriseProvider(environment.firebase.appCheck.recaptchaSiteKey);
            return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
        }),
        // 提供 Firebase Firestore 資料庫服務
        provideFirestore(() => getFirestore()),
        // 提供 Firebase Cloud Functions 服務
        provideFunctions(() => getFunctions()),
        // 提供 Firebase Cloud Messaging 推播通知服務
        provideMessaging(() => getMessaging()),
        // 提供 Firebase Performance 效能監控服務
        providePerformance(() => getPerformance()),
        // 提供 Firebase Storage 檔案儲存服務
        provideStorage(() => getStorage()),
        // 提供 Firebase Remote Config 遠端配置服務
        provideRemoteConfig(() => getRemoteConfig()),
        // 提供 Firebase VertexAI AI 服務
        provideVertexAI(() => getVertexAI())
    ]
};
