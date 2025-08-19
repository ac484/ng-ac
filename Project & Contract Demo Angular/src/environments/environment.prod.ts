/**
 * @ai-context {
 *   "role": "Infrastructure/Config",
 *   "purpose": "生產環境配置-Firebase和應用設定",
 *   "constraints": ["環境隔離", "配置安全", "性能優化"],
 *   "dependencies": [],
 *   "security": "critical",
 *   "lastmod": "2025-08-19"
 * }
 * @usage import { environment } from './environments/environment'
 * @see docs/architecture/environment.md
 */
export const environment = {
  production: true,
  firebase: {
            projectId: "acc-ng",
            appId: "1:713375778540:web:ddf84d3016300c2abb87c9",
            storageBucket: "acc-ng.firebasestorage.app",
            apiKey: "AIzaSyD0mftbDKLDXTDttoXUQwnHNQUeJEwADQc",
            authDomain: "acc-ng.firebaseapp.com",
            messagingSenderId: "713375778540",
            measurementId: "G-FWEJ2HQYZD"

  }
};
