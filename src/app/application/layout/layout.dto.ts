export interface CreateLayoutDto {
  mode?: 'side' | 'top' | 'mixin';
  isCollapsed?: boolean;
  isFixedHeader?: boolean;
  isFixedSidebar?: boolean;
  isShowTab?: boolean;
  isFixedTab?: boolean;
  theme?: 'light' | 'dark';
  sidebarWidth?: number;
  collapsedWidth?: number;
}

export interface UpdateLayoutDto {
  mode?: 'side' | 'top' | 'mixin';
  isCollapsed?: boolean;
  isFixedHeader?: boolean;
  isFixedSidebar?: boolean;
  isShowTab?: boolean;
  isFixedTab?: boolean;
  theme?: 'light' | 'dark';
  sidebarWidth?: number;
  collapsedWidth?: number;
} 