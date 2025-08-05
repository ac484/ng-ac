import { BaseEntity } from "../common/base.entity";

export interface LayoutProps {
  mode: LayoutMode;
  isCollapsed: boolean;
  isFixedHeader: boolean;
  isFixedSidebar: boolean;
  isShowTab: boolean;
  isFixedTab: boolean;
  theme: ThemeMode;
  sidebarWidth: number;
  collapsedWidth: number;
}

export type LayoutMode = 'side' | 'top' | 'mixin';
export type ThemeMode = 'light' | 'dark';

export class Layout extends BaseEntity<string> {
  constructor(props: LayoutProps, id?: string) {
    super(props, id);
  }

  get mode(): LayoutMode {
    return this.props.mode;
  }

  get isCollapsed(): boolean {
    return this.props.isCollapsed;
  }

  get isFixedHeader(): boolean {
    return this.props.isFixedHeader;
  }

  get isFixedSidebar(): boolean {
    return this.props.isFixedSidebar;
  }

  get isShowTab(): boolean {
    return this.props.isShowTab;
  }

  get isFixedTab(): boolean {
    return this.props.isFixedTab;
  }

  get theme(): ThemeMode {
    return this.props.theme;
  }

  get sidebarWidth(): number {
    return this.props.sidebarWidth;
  }

  get collapsedWidth(): number {
    return this.props.collapsedWidth;
  }

  public toggleCollapsed(): void {
    this.props.isCollapsed = !this.props.isCollapsed;
  }

  public setCollapsed(collapsed: boolean): void {
    this.props.isCollapsed = collapsed;
  }

  public setMode(mode: LayoutMode): void {
    this.props.mode = mode;
  }

  public setTheme(theme: ThemeMode): void {
    this.props.theme = theme;
  }

  public setFixedHeader(fixed: boolean): void {
    this.props.isFixedHeader = fixed;
  }

  public setFixedSidebar(fixed: boolean): void {
    this.props.isFixedSidebar = fixed;
  }

  public setShowTab(show: boolean): void {
    this.props.isShowTab = show;
  }

  public setFixedTab(fixed: boolean): void {
    this.props.isFixedTab = fixed;
  }
} 