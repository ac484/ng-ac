/**
 * @fileoverview Firebase 配置檔案 (Firebase Configuration)
 * @description 存放 Firebase 服務的配置信息
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Infrastructure Layer Configuration
 * - 職責：Firebase 配置管理
 * - 依賴：無
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放配置，不包含業務邏輯
 * - Firebase 配置包含敏感信息，請妥善保管
 */

export const firebaseConfig = {
  projectId: "acc-ng",
  appId: "1:713375778540:web:ddf84d3016300c2abb87c9",
  storageBucket: "acc-ng.firebasestorage.app",
  apiKey: "AIzaSyD0mftbDKLDXTDttoXUQwnHNQUeJEwADQc",
  authDomain: "acc-ng.firebaseapp.com",
  messagingSenderId: "713375778540",
  measurementId: "G-FWEJ2HQYZD"
};

export const reCaptchaSiteKey = '6LcHy58rAAAAAPe_YYY3st4NwUlTJ1xcj4SWDrH5';
