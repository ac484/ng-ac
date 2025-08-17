# 國際化 (i18n) 系統

## 概述

本專案使用 `next-intl` 實現國際化功能，支援中英文雙語切換。

## 目錄結構

```
src/i18n/
├── routing.ts          # 路由配置
├── request.ts          # 請求配置
├── navigation.ts       # 導航 API
├── messages/           # 語言包目錄
│   ├── en/            # 英文
│   │   ├── common.json    # 通用翻譯
│   │   └── navigation.json # 導航翻譯
│   └── zh-TW/         # 繁體中文
│       ├── common.json    # 通用翻譯
│       └── navigation.json # 導航翻譯
└── README.md          # 說明文檔
```

## 使用方法

### 1. 在組件中使用翻譯

```tsx
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('navigation');

  return (
    <div>
      <h1>{t('Overview')}</h1>
      <p>{t('Core Business')}</p>
    </div>
  );
}
```

### 2. 使用通用翻譯

```tsx
import { useTranslations } from 'next-intl';

export function ActionButtons() {
  const t = useTranslations('common');

  return (
    <div>
      <button>{t('actions.save')}</button>
      <button>{t('actions.cancel')}</button>
    </div>
  );
}
```

### 3. 語言切換

```tsx
import { LanguageSwitcher } from '@/components/language-switcher';

export function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

## 添加新翻譯

### 1. 在對應的語言包文件中添加新的鍵值對

```json
// src/i18n/messages/en/navigation.json
{
  "NewFeature": "New Feature"
}

// src/i18n/messages/zh-TW/navigation.json
{
  "NewFeature": "新功能"
}
```

### 2. 在組件中使用

```tsx
const t = useTranslations('navigation');
return <div>{t('NewFeature')}</div>;
```

## 注意事項

1. 所有翻譯鍵必須在兩種語言中都存在
2. 使用 `useTranslations` 時，命名空間必須與文件名對應
3. 語言切換會自動更新 URL 和頁面內容
4. 支援 SEO 友好的 URL 結構

## 支援的語言

- 英文 (en) - 預設語言
- 繁體中文 (zh-TW)

## 時區設定

預設時區設定為 `Asia/Taipei`，可在 `request.ts` 中修改。

