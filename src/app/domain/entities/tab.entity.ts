import { ActivatedRouteSnapshot } from '@angular/router';

/**
 * Domain Entity: Tab Model
 * 
 * Represents a tab in the application with its associated route snapshot.
 * This entity belongs to the Domain layer as it contains core business logic
 * and rules for tab management.
 */
export interface TabModel {
  title: string;
  path: string;
  snapshotArray: ActivatedRouteSnapshot[];
}

/**
 * Domain Entity: Tab Status
 * 
 * Represents the current status of a tab in the application.
 */
export enum TabStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LOADING = 'loading',
  ERROR = 'error'
}

/**
 * Domain Entity: Tab Configuration
 * 
 * Configuration options for tab behavior and appearance.
 */
export interface TabConfig {
  closable: boolean;
  refreshable: boolean;
  keepAlive: boolean;
  maxTabs: number;
}

/**
 * Domain Entity: Tab Event
 * 
 * Events that can occur on tabs for domain event handling.
 */
export interface TabEvent {
  type: 'TAB_ADDED' | 'TAB_REMOVED' | 'TAB_ACTIVATED' | 'TAB_REFRESHED';
  tab: TabModel;
  timestamp: Date;
} 