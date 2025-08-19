/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "組件統一匯出-組件集中管理",
 *   "constraints": ["統一匯出", "無業務邏輯", "依賴管理"],
 *   "dependencies": ["UserCardComponent"],
 *   "security": "none",
 *   "lastmod": "2025-01-18"
 * }
 * @usage import { UserCardComponent } from '@interface/components/widgets'
 * @see docs/architecture/interface.md
 */

export * from './user-card/user-card.component';

