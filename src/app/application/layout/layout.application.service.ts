import { Injectable } from '@angular/core';
import { BaseApplicationService } from '../common/base-application.service';
import { Layout, LayoutProps } from '../../domain/layout/layout.entity';
import { CreateLayoutDto, UpdateLayoutDto } from './layout.dto';
import { LayoutRepository } from '../../infrastructure/layout/layout.repository';

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

  async toggleCollapsed(): Promise<void> {
    const currentLayout = await this.getCurrentLayout();
    if (currentLayout) {
      currentLayout.toggleCollapsed();
      await this.repository.save(currentLayout as Layout & { id: string });
    }
  }

  async setMode(mode: 'side' | 'top' | 'mixin'): Promise<void> {
    const currentLayout = await this.getCurrentLayout();
    if (currentLayout) {
      currentLayout.setMode(mode);
      await this.repository.save(currentLayout as Layout & { id: string });
    }
  }

  async setTheme(theme: 'light' | 'dark'): Promise<void> {
    const currentLayout = await this.getCurrentLayout();
    if (currentLayout) {
      currentLayout.setTheme(theme);
      await this.repository.save(currentLayout as Layout & { id: string });
    }
  }

  private async getCurrentLayout(): Promise<Layout | null> {
    const layouts = await this.repository.findAll();
    return layouts.length > 0 ? layouts[0] : null;
  }
} 