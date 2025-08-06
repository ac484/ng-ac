import { Firestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { BaseFirebaseRepository } from '../common/base-firebase.repository';
import { Tab, TabProps } from '../../domain/layout/tab.entity';

@Injectable({
  providedIn: 'root'
})
export class TabRepository extends BaseFirebaseRepository<Tab> {
  constructor(firestore: Firestore) {
    super(firestore, 'tabs');
  }

  protected fromFirestore(data: any, id: string): Tab {
    const props: TabProps = {
      title: data.title,
      path: data.path,
      snapshotArray: data.snapshotArray || [],
      isClosable: data.isClosable !== undefined ? data.isClosable : true,
      isActive: data.isActive || false,
      icon: data.icon
    };
    return new Tab(props, id);
  }

  protected toFirestore(entity: Tab): any {
    return {
      title: entity.title,
      path: entity.path,
      snapshotArray: entity.snapshotArray,
      isClosable: entity.isClosable,
      isActive: entity.isActive,
      icon: entity.icon
    };
  }
} 