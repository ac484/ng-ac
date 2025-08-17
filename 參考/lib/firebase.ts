// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0mftbDKLDXTDttoXUQwnHNQUeJEwADQc",
  authDomain: "acc-ng.firebaseapp.com",
  projectId: "acc-ng",
  storageBucket: "acc-ng.firebasestorage.app",
  messagingSenderId: "713375778540",
  appId: "1:713375778540:web:9bd4d807b2035ee2bb87c9",
  measurementId: "G-B5TBVN0H3L"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize App Check with reCAPTCHA v3 ONLY on client side
let appCheck: any = null;

if (typeof window !== 'undefined') {
  // Only initialize App Check in browser environment
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY!),
      isTokenAutoRefreshEnabled: true
    });
  } catch (error) {
    console.warn('Failed to initialize App Check:', error);
  }
}

// 连接到模拟器（仅在开发环境）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  try {
    // 连接到Firestore模拟器
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    // Connected to Firestore Emulator

    // 连接到Auth模拟器
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    // Connected to Auth Emulator

    // 连接到Storage模拟器
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    // Connected to Storage Simulator
  } catch (error) {
    // Failed to connect to emulators
  }
}

export { app, appCheck, auth, db, storage };

