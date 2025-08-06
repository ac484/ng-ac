import { ActivatedRouteSnapshot } from '@angular/router';

export interface CreateTabDto {
  title: string;
  path: string;
  snapshotArray?: ActivatedRouteSnapshot[];
  isClosable?: boolean;
  isActive?: boolean;
  icon?: string;
}

export interface UpdateTabDto {
  title?: string;
  path?: string;
  isClosable?: boolean;
  isActive?: boolean;
  icon?: string;
} 