import { Firestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { BaseFirebaseRepository } from '../common/base-firebase.repository';
import { Layout, LayoutProps } from '../../domain/layout/layout.entity';

@Injectable({
  providedIn: 'root'
})
export class LayoutRepository extends BaseFirebaseRepository<Layout> {
  constructor(firestore: Firestore) {
    super(firestore, 'layouts');
  }

  protected fromFirestore(data: any, id: string): Layout {
    const props: LayoutProps = {
      mode: data.mode || 'side',
      isCollapsed: data.isCollapsed || false,
      isFixedHeader: data.isFixedHeader || false,
      isFixedSidebar: data.isFixedSidebar || false,
      isShowTab: data.isShowTab !== undefined ? data.isShowTab : true,
      isFixedTab: data.isFixedTab || false,
      theme: data.theme || 'light',
      sidebarWidth: data.sidebarWidth || 200,
      collapsedWidth: data.collapsedWidth || 80
    };
    return new Layout(props, id);
  }

  protected toFirestore(entity: Layout): any {
    return {
      mode: entity.mode,
      isCollapsed: entity.isCollapsed,
      isFixedHeader: entity.isFixedHeader,
      isFixedSidebar: entity.isFixedSidebar,
      isShowTab: entity.isShowTab,
      isFixedTab: entity.isFixedTab,
      theme: entity.theme,
      sidebarWidth: entity.sidebarWidth,
      collapsedWidth: entity.collapsedWidth
    };
  }
} 