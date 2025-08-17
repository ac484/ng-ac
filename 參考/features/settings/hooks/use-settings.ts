import { useCallback, useEffect, useState } from 'react';
import { SettingsService } from '../services/settings-service';
import { SettingsContextType, SettingsState } from '../types';

export function useSettings(): SettingsContextType {
  const [state, setState] = useState<SettingsState>({
    sidebarSettings: { items: [], version: '', lastUpdated: '' },
    userPreferences: {
      sidebarSettings: { items: [], version: '', lastUpdated: '' },
      theme: 'system',
      language: 'zh-TW',
      notifications: { email: true, push: true, inApp: true }
    },
    isLoading: true,
    error: null
  });

  const settingsService = SettingsService.getInstance();

  const loadSettings = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const settings = await settingsService.loadSettings();
      setState(prev => ({ ...prev, ...settings, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load settings'
      }));
    }
  }, [settingsService]);

  const saveSettings = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await settingsService.saveSettings(state);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to save settings'
      }));
      throw error;
    }
  }, [settingsService, state]);

  const updateSidebarVisibility = useCallback((itemId: string, isVisible: boolean) => {
    setState(prev => {
      const updateItemVisibility = (items: typeof prev.sidebarSettings.items): typeof items => {
        return items.map(item => {
          if (item.id === itemId) {
            return { ...item, isVisible };
          }
          if (item.children) {
            return { ...item, children: updateItemVisibility(item.children) };
          }
          return item;
        });
      };

      return {
        ...prev,
        sidebarSettings: {
          ...prev.sidebarSettings,
          items: updateItemVisibility(prev.sidebarSettings.items)
        }
      };
    });
  }, []);

  const updateSidebarSettings = useCallback((settings: Partial<typeof state.sidebarSettings>) => {
    setState(prev => ({
      ...prev,
      sidebarSettings: { ...prev.sidebarSettings, ...settings }
    }));
  }, []);

  const updateUserPreferences = useCallback((preferences: Partial<typeof state.userPreferences>) => {
    setState(prev => ({
      ...prev,
      userPreferences: { ...prev.userPreferences, ...preferences }
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaultSettings = settingsService.getDefaultSettings();
    setState(defaultSettings);
  }, [settingsService]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    state,
    updateSidebarVisibility,
    updateSidebarSettings,
    updateUserPreferences,
    resetToDefaults,
    saveSettings,
    loadSettings
  };
}
