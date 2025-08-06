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

// 获取key，为key+param的形式：login{name:xxx}
export const fnGetReuseStrategyKeyFn = (route: ActivatedRouteSnapshot): string => {
    const configKey = route.data['key'];
    if (!configKey) {
        return '';
    }
    // 是query传参,并且有参数
    if (Object.keys(route.queryParams).length > 0) {
        return configKey + JSON.stringify(route.queryParams);
    } else if (Object.keys(route.params).length > 0) {
        // 是路径传参，并且有参数
        return configKey + JSON.stringify(route.params);
    } else {
        // 没有路由参数
        return `${configKey}{}`;
    }
};

