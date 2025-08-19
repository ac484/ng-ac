#!/usr/bin/env node

/**
 * Git Pre-commit Hook
 * 在提交前，將 `src` 目錄的完整文件結構寫入項目根目錄 `docs/00_file_structure_now.json`，並自動加入本次提交。
 */

import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = join(__dirname, '../..');
const ROOT_SCAN_DIR = PROJECT_ROOT;
const OUTPUT_JSON = join(PROJECT_ROOT, 'docs/00_file_structure_now.json');

// Exclude these directories anywhere in the tree
const EXCLUDED_DIR_NAMES = new Set(['.angular', 'dist', '.git', 'node_modules']);

async function readDirectoryTree(directoryPath, basePath) {
  const dirents = await fs.readdir(directoryPath, { withFileTypes: true });
  const sorted = dirents.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  const entries = [];
  for (const dirent of sorted) {
    // Skip excluded directories
    if (dirent.isDirectory() && EXCLUDED_DIR_NAMES.has(dirent.name)) {
      continue;
    }
    const absolutePath = join(directoryPath, dirent.name);
    const relativePath = absolutePath.replace(basePath, '').replace(/\\/g, '/').replace(/^\/+/, '');

    if (dirent.isDirectory()) {
      entries.push({
        name: dirent.name,
        type: 'directory',
        path: relativePath,
        children: await readDirectoryTree(absolutePath, basePath)
      });
    } else {
      const stats = await fs.stat(absolutePath);
      entries.push({
        name: dirent.name,
        type: 'file',
        path: relativePath,
        size: stats.size,
        modified: stats.mtime.toISOString()
      });
    }
  }
  return entries;
}

async function generateFullStructureJson() {
  const generatedAt = new Date().toISOString();

  if (!(await fs.stat(ROOT_SCAN_DIR)).isDirectory()) {
    throw new Error('project root directory does not exist');
  }

  const structure = await readDirectoryTree(ROOT_SCAN_DIR, ROOT_SCAN_DIR);
  const document = {
    metadata: {
      generatedAt,
      source: 'project-root',
      root: 'docs/00_file_structure_now.json',
      description: 'Complete file structure of project root (excluding .angular, dist, .git, node_modules)'
    },
    structure
  };

  await fs.writeFile(OUTPUT_JSON, JSON.stringify(document, null, 2), 'utf8');
}

async function preCommit() {
  try {
    console.log('🗂️  生成專案根目錄完整文件結構（排除 .angular、dist、.git、node_modules）到 docs/00_file_structure_now.json ...');
    await generateFullStructureJson();
    execSync('git add docs/00_file_structure_now.json', { stdio: 'inherit', cwd: PROJECT_ROOT });
    console.log('✅ 文件已生成並加入到此次提交');
    process.exit(0);
  } catch (error) {
    console.error('❌ 生成文件結構失敗:', error?.message || error);
    process.exit(1);
  }
}

preCommit();
