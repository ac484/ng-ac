import { ActivatedRouteSnapshot, DetachedRouteHandle, Route, RouteReuseStrategy } from '@angular/router';
import { getDeepReuseStrategyKeyFn } from '../application/utils/tools';

export class SimpleReuseStrategy implements RouteReuseStrategy {
    static handlers: { [key: string]: DetachedRouteHandle } = {};
    static waitDelete: string | null = null;

    static deleteRouteSnapshot(key: string): void {
        if (SimpleReuseStrategy.handlers[key]) {
            delete SimpleReuseStrategy.handlers[key];
        }
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.data['keep'] === true;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        if (handle) {
            const key = getDeepReuseStrategyKeyFn(route);
            SimpleReuseStrategy.handlers[key] = handle;
        }
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const key = getDeepReuseStrategyKeyFn(route);
        return !!SimpleReuseStrategy.handlers[key];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        const key = getDeepReuseStrategyKeyFn(route);
        return SimpleReuseStrategy.handlers[key] || null;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        const futureKey = getDeepReuseStrategyKeyFn(future);
        const currKey = getDeepReuseStrategyKeyFn(curr);

        if (SimpleReuseStrategy.waitDelete === currKey) {
            delete SimpleReuseStrategy.handlers[currKey];
            SimpleReuseStrategy.waitDelete = null;
        }

        return future.routeConfig === curr.routeConfig;
    }
}

