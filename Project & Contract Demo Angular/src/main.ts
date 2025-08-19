/**
 * @ai-context {
 *   "role": "Infrastructure/Bootstrap",
 *   "purpose": "應用程式啟動入口-Angular 20 現代化啟動",
 *   "constraints": ["Standalone組件", "現代化提供者", "性能優化"],
 *   "dependencies": ["AppComponent", "provideRouter", "provideAnimations"],
 *   "security": "medium",
 *   "lastmod": "2025-08-19"
 * }
 * @usage bootstrapApplication(AppComponent, appConfig)
 * @see docs/architecture/bootstrap.md
 */
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ]
}).catch(err => console.error(err));
