import { Injectable } from '@angular/core';
import { BaseApplicationService } from '../common/base-application.service';
import { Layout, LayoutProps } from '../../domain/layout/layout.entity';
import { CreateLayoutDto, UpdateLayoutDto } from './layout.dto';
import { LayoutRepository } from '../../infrastructure/layout/layout.repository';

const LAYOUT_STORAGE_KEY = 'app_layout_settings';

@Injectable({
  providedIn: 'root'
})
export class LayoutApplicationService extends BaseApplicationService<Layout, CreateLayoutDto, UpdateLayoutDto> {
  constructor(protected override repository: LayoutRepository) {
    super(repository);
  }

  protected createEntity(dto: CreateLayoutDto): Layout {
    const props: LayoutProps = {
      mode: dto.mode || 'side',
      isCollapsed: dto.isCollapsed || false,
      isFixedHeader: dto.isFixedHeader || false,
      isFixedSidebar: dto.isFixedSidebar || false,
      isShowTab: dto.isShowTab || true,
      isFixedTab: dto.isFixedTab || false,
      theme: dto.theme || 'light',
      sidebarWidth: dto.sidebarWidth || 200,
      collapsedWidth: dto.collapsedWidth || 80
    };
    return new Layout(props);
  }

  protected updateEntity(entity: Layout, dto: UpdateLayoutDto): void {
    if (dto.mode !== undefined) {
      entity.setMode(dto.mode);
    }
    if (dto.isCollapsed !== undefined) {
      entity.setCollapsed(dto.isCollapsed);
    }
    if (dto.isFixedHeader !== undefined) {
      entity.setFixedHeader(dto.isFixedHeader);
    }
    if (dto.isFixedSidebar !== undefined) {
      entity.setFixedSidebar(dto.isFixedSidebar);
    }
    if (dto.isShowTab !== undefined) {
      entity.setShowTab(dto.isShowTab);
    }
    if (dto.isFixedTab !== undefined) {
      entity.setFixedTab(dto.isFixedTab);
    }
    if (dto.theme !== undefined) {
      entity.setTheme(dto.theme);
    }
  }

  private saveToLocalStorage(layout: Layout): void {
    try {
      const layoutData = {
        mode: layout.mode,
        isCollapsed: layout.isCollapsed,
        isFixedHeader: layout.isFixedHeader,
        isFixedSidebar: layout.isFixedSidebar,
        isShowTab: layout.isShowTab,
        isFixedTab: layout.isFixedTab,
        theme: layout.theme,
        sidebarWidth: layout.sidebarWidth,
        collapsedWidth: layout.collapsedWidth
      };
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layoutData));
    } catch (error) {
      console.error('Failed to save layout to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): LayoutProps | null {
    try {
      const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load layout from localStorage:', error);
    }
    return null;
  }

  override async findAll(): Promise<Layout[]> {
    // 首先嘗試從本地存儲加載
    const localLayout = this.loadFromLocalStorage();
    if (localLayout) {
      return [new Layout(localLayout)];
    }

    // 如果本地存儲沒有，則從 Firebase 加載
    try {
      const layouts = await this.repository.findAll();
      if (layouts.length > 0) {
        // 保存到本地存儲
        this.saveToLocalStorage(layouts[0]);
        return layouts;
      }
    } catch (error) {
      console.error('Failed to load layouts from Firebase:', error);
    }

    // 如果都沒有，創建默認佈局
    const defaultLayout = await this.createDefaultLayout();
    return [defaultLayout];
  }

  override async create(dto: CreateLayoutDto): Promise<Layout> {
    const layout = await super.create(dto);
    this.saveToLocalStorage(layout);
    return layout;
  }

  async saveLayout(entity: Layout & { id: string }): Promise<void> {
    await this.repository.save(entity);
    this.saveToLocalStorage(entity);
  }

  async toggleCollapsed(): Promise<void> {
    const currentLayout = await this.getCurrentLayout();
    if (currentLayout) {
      currentLayout.toggleCollapsed();
      await this.saveLayout(currentLayout as Layout & { id: string });
    }
  }

  async setMode(mode: 'side' | 'top' | 'mixin'): Promise<void> {
    const currentLayout = await this.getCurrentLayout();
    if (currentLayout) {
      currentLayout.setMode(mode);
      await this.saveLayout(currentLayout as Layout & { id: string });
    }
  }

  async setTheme(theme: 'light' | 'dark'): Promise<void> {
    const currentLayout = await this.getCurrentLayout();
    if (currentLayout) {
      currentLayout.setTheme(theme);
      await this.saveLayout(currentLayout as Layout & { id: string });
    }
  }

  private async getCurrentLayout(): Promise<Layout | null> {
    const layouts = await this.findAll();
    return layouts.length > 0 ? layouts[0] : null;
  }

  private async createDefaultLayout(): Promise<Layout> {
    const defaultLayout = await this.create({
      mode: 'side',
      isCollapsed: false,
      isFixedHeader: false,
      isFixedSidebar: false,
      isShowTab: true,
      isFixedTab: false,
      theme: 'light',
      sidebarWidth: 200,
      collapsedWidth: 80
    });
    return defaultLayout;
  }
} 