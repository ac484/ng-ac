#!/usr/bin/env node

/**
 * Git Pre-commit Hook
 * 在提交前自動更新文件結構文檔
 */

import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function preCommit() {
  try {
    console.log('🔍 檢查文件變化...');

    // 檢查是否有 src 目錄下的文件變化
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    const hasSrcChanges = gitStatus
      .split('\n')
      .filter(line => line.trim())
      .some(line => line.includes('src/'));

    if (hasSrcChanges) {
      console.log('📁 檢測到 src 目錄變化，正在更新文件結構文檔...');

      // 更新文件結構文檔
      execSync('pnpm run generate:fs', {
        stdio: 'inherit',
        cwd: join(__dirname, '../..')
      });

      // 檢查是否有新的變化需要提交
      const newStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      const hasNewChanges = newStatus
        .split('\n')
        .filter(line => line.trim())
        .some(line => line.includes('0.FILE_STRUCTURE_NOW.md'));

      if (hasNewChanges) {
        console.log('📝 文件結構文檔已更新，正在添加到提交...');

        // 添加更新後的文件結構文檔
        execSync('git add docs/0.FILE_STRUCTURE_NOW.md', {
          stdio: 'inherit',
          cwd: join(__dirname, '../..')
        });

        console.log('✅ 文件結構文檔已添加到提交');
      } else {
        console.log('ℹ️  文件結構文檔無需更新');
      }
    } else {
      console.log('ℹ️  無 src 目錄變化，跳過文件結構更新');
    }

    console.log('✅ Pre-commit hook 執行完成');

  } catch (error) {
    console.error('❌ Pre-commit hook 執行失敗:', error.message);
    console.error('💡 請檢查文件結構生成腳本是否正常工作');
    process.exit(1);
  }
}

// 執行 pre-commit hook
preCommit();
