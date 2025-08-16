/**
 * @fileoverview 資源統一導出檔案 (Assets Unified Export)
 * @description 存放所有資源的統一導出檔案
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Shared Layer Assets
 * - 職責：所有資源統一導出
 * - 依賴：images, icons, fonts, data 模組
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案是資源系統的統一入口點
 * - 所有資源必須在此檔案中導出
 * - 資源應按類型分類組織
 * - 支持資源的懶加載和預加載
 */

// ============================================================================
// 資源模組導入 (Assets Module Imports)
// ============================================================================

// 圖片資源導出
export * from './images';

// 圖標資源導出
export * from './icons';

// 字體資源導出
export * from './fonts';

// 數據資源導出
export * from './data';

// ============================================================================
// 資源配置 (Assets Configuration)
// ============================================================================

// 資源基礎路徑配置
export const ASSETS_CONFIG = {
  // 基礎路徑
  basePath: '/assets',

  // 資源類型路徑
  paths: {
    images: '/images',
    icons: '/icons',
    fonts: '/fonts',
    data: '/data',
  },

  // 資源預加載配置
  preload: {
    images: false,
    icons: true,
    fonts: true,
    data: false,
  },

  // 資源緩存配置
  cache: {
    images: 'cache-first',
    icons: 'cache-first',
    fonts: 'cache-first',
    data: 'network-first',
  },
};

// ============================================================================
// 資源加載器 (Assets Loaders)
// ============================================================================

// 圖片加載器
export const ImageLoader = {
  // 加載圖片
  load: (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  // 預加載圖片
  preload: (srcs: string[]): Promise<HTMLImageElement[]> => {
    return Promise.all(srcs.map(src => ImageLoader.load(src)));
  },
};

// 字體加載器
export const FontLoader = {
  // 加載字體
  load: (family: string, src: string): Promise<FontFace> => {
    const font = new FontFace(family, `url(${src})`);
    return font.load().then(() => {
      document.fonts.add(font);
      return font;
    });
  },

  // 預加載字體
  preload: (fonts: Array<{ family: string; src: string }>): Promise<FontFace[]> => {
    return Promise.all(fonts.map(font => FontLoader.load(font.family, font.src)));
  },
};

// 數據加載器
export const DataLoader = {
  // 加載 JSON 數據
  loadJSON: async (src: string): Promise<any> => {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.statusText}`);
    }
    return response.json();
  },

  // 加載 CSV 數據
  loadCSV: async (src: string): Promise<string[][]> => {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.statusText}`);
    }
    const text = await response.text();
    return text.split('\n').map(row => row.split(','));
  },
};

// ============================================================================
// 資源工具函數 (Assets Utility Functions)
// ============================================================================

// 獲取資源完整路徑
export const getAssetPath = (type: keyof typeof ASSETS_CONFIG.paths, filename: string): string => {
  return `${ASSETS_CONFIG.basePath}${ASSETS_CONFIG.paths[type]}/${filename}`;
};

// 檢查資源是否存在
export const checkAssetExists = async (path: string): Promise<boolean> => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// 資源預加載
export const preloadAssets = async (assets: {
  images?: string[];
  icons?: string[];
  fonts?: Array<{ family: string; src: string }>;
  data?: string[];
}): Promise<void> => {
  const promises: Promise<any>[] = [];

  if (assets.images && ASSETS_CONFIG.preload.images) {
    promises.push(ImageLoader.preload(assets.images));
  }

  if (assets.fonts && ASSETS_CONFIG.preload.fonts) {
    promises.push(FontLoader.preload(assets.fonts));
  }

  if (assets.data && ASSETS_CONFIG.preload.data) {
    promises.push(Promise.all(assets.data.map(src => DataLoader.loadJSON(src))));
  }

  await Promise.all(promises);
};

// ============================================================================
// 資源類型定義 (Assets Type Definitions)
// ============================================================================

// 資源類型
export type AssetType = 'image' | 'icon' | 'font' | 'data';

// 資源配置接口
export interface AssetConfig {
  type: AssetType;
  src: string;
  preload?: boolean;
  cache?: 'cache-first' | 'network-first' | 'stale-while-revalidate';
}

// 資源加載選項
export interface AssetLoadOptions {
  preload?: boolean;
  cache?: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  timeout?: number;
}
