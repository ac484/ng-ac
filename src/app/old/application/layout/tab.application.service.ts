import { Injectable } from '@angular/core';
import { BaseApplicationService } from '../common/base-application.service';
import { Tab, TabProps } from '../../domain/layout/tab.entity';
import { CreateTabDto, UpdateTabDto } from './tab.dto';
import { TabRepository } from '../../infrastructure/layout/tab.repository';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TabApplicationService extends BaseApplicationService<Tab, CreateTabDto, UpdateTabDto> {
  constructor(protected override repository: TabRepository) {
    super(repository);
  }

  protected createEntity(dto: CreateTabDto): Tab {
    const props: TabProps = {
      title: dto.title,
      path: dto.path,
      snapshotArray: dto.snapshotArray || [],
      isClosable: dto.isClosable ?? true,
      isActive: dto.isActive ?? false,
      icon: dto.icon
    };
    return new Tab(props);
  }

  protected updateEntity(entity: Tab, dto: UpdateTabDto): void {
    if (dto.title !== undefined) {
      entity.setTitle(dto.title);
    }
    if (dto.path !== undefined) {
      entity.setPath(dto.path);
    }
    if (dto.isActive !== undefined) {
      entity.setActive(dto.isActive);
    }
    if (dto.isClosable !== undefined) {
      entity.setClosable(dto.isClosable);
    }
    if (dto.icon !== undefined) {
      entity.setIcon(dto.icon);
    }
  }

  async addTab(title: string, path: string, snapshot?: ActivatedRouteSnapshot): Promise<Tab> {
    const existingTab = await this.findTabByPath(path);
    if (existingTab) {
      existingTab.setActive(true);
      if (snapshot) {
        existingTab.addSnapshot(snapshot);
      }
      await this.repository.save(existingTab as Tab & { id: string });
      return existingTab;
    }

    const dto: CreateTabDto = {
      title,
      path,
      isActive: true,
      snapshotArray: snapshot ? [snapshot] : []
    };

    return await this.create(dto);
  }

  async closeTab(tabId: string): Promise<void> {
    await this.repository.delete(tabId);
  }

  async closeOtherTabs(keepTabId: string): Promise<void> {
    const allTabs = await this.repository.findAll();
    const tabsToClose = allTabs.filter(tab => tab.id !== keepTabId);
    
    for (const tab of tabsToClose) {
      await this.repository.delete(tab.id);
    }
  }

  async closeRightTabs(tabId: string): Promise<void> {
    const allTabs = await this.repository.findAll();
    const currentTabIndex = allTabs.findIndex(tab => tab.id === tabId);
    
    if (currentTabIndex !== -1) {
      const tabsToClose = allTabs.slice(currentTabIndex + 1);
      for (const tab of tabsToClose) {
        await this.repository.delete(tab.id);
      }
    }
  }

  async closeLeftTabs(tabId: string): Promise<void> {
    const allTabs = await this.repository.findAll();
    const currentTabIndex = allTabs.findIndex(tab => tab.id === tabId);
    
    if (currentTabIndex > 0) {
      const tabsToClose = allTabs.slice(0, currentTabIndex);
      for (const tab of tabsToClose) {
        await this.repository.delete(tab.id);
      }
    }
  }

  async setActiveTab(tabId: string): Promise<void> {
    const allTabs = await this.repository.findAll();
    
    for (const tab of allTabs) {
      tab.setActive(tab.id === tabId);
      await this.repository.save(tab as Tab & { id: string });
    }
  }

  async refreshTab(tabId: string): Promise<void> {
    const tab = await this.repository.findById(tabId);
    if (tab) {
      tab.clearSnapshots();
      await this.repository.save(tab as Tab & { id: string });
    }
  }

  private async findTabByPath(path: string): Promise<Tab | null> {
    const tabs = await this.repository.findAll({ path });
    return tabs.length > 0 ? tabs[0] : null;
  }
} 