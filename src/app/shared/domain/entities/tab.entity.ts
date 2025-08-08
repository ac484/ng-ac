import { TabId } from '../value-objects/tab-id.vo';

export interface TabProps {
  id: TabId;
  title: string;
  url: string;
  icon?: string;
  closable: boolean;
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Tab {
  private readonly props: TabProps;

  private constructor(props: TabProps) {
    this.props = props;
  }

  static create(title: string, url: string, icon?: string, closable = true): Tab {
    if (!title || title.trim().length === 0) {
      throw new Error('Tab title cannot be empty');
    }

    if (!url || url.trim().length === 0) {
      throw new Error('Tab URL cannot be empty');
    }

    const now = new Date();
    return new Tab({
      id: TabId.generate(),
      title: title.trim(),
      url: url.trim(),
      icon,
      closable,
      active: false,
      order: 0,
      createdAt: now,
      updatedAt: now
    });
  }

  static fromProps(props: TabProps): Tab {
    return new Tab(props);
  }

  // Getters
  get id(): TabId {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get url(): string {
    return this.props.url;
  }

  get icon(): string | undefined {
    return this.props.icon;
  }

  get closable(): boolean {
    return this.props.closable;
  }

  get active(): boolean {
    return this.props.active;
  }

  get order(): number {
    return this.props.order;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  activate(): Tab {
    return new Tab({
      ...this.props,
      active: true,
      updatedAt: new Date()
    });
  }

  deactivate(): Tab {
    return new Tab({
      ...this.props,
      active: false,
      updatedAt: new Date()
    });
  }

  updateTitle(newTitle: string): Tab {
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error('Tab title cannot be empty');
    }

    return new Tab({
      ...this.props,
      title: newTitle.trim(),
      updatedAt: new Date()
    });
  }

  updateUrl(newUrl: string): Tab {
    if (!newUrl || newUrl.trim().length === 0) {
      throw new Error('Tab URL cannot be empty');
    }

    return new Tab({
      ...this.props,
      url: newUrl.trim(),
      updatedAt: new Date()
    });
  }

  updateOrder(newOrder: number): Tab {
    return new Tab({
      ...this.props,
      order: newOrder,
      updatedAt: new Date()
    });
  }

  equals(tab?: Tab): boolean {
    if (tab === null || tab === undefined) {
      return false;
    }
    if (this === tab) {
      return true;
    }
    return this.props.id.equals(tab.props.id);
  }

  toJSON(): TabProps {
    return { ...this.props };
  }
}
