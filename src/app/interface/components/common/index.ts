/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "通用組件統一匯出-通用組件集中管理",
 *   "constraints": ["統一匯出", "無業務邏輯", "依賴管理"],
 *   "dependencies": ["ButtonComponent", "UserMenuComponent"],
 *   "security": "none",
 *   "lastmod": "2025-01-18"
 * }
 * @usage import { ButtonComponent, UserMenuComponent } from '@interface/components/common'
 * @see docs/architecture/interface.md
 */

export * from './button/button.component';
export * from './user-menu/user-menu.component';

