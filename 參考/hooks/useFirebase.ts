'use client';

import { app, auth, db, storage } from '@/lib/firebase';
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { useEffect, useState } from 'react';

export function useFirebase() {
  const [appCheck, setAppCheck] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize App Check only on client side
    if (typeof window !== 'undefined' && !appCheck) {
      try {
        const appCheckInstance = initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY!),
          isTokenAutoRefreshEnabled: true
        });
        setAppCheck(appCheckInstance);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize App Check:', error);
        setIsInitialized(true);
      }
    }
  }, [appCheck]);

  return {
    app,
    appCheck,
    auth,
    db,
    storage,
    isInitialized
  };
}



