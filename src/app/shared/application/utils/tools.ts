import { ActivatedRouteSnapshot } from '@angular/router';

export function fnGetPathWithoutParam(path: string): string {
    const newPath = path.slice(0, path.indexOf('?') === -1 ? path.length : path.indexOf('?'));
    return newPath;
}

export const getDeepReuseStrategyKeyFn = (snapshot: ActivatedRouteSnapshot): string => {
    let temp = snapshot;
    while (temp.firstChild) {
        temp = temp.firstChild;
    }
    return fnGetPathWithoutParam(temp.pathFromRoot.map(item => item.routeConfig?.path).join('/'));
};

