// 獨立的 React Hook，使用新的設置管理器
// 完全獨立於其他模塊，只通過事件總線通信

import { useCallback, useEffect, useState } from 'react';
import { SettingsManager, SettingsState } from '../core/settings-manager';

export function useIndependentSettings() {
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

  const settingsManager = SettingsManager.getInstance();

  // 加載設置
  const loadSettings = useCallback(async () => {
    try {
      await settingsManager.loadSettings();
      setState(settingsManager.getState());
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load settings'
      }));
    }
  }, [settingsManager]);

  // 保存設置
  const saveSettings = useCallback(async () => {
    try {
      await settingsManager.saveSettings();
      setState(settingsManager.getState());
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to save settings'
      }));
      throw error;
    }
  }, [settingsManager]);

  // 更新側邊欄可見性
  const updateSidebarVisibility = useCallback((itemId: string, isVisible: boolean) => {
    settingsManager.updateSidebarVisibility(itemId, isVisible);
    setState(settingsManager.getState());
  }, [settingsManager]);

  // 重置為默認設置
  const resetToDefaults = useCallback(() => {
    settingsManager.resetToDefaults();
    setState(settingsManager.getState());
  }, [settingsManager]);

  // 獲取可見的側邊欄項目
  const getVisibleSidebarItems = useCallback(() => {
    return settingsManager.getVisibleSidebarItems();
  }, [settingsManager]);

  // 初始化時加載設置
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    state,
    updateSidebarVisibility,
    saveSettings,
    resetToDefaults,
    getVisibleSidebarItems,
    loadSettings
  };
}
