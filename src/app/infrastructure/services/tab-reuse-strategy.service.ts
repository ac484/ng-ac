import { Injectable, inject, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Infrastructure Service: Tab Reuse Strategy Service
 * 
 * Implements Angular's RouteReuseStrategy to cache route components
 * for tab functionality. This service belongs to the Infrastructure
 * layer as it handles technical concerns like route caching and
 * component lifecycle management.
 */
@Injectable({
  providedIn: 'root'
})
export class TabReuseStrategyService implements RouteReuseStrategy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);

  // Cache for route handlers
  private static handlers: { [key: string]: any } = {};
  
  // Cache for scroll positions
  private static scrollHandlers: { [key: string]: any } = {};
  
  // Flag to prevent caching when tab is being deleted
  public static waitDelete: string | null = null;

  /**
   * Determine if route should be detached (cached)
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Don't cache if explicitly disabled
    if (route.data['shouldDetach'] === 'no') {
      return false;
    }
    
    // Don't cache if tab functionality is disabled
    if (route.data['disableTab'] === true) {
      return false;
    }

    return true;
  }

  /**
   * Store route handle when route is detached
   */
  store(route: ActivatedRouteSnapshot, handle: any): void {
    if (route.data['shouldDetach'] === 'no') {
      return;
    }

    const key = this.getRouteKey(route);
    
    // Don't store if this route is marked for deletion
    if (TabReuseStrategyService.waitDelete === key) {
      this.runHook('_onReuseDestroy', handle.componentRef);
      handle.componentRef.destroy();
      TabReuseStrategyService.waitDelete = null;
      delete TabReuseStrategyService.scrollHandlers[key];
      return;
    }

    // Store scroll position
    this.storeScrollPosition(route, key);
    
    // Store the route handle
    TabReuseStrategyService.handlers[key] = handle;
  }

  /**
   * Determine if route should be attached (retrieved from cache)
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.getRouteKey(route);
    return !!TabReuseStrategyService.handlers[key];
  }

  /**
   * Retrieve cached route handle
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const key = this.getRouteKey(route);
    const handle = TabReuseStrategyService.handlers[key];
    
    if (handle) {
      this.runHook('_onReuseInit', handle.componentRef);
      this.restoreScrollPosition(route, key);
    }
    
    return handle;
  }

  /**
   * Determine if routes should be reused
   */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  /**
   * Delete a specific route from cache
   */
  public static deleteRouteSnapshot(key: string): void {
    if (TabReuseStrategyService.handlers[key]) {
      if (TabReuseStrategyService.handlers[key].componentRef) {
        TabReuseStrategyService.handlers[key].componentRef.destroy();
      }
      delete TabReuseStrategyService.handlers[key];
      delete TabReuseStrategyService.scrollHandlers[key];
    }
  }

  /**
   * Delete all cached routes
   */
  public static deleteAllRouteSnapshots(): Promise<void> {
    return new Promise(resolve => {
      Object.keys(TabReuseStrategyService.handlers).forEach(key => {
        TabReuseStrategyService.deleteRouteSnapshot(key);
      });
      resolve();
    });
  }

  /**
   * Get unique key for route
   */
  private getRouteKey(route: ActivatedRouteSnapshot): string {
    const path = this.getRoutePath(route);
    const params = this.getRouteParams(route);
    return `${path}${params}`;
  }

  /**
   * Get route path
   */
  private getRoutePath(route: ActivatedRouteSnapshot): string {
    const paths: string[] = [];
    let currentRoute = route;
    
    while (currentRoute) {
      if (currentRoute.routeConfig?.path) {
        paths.unshift(currentRoute.routeConfig.path);
      }
      currentRoute = currentRoute.parent!;
    }
    
    return paths.join('/');
  }

  /**
   * Get route parameters as string
   */
  private getRouteParams(route: ActivatedRouteSnapshot): string {
    const params = { ...route.params, ...route.queryParams };
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return paramString ? `?${paramString}` : '';
  }

  /**
   * Store scroll position for route
   */
  private storeScrollPosition(route: ActivatedRouteSnapshot, key: string): void {
    if (route.data['needKeepScroll'] === 'no') {
      return;
    }

    const scrollContainers = route.data['scrollContain'] || [];
    const scrollPositions: any[] = [];

    // Store scroll positions for specified containers
    scrollContainers.forEach((selector: string) => {
      const element = this.doc.querySelector(selector);
      if (element) {
        scrollPositions.push({
          [selector]: {
            scrollTop: element.scrollTop,
            scrollLeft: element.scrollLeft
          }
        });
      }
    });

    // Store window scroll position
    scrollPositions.push({
      window: {
        scrollTop: window.pageYOffset,
        scrollLeft: window.pageXOffset
      }
    });

    TabReuseStrategyService.scrollHandlers[key] = scrollPositions;
  }

  /**
   * Restore scroll position for route
   */
  private restoreScrollPosition(route: ActivatedRouteSnapshot, key: string): void {
    const scrollPositions = TabReuseStrategyService.scrollHandlers[key];
    if (!scrollPositions) {
      return;
    }

    // Restore scroll positions
    scrollPositions.forEach((position: any) => {
      Object.keys(position).forEach(selector => {
        if (selector === 'window') {
          window.scrollTo(position[selector].scrollLeft, position[selector].scrollTop);
        } else {
          const element = this.doc.querySelector(selector);
          if (element) {
            element.scrollTop = position[selector].scrollTop;
            element.scrollLeft = position[selector].scrollLeft;
          }
        }
      });
    });
  }

  /**
   * Run lifecycle hooks on component
   */
  private runHook(method: '_onReuseInit' | '_onReuseDestroy', componentRef: any): void {
    if (componentRef && componentRef.instance && typeof componentRef.instance[method] === 'function') {
      componentRef.instance[method]();
    }
  }
} 