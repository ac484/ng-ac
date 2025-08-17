import { NavItem } from '@/types';
import { SidebarItemSettings } from '../types';

export function transformSettingsToNavItems(settings: SidebarItemSettings[]): NavItem[] {
  return settings
    .filter(item => item.isVisible)
    .map(item => ({
      title: item.title,
      url: item.url,
      icon: item.icon as keyof typeof import('@/components/icons').Icons || 'page',
      isActive: false,
      shortcut: ['', ''] as [string, string],
      items: item.children ? transformSettingsToNavItems(item.children) : []
    }));
}

export function getVisibleSidebarItems(settings: SidebarItemSettings[]): SidebarItemSettings[] {
  return settings.filter(item => item.isVisible);
}

export function findSidebarItemById(settings: SidebarItemSettings[], id: string): SidebarItemSettings | null {
  for (const item of settings) {
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      const found = findSidebarItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}
