import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { G2RadarModule } from '@delon/chart/radar';
import { _HttpClient } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMessageService } from 'ng-zorro-antd/message';
import { zip } from 'rxjs';

@Component({
  selector: 'app-dashboard-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...SHARED_IMPORTS, NzAvatarModule, G2RadarModule]
})
export class DashboardWorkplaceComponent implements OnInit {
  private readonly http = inject(_HttpClient);
  readonly msg = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notice: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activities: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  radarData!: any[];
  loading = true;

  links = [
    {
      title: '操作一',
      href: ''
    },
    {
      title: '操作二',
      href: ''
    },
    {
      title: '操作三',
      href: ''
    },
    {
      title: '操作四',
      href: ''
    },
    {
      title: '操作五',
      href: ''
    },
    {
      title: '操作六',
      href: ''
    }
  ];
  members = [
    {
      id: 'members-1',
      title: '科学搬砖组',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      link: ''
    },
    {
      id: 'members-2',
      title: '程序员日常',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      link: ''
    },
    {
      id: 'members-3',
      title: '设计天团',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      link: ''
    },
    {
      id: 'members-4',
      title: '中二少女团',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      link: ''
    },
    {
      id: 'members-5',
      title: '骗你学计算机',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
      link: ''
    }
  ];

  ngOnInit(): void {
    zip(this.http.get('/chart'), this.http.get('/api/notice'), this.http.get('/api/activities')).subscribe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ([chart, notice, activities]: [any, any, any]) => {
        this.radarData = chart.radarData;
        this.notice = notice;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.activities = activities.map((item: any) => {
          item.template = item.template.split(/@\{([^{}]*)\}/gi).map((key: string) => {
            if (item[key]) {
              return `<a>${item[key].name}</a>`;
            }
            return key;
          });
          return item;
        });
        this.loading = false;
        this.cdr.detectChanges();
      }
    );
  }
}
