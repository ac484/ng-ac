/**
 * @fileoverview 共享常量索引文件，統一導出所有共享常量
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2024-12-19 by NG-AC Team
 *
 * 📋 檔案性質：
 * • 類型：Shared Layer - Constants Index
 * • 依賴：所有常量模組
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 只負責常量的重新導出
 * • 不包含具體的常量定義
 *
 * @module SharedConstants
 * @layer Shared
 * @context Cross-Domain Constants
 * @see docs/5.new_Tree_layout.md
 */

export * from './api';
export * from './app';
export * from './business';
export * from './layout';
export * from './sidebar';
export * from './tab';
export * from './validation';

