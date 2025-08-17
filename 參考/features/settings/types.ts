// Settings feature types

export interface SidebarItemSettings {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isVisible: boolean;
  isCollapsible: boolean;
  children?: SidebarItemSettings[];
}

export interface SidebarSettings {
  items: SidebarItemSettings[];
  version: string;
  lastUpdated: string;
}

export interface UserPreferences {
  sidebarSettings: SidebarSettings;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

export interface SettingsState {
  sidebarSettings: SidebarSettings;
  userPreferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

export interface SettingsContextType {
  state: SettingsState;
  updateSidebarVisibility: (itemId: string, isVisible: boolean) => void;
  updateSidebarSettings: (settings: Partial<SidebarSettings>) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  resetToDefaults: () => void;
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
}
