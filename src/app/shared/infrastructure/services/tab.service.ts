import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, UrlSegment } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import _ from 'lodash';

import { TabModel } from '../../domain/tab.model';

@Injectable({
    providedIn: 'root'
})
export class TabService {
    private tabArray$ = new BehaviorSubject<TabModel[]>([]);
    private tabArray: TabModel[] = [];
    private currSelectedIndexTab = 0;
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    getTabArray$(): Observable<TabModel[]> {
        return this.tabArray$.asObservable();
    }

    setTabArray$(tabArray: TabModel[]): void {
        this.tabArray$.next(tabArray);
    }

    setTabsSourceData(): void {
        this.setTabArray$(this.tabArray);
    }

    clearTabs(): void {
        this.tabArray = [];
        this.setTabsSourceData();
    }

    addTab(tabModel: TabModel, isNewTabDetailPage = false): void {
        this.tabArray.forEach(tab => {
            // 列表详情操作，例如用户表单点击详情，在当前tab中打开这个详情
            if (tab.title === tabModel.title && !isNewTabDetailPage) {
                // 将每个tab下的组件快照存入tab数组中，下面做了去重操作
                tab.snapshotArray = _.uniqBy([...tab.snapshotArray, ...tabModel.snapshotArray], item => {
                    // @ts-ignore
                    return item['_routerState'].url;
                });
                // 当前页中打开详情时，需要将对应的tab的path替换掉
                tab.path = tabModel.path;
            }
        });
        if (!this.tabArray.find(value => value.path === tabModel.path)) {
            this.tabArray.push(tabModel);
        }
        this.setTabsSourceData();
    }

    getTabArray(): TabModel[] {
        return this.tabArray;
    }

    changeTabTitle(title: string): void {
        this.tabArray[this.getCurrentTabIndex()].title = title;
        this.setTabArray$(this.tabArray);
    }

    // 右键tab移除右边所有tab，index为鼠标选中的tab索引
    delRightTab(tabPath: string, index: number): void {
        // 获取待删除的tab
        const beDelTabArray = this.tabArray.filter((item, tabindex) => {
            return tabindex > index;
        });
        // 移除右键选中的tab右边的所有tab
        this.tabArray.length = index + 1;
        // 如果鼠标右键选中的tab索引小于当前展示的tab的索引，就要连同正在打开的tab也要被删除
        if (index < this.currSelectedIndexTab) {
            this.router.navigateByUrl(this.tabArray[index].path);
        }
        this.setTabsSourceData();
    }

    // 右键移除左边所有tab
    delLeftTab(tabPath: string, index: number): void {
        // 要删除的tab
        const beDelTabArray = this.tabArray.filter((item, tabindex) => {
            return tabindex < index;
        });

        // 先处理索引关系
        if (this.currSelectedIndexTab === index) {
            this.currSelectedIndexTab = 0;
        } else if (this.currSelectedIndexTab < index) {
            this.currSelectedIndexTab = 0;
        } else if (this.currSelectedIndexTab > index) {
            this.currSelectedIndexTab = this.currSelectedIndexTab - beDelTabArray.length;
        }
        // 剩余的tab
        this.tabArray = this.tabArray.splice(beDelTabArray.length);
        this.setTabsSourceData();
        this.router.navigateByUrl(this.tabArray[this.currSelectedIndexTab].path);
    }

    // 右键tab选择"移除其他tab"
    delOtherTab(path: string, index: number): void {
        // 要删除的tab
        const beDelTabArray = this.tabArray.filter((item, tabindex) => {
            return tabindex !== index;
        });

        // 处理应当展示的tab
        this.tabArray = [this.tabArray[index]];

        // 如果鼠标选中的tab的索引，不是当前打开的页面的tab的索引，则要将当前页面的key作为waitDelete防止这个当前tab展示的组件移除后仍然被缓存
        if (index !== this.currSelectedIndexTab) {
            // Handle navigation
        }
        this.router.navigateByUrl(path);
        this.setTabsSourceData();
    }

    // 点击tab标签上x图标删除tab的动作,或者右键 点击"删除当前tab"动作
    delTab(tab: TabModel, index: number): void {
        // 移除当前正在展示的tab
        if (index === this.currSelectedIndexTab) {
            this.tabArray.splice(index, 1);
            // 处理索引关系
            this.currSelectedIndexTab = index - 1 < 0 ? 0 : index - 1;
            // 跳转到新tab
            this.router.navigateByUrl(this.tabArray[this.currSelectedIndexTab].path);
        } else if (index < this.currSelectedIndexTab) {
            // 如果鼠标选中的tab索引小于当前展示的tab索引，也就是鼠标选中的tab在当前tab的左侧
            this.tabArray.splice(index, 1);
            this.currSelectedIndexTab = this.currSelectedIndexTab - 1;
        } else if (index > this.currSelectedIndexTab) {
            // 移除当前页签右边的页签
            this.tabArray.splice(index, 1);
        }
        this.setTabsSourceData();
    }

    findIndex(path: string): number {
        const current = this.tabArray.findIndex(tabItem => {
            return path === tabItem.path;
        });
        this.currSelectedIndexTab = current;
        return current;
    }

    getCurrentPathWithoutParam(urlSegmentArray: UrlSegment[], queryParam: { [key: string]: any }): string {
        const temp: string[] = [];
        // 获取所有参数的value
        const queryParamValuesArray = Object.values(queryParam);
        urlSegmentArray.forEach(urlSeqment => {
            // 把表示参数的url片段剔除
            if (!queryParamValuesArray.includes(urlSeqment.path)) {
                temp.push(urlSeqment.path);
            }
        });
        return `${temp.join('/')}`;
    }

    // 刷新
    refresh(): void {
        // 获取当前的路由快照
        let snapshot = this.activatedRoute.snapshot;
        while (snapshot.firstChild) {
            snapshot = snapshot.firstChild;
        }
        let params: Params;
        let urlWithOutParam = ''; // 这是没有参数的url
        // 是路径传参的路由，并且有参数
        if (Object.keys(snapshot.params).length > 0) {
            params = snapshot.params;
            // @ts-ignore
            urlWithOutParam = this.getCurrentPathWithoutParam(snapshot['_urlSegment'].segments, params);
            this.router.navigateByUrl('/blank/global-loading', { skipLocationChange: true }).then(() => {
                this.router.navigate([urlWithOutParam, ...Object.values(params)]);
            });
        } else {
            // 是query传参的路由,或者是没有参数的路由
            params = snapshot.queryParams;
            const sourceUrl = this.router.url;
            const currentRoute = this.getPathWithoutParam(sourceUrl);
            // 是query传参
            this.router.navigateByUrl('/blank/global-loading', { skipLocationChange: true }).then(() => {
                this.router.navigate([currentRoute], { queryParams: params });
            });
        }
    }

    private getPathWithoutParam(url: string): string {
        const queryIndex = url.indexOf('?');
        return queryIndex > -1 ? url.substring(0, queryIndex) : url;
    }

    getCurrentTabIndex(): number {
        return this.currSelectedIndexTab;
    }
}
