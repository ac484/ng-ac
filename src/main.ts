/**
 * @fileoverview 應用啟動入口檔案 (Application Bootstrap)
 * @description 應用程式的啟動點，負責初始化 Angular 應用和配置
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Application Layer Bootstrap
 * - 職責：應用啟動、組件初始化、配置加載
 * - 依賴：Angular Platform Browser、AppComponent、AppConfig
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案是應用的唯一啟動點，不可更改
 * - 使用 bootstrapApplication 啟動獨立組件應用
 * - 所有應用配置必須在此檔案中加載
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@app/app.component';
import { appConfig } from '@app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
