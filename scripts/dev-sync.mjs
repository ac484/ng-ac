#!/usr/bin/env node

/**
 * 開發時自動同步腳本
 * 在開發過程中實時監控文件變化並自動更新文件樹
 */

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startDevSync() {
  console.log('🚀 啟動開發時文件同步...');
  console.log('📁 監控目錄: src/');
  console.log('📝 自動更新: docs/0.FILE_STRUCTURE_NOW.md');
  console.log('');

  try {
    // 啟動文件監控
    const watcher = spawn('node', [
      join(__dirname, 'generate-file-structure.mjs'),
      '--watch'
    ], {
      stdio: 'inherit',
      cwd: join(__dirname, '..')
    });

    // 啟動 Angular 開發服務器
    const devServer = spawn('pnpm', ['start'], {
      stdio: 'inherit',
      cwd: join(__dirname, '..')
    });

    // 處理進程退出
    process.on('SIGINT', () => {
      console.log('\n🛑 正在停止開發服務...');
      watcher.kill('SIGINT');
      devServer.kill('SIGINT');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 正在停止開發服務...');
      watcher.kill('SIGTERM');
      devServer.kill('SIGTERM');
      process.exit(0);
    });

    // 監聽進程退出
    watcher.on('exit', (code) => {
      console.log(`📁 文件監控進程退出，代碼: ${code}`);
      if (code !== 0) {
        devServer.kill('SIGINT');
        process.exit(code);
      }
    });

    devServer.on('exit', (code) => {
      console.log(`🌐 開發服務器進程退出，代碼: ${code}`);
      if (code !== 0) {
        watcher.kill('SIGINT');
        process.exit(code);
      }
    });

  } catch (error) {
    console.error('❌ 啟動開發同步失敗:', error);
    process.exit(1);
  }
}

// 如果直接運行此腳本
if (import.meta.url === `file://${process.argv[1]}`) {
  startDevSync();
}

export { startDevSync };

