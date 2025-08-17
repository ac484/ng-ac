#!/usr/bin/env node

/**
 * 文件結構自動生成腳本
 * 監控 src 目錄變化並自動更新 0.FILE_STRUCTURE_NOW.md
 */

import { promises as fs } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 配置
const CONFIG = {
  // 項目根目錄
  PROJECT_ROOT: join(__dirname, '..'),

  // 源代碼目錄
  SOURCE_DIR: 'src',

  // 輸出文檔路徑
  OUTPUT_FILE: 'docs/0.FILE_STRUCTURE_NOW.md',

  // 忽略的文件和目錄
  IGNORE_PATTERNS: [
    'node_modules',
    'dist',
    '.git',
    '.angular',
    '.vscode',
    '.husky',
    '.devcontainer',
    '*.log',
    '*.tmp',
    '*.cache',
    '*.spec.ts',
    '*.test.ts',
    '*.d.ts',
    '*.map',
    '*.min.js',
    '*.min.css'
  ],

  // 文件類型圖標映射
  FILE_ICONS: {
    '.ts': '📄',
    '.tsx': '📄',
    '.js': '📄',
    '.jsx': '📄',
    '.html': '🌐',
    '.scss': '🎨',
    '.css': '🎨',
    '.json': '⚙️',
    '.md': '📝',
    '.png': '🖼️',
    '.jpg': '🖼️',
    '.svg': '🖼️',
    '.ico': '🖼️',
    '.webmanifest': '📱',
    '.xml': '📋',
    '.yml': '⚙️',
    '.yaml': '⚙️',
    '.env': '🔐',
    '.gitignore': '🚫',
    '.editorconfig': '⚙️',
    '.prettierrc': '🎨',
    '.eslintrc': '🔍',
    '': '📁' // 目錄
  },

  // 特殊文件處理
  SPECIAL_FILES: {
    'index.ts': '📋',
    'index.html': '🏠',
    'main.ts': '🚀',
    'app.component.ts': '⚙️',
    'app.config.ts': '⚙️',
    'app.routes.ts': '🛣️',
    'package.json': '📦',
    'angular.json': '⚙️',
    'tsconfig.json': '⚙️',
    'README.md': '📖'
  }
};

/**
 * 檢查路徑是否應該被忽略
 */
function shouldIgnore(path) {
  const relativePath = relative(CONFIG.SOURCE_DIR, path);

  return CONFIG.IGNORE_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      // 處理通配符模式
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(relativePath);
    }
    return relativePath.includes(pattern);
  });
}

/**
 * 獲取文件圖標
 */
function getFileIcon(filename, isDirectory = false) {
  if (isDirectory) {
    return '📁';
  }

  // 檢查特殊文件
  if (CONFIG.SPECIAL_FILES[filename]) {
    return CONFIG.SPECIAL_FILES[filename];
  }

  // 檢查文件擴展名
  const ext = filename.includes('.') ? filename.substring(filename.lastIndexOf('.')) : '';
  return CONFIG.FILE_ICONS[ext] || CONFIG.FILE_ICONS[''];
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 生成目錄樹
 */
async function generateDirectoryTree(dirPath, level = 0, maxLevel = 10) {
  if (level > maxLevel) {
    return '  '.repeat(level) + '📁 ... (max depth reached)\n';
  }

  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    // 過濾和排序項目
    const filteredItems = items
      .filter(item => !shouldIgnore(join(dirPath, item.name)))
      .sort((a, b) => {
        // 目錄在前，文件在後
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        // 按名稱排序
        return a.name.localeCompare(b.name);
      });

    let tree = '';

    for (let i = 0; i < filteredItems.length; i++) {
      const item = filteredItems[i];
      const itemPath = join(dirPath, item.name);
      const isLast = i === filteredItems.length - 1;

      // 生成連接線
      const connector = isLast ? '└─' : '├─';
      const indent = '  '.repeat(level);

      if (item.isDirectory()) {
        // 目錄
        const icon = getFileIcon(item.name, true);
        tree += `${indent}${connector}${icon} ${item.name}/\n`;

        // 遞歸處理子目錄
        const subTree = await generateDirectoryTree(itemPath, level + 1, maxLevel);
        tree += subTree;
      } else {
        // 文件
        const icon = getFileIcon(item.name);
        const stats = await fs.stat(itemPath);
        const size = formatFileSize(stats.size);
        const modified = stats.mtime.toLocaleDateString();

        tree += `${indent}${connector}${icon} ${item.name} (${size}, ${modified})\n`;
      }
    }

    return tree;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return '  '.repeat(level) + '❌ Error reading directory\n';
  }
}

/**
 * 生成統計信息
 */
async function generateStatistics() {
  let totalFiles = 0;
  let totalDirs = 0;
  let totalSize = 0;
  const fileTypes = new Map();

  async function countItems(dirPath) {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });

      for (const item of items) {
        const itemPath = join(dirPath, item.name);

        if (shouldIgnore(itemPath)) continue;

        if (item.isDirectory()) {
          totalDirs++;
          await countItems(itemPath);
        } else {
          totalFiles++;
          const stats = await fs.stat(itemPath);
          totalSize += stats.size;

          const ext = item.name.includes('.') ? item.name.substring(item.name.lastIndexOf('.')) : '';
          fileTypes.set(ext, (fileTypes.get(ext) || 0) + 1);
        }
      }
    } catch (error) {
      console.error(`Error counting items in ${dirPath}:`, error);
    }
  }

  await countItems(join(CONFIG.PROJECT_ROOT, CONFIG.SOURCE_DIR));

  return {
    totalFiles,
    totalDirs,
    totalSize: formatFileSize(totalSize),
    fileTypes: Array.from(fileTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([ext, count]) => ({ ext: ext || 'no-extension', count }))
  };
}

/**
 * 生成完整的文件結構文檔
 */
async function generateFileStructureDocument() {
  try {
    console.log('🔄 開始生成文件結構文檔...');

    const sourcePath = join(CONFIG.PROJECT_ROOT, CONFIG.SOURCE_DIR);
    const outputPath = join(CONFIG.PROJECT_ROOT, CONFIG.OUTPUT_FILE);

    // 檢查源目錄是否存在
    if (!(await fs.stat(sourcePath)).isDirectory()) {
      throw new Error(`Source directory ${CONFIG.SOURCE_DIR} does not exist`);
    }

    // 生成目錄樹
    console.log('📁 生成目錄樹...');
    const directoryTree = await generateDirectoryTree(sourcePath);

    // 生成統計信息
    console.log('📊 生成統計信息...');
    const stats = await generateStatistics();

    // 生成文檔內容
    const timestamp = new Date().toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const document = `# 📁 項目文件結構

> **自動生成時間**: ${timestamp}
> **最後更新**: ${timestamp}
> **生成腳本**: \`scripts/generate-file-structure.mjs\`

## 📊 統計信息

- **總文件數**: ${stats.totalFiles}
- **總目錄數**: ${stats.totalDirs}
- **總大小**: ${stats.totalSize}

### 📈 文件類型分布

${stats.fileTypes.map(({ ext, count }) => `- **${ext}**: ${count} 個文件`).join('\n')}

## 🌳 目錄結構

\`\`\`
${CONFIG.SOURCE_DIR}/
${directoryTree}
\`\`\`

## 🔧 配置說明

### 忽略的文件和目錄
以下類型的文件和目錄不會出現在文件樹中：
${CONFIG.IGNORE_PATTERNS.map(pattern => `- \`${pattern}\``).join('\n')}

### 文件圖標說明
${Object.entries(CONFIG.FILE_ICONS).map(([ext, icon]) => `- ${icon} \`${ext}\`: ${ext === '' ? '目錄' : ext === '.ts' ? 'TypeScript 文件' : ext === '.scss' ? 'SCSS 樣式文件' : ext === '.html' ? 'HTML 模板文件' : ext === '.json' ? '配置文件' : ext === '.md' ? 'Markdown 文檔' : '其他文件'}`).join('\n')}

## 🚀 使用方法

### 手動生成
\`\`\`bash
pnpm run generate:fs
\`\`\`

### 自動監控
文件結構會在以下情況下自動更新：
- 開發時文件變化
- Git 提交前
- 手動觸發更新

### 開發時實時更新
在開發過程中，文件結構會自動監控並實時更新，無需手動操作。

---

> 💡 **提示**: 此文檔由腳本自動生成，請勿手動編輯。如需修改文件結構，請編輯源代碼文件，文檔會自動更新。
`;

    // 寫入文件
    await fs.writeFile(outputPath, document, 'utf8');

    console.log(`✅ 文件結構文檔已生成: ${outputPath}`);
    console.log(`📊 統計信息: ${stats.totalFiles} 個文件, ${stats.totalDirs} 個目錄`);

    return {
      success: true,
      outputPath,
      stats
    };

  } catch (error) {
    console.error('❌ 生成文件結構文檔失敗:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 監控模式
 */
async function watchMode() {
  console.log('👀 啟動文件監控模式...');
  console.log('按 Ctrl+C 停止監控');

  const chokidar = await import('chokidar');

  const watcher = chokidar.watch(join(CONFIG.PROJECT_ROOT, CONFIG.SOURCE_DIR), {
    ignored: CONFIG.IGNORE_PATTERNS.map(pattern =>
      pattern.includes('*') ? pattern : `**/${pattern}/**`
    ),
    persistent: true,
    ignoreInitial: false
  });

  let updateTimeout;

  watcher
    .on('ready', () => {
      console.log('✅ 文件監控已啟動');
      console.log(`📁 監控目錄: ${CONFIG.SOURCE_DIR}`);
    })
    .on('add', (path) => {
      console.log(`➕ 新增文件: ${relative(CONFIG.PROJECT_ROOT, path)}`);
      scheduleUpdate();
    })
    .on('change', (path) => {
      console.log(`✏️  修改文件: ${relative(CONFIG.PROJECT_ROOT, path)}`);
      scheduleUpdate();
    })
    .on('unlink', (path) => {
      console.log(`🗑️  刪除文件: ${relative(CONFIG.PROJECT_ROOT, path)}`);
      scheduleUpdate();
    })
    .on('addDir', (path) => {
      console.log(`📁 新增目錄: ${relative(CONFIG.PROJECT_ROOT, path)}`);
      scheduleUpdate();
    })
    .on('unlinkDir', (path) => {
      console.log(`🗑️  刪除目錄: ${relative(CONFIG.PROJECT_ROOT, path)}`);
      scheduleUpdate();
    })
    .on('error', (error) => {
      console.error('❌ 監控錯誤:', error);
    });

  function scheduleUpdate() {
    // 防抖更新，避免頻繁更新
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    updateTimeout = setTimeout(async () => {
      console.log('🔄 檢測到文件變化，正在更新文檔...');
      await generateFileStructureDocument();
    }, 1000);
  }

  // 優雅關閉
  process.on('SIGINT', () => {
    console.log('\n🛑 正在停止文件監控...');
    watcher.close();
    process.exit(0);
  });
}

/**
 * 主函數
 */
async function main() {
  const args = process.argv.slice(2);

  try {
    if (args.includes('--watch') || args.includes('-w')) {
      // 監控模式
      await watchMode();
    } else {
      // 單次生成模式
      const result = await generateFileStructureDocument();

      if (result.success) {
        console.log('🎉 文件結構文檔生成完成！');
        process.exit(0);
      } else {
        console.error('💥 文件結構文檔生成失敗！');
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('💥 程序執行失敗:', error);
    process.exit(1);
  }
}

// 如果直接運行此腳本
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('generate-file-structure.mjs')) {
  main();
}

export { generateFileStructureDocument, watchMode };
