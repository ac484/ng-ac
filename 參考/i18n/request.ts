// Temporarily disabled - next-intl dependency removed
/*
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // 獲取請求的語言
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // 動態載入語言包文件
  const messages = {
    ...(await import(`./messages/${locale}/common.json`)).default,
    ...(await import(`./messages/${locale}/navigation.json`)).default
  };

  return {
    locale,
    messages,
    timeZone: 'Asia/Taipei'
  };
});
*/

// Placeholder export to prevent import errors
export default async () => ({
  locale: 'en',
  messages: {},
  timeZone: 'UTC'
});

