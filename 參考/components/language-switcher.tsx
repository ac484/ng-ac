'use client';

// Temporarily disabled - next-intl dependency removed
/*
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <Button
        variant={locale === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('en')}
        className="text-xs"
      >
        EN
      </Button>
      <Button
        variant={locale === 'zh-TW' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('zh-TW')}
        className="text-xs"
      >
        中文
      </Button>
    </div>
  );
}
*/

export function LanguageSwitcher() {
  return null; // Temporarily disabled
}

