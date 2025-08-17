// Temporarily disabled - next-intl dependency removed
/*
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // 支援的語言列表
  locales: ['en', 'zh-TW'],

  // 預設語言
  defaultLocale: 'en',

  // 語言前綴設定
  localePrefix: 'as-needed'
});
*/

// Placeholder export to prevent import errors
export const routing = {
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'never'
};

