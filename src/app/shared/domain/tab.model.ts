import { ActivatedRouteSnapshot } from '@angular/router';

export interface TabModel {
  title: string;
  path: string;
  snapshotArray: ActivatedRouteSnapshot[];
}
