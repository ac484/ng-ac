#!/usr/bin/env node

/**
 * Git Pre-push Hook
 * 默認為安全 no-op；如需在推送前強制執行更多檢查，可在此擴展。
 * 與 pre-commit.mjs 配合使用，後者會生成整合格式的文件結構。
 */

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function prePush() {
  try {
    console.log('🔗 pre-push: OK');
    process.exit(0);
  } catch (error) {
    console.error('❌ pre-push failed:', error?.message || error);
    // Do not block push by default to avoid local friction.
    process.exit(0);
  }
}

prePush();


