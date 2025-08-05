import { BaseEntity } from "../common/base.entity";

export interface MenuProps {
  text: string;
  link?: string;
  icon?: string;
  group?: boolean;
  children?: Menu[];
  open?: boolean;
  selected?: boolean;
  disabled?: boolean;
  badge?: number;
  badgeDot?: boolean;
  badgeStatus?: string;
  hide?: boolean;
  hideInBreadcrumb?: boolean;
  acl?: string | string[];
  shortcut?: boolean;
  shortcutRoot?: boolean;
  reuse?: boolean;
  externalLink?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export class Menu extends BaseEntity<string> {
  constructor(props: MenuProps, id?: string) {
    super(props, id);
  }

  get text(): string {
    return this.props.text;
  }

  get link(): string | undefined {
    return this.props.link;
  }

  get icon(): string | undefined {
    return this.props.icon;
  }

  get group(): boolean {
    return this.props.group || false;
  }

  get children(): Menu[] {
    return this.props.children || [];
  }

  get open(): boolean {
    return this.props.open || false;
  }

  get selected(): boolean {
    return this.props.selected || false;
  }

  get disabled(): boolean {
    return this.props.disabled || false;
  }

  get badge(): number | undefined {
    return this.props.badge;
  }

  get badgeDot(): boolean {
    return this.props.badgeDot || false;
  }

  get badgeStatus(): string | undefined {
    return this.props.badgeStatus;
  }

  get hide(): boolean {
    return this.props.hide || false;
  }

  get hideInBreadcrumb(): boolean {
    return this.props.hideInBreadcrumb || false;
  }

  get acl(): string | string[] | undefined {
    return this.props.acl;
  }

  get shortcut(): boolean {
    return this.props.shortcut || false;
  }

  get shortcutRoot(): boolean {
    return this.props.shortcutRoot || false;
  }

  get reuse(): boolean {
    return this.props.reuse || false;
  }

  get externalLink(): string | undefined {
    return this.props.externalLink;
  }

  get target(): '_blank' | '_self' | '_parent' | '_top' | undefined {
    return this.props.target;
  }

  public setOpen(open: boolean): void {
    this.props.open = open;
  }

  public setSelected(selected: boolean): void {
    this.props.selected = selected;
  }

  public setDisabled(disabled: boolean): void {
    this.props.disabled = disabled;
  }

  public setText(text: string): void {
    this.props.text = text;
  }

  public setLink(link: string): void {
    this.props.link = link;
  }

  public setIcon(icon: string): void {
    this.props.icon = icon;
  }

  public addChild(child: Menu): void {
    if (!this.props.children) {
      this.props.children = [];
    }
    this.props.children.push(child);
  }

  public removeChild(childId: string): void {
    if (this.props.children) {
      this.props.children = this.props.children.filter(child => child.id !== childId);
    }
  }

  public setChildren(children: Menu[]): void {
    this.props.children = children;
  }

  public setBadge(badge: number): void {
    this.props.badge = badge;
  }

  public setBadgeDot(badgeDot: boolean): void {
    this.props.badgeDot = badgeDot;
  }

  public setBadgeStatus(badgeStatus: string): void {
    this.props.badgeStatus = badgeStatus;
  }

  public setHide(hide: boolean): void {
    this.props.hide = hide;
  }

  public setAcl(acl: string | string[]): void {
    this.props.acl = acl;
  }
} 