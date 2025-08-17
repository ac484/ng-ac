import { NavItem } from '@/types';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: '概覽',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['o', 'o'],
    items: []
  },
  {
    title: '核心業務',
    url: '#',
    icon: 'billing',
    isActive: false,
    items: [
      {
        title: '顯示面板',
        url: '/dashboard/display-panel',
        icon: 'dashboard',
        shortcut: ['d', 'b']
      },
            {
        title: '合約',
        url: '/dashboard/contracts',
        icon: 'post',
        shortcut: ['c', 't']
      },
      {
        title: '專案',
        url: '/dashboard/projects',
        icon: 'page',
        shortcut: ['p', 'j']
      },
      {
        title: '產品🚧',
        url: '/dashboard/products',
        icon: 'product',
        shortcut: ['p', 's']
      },
      {
        title: '庫存🚧',
        url: '/dashboard/inventory',
        icon: 'page',
        shortcut: ['i', 'v']
      },
      {
        title: '銷售🚧',
        url: '/dashboard/sales',
        icon: 'arrowRight',
        shortcut: ['s', 'l']
      },
      {
        title: '客戶🚧',
        url: '/dashboard/customers',
        icon: 'user',
        shortcut: ['c', 's']
      }
    ]
  },
  {
    title: '營運',
    url: '#',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: '文件',
        url: '/dashboard/documents',
        icon: 'page',
        shortcut: ['d', 'c']
      },
      {
        title: '工作流程🚧',
        url: '/dashboard/workflows',
        icon: 'kanban',
        shortcut: ['w', 'f']
      },
      {
        title: '看板',
        url: '/dashboard/kanban',
        icon: 'kanban',
        shortcut: ['k', 'n']
      },
      {
        title: '時間軸🚧',
        url: '/dashboard/timeline',
        icon: 'dashboard',
        shortcut: ['t', 'l']
      },
      {
        title: '品質🚧',
        url: '/dashboard/quality',
        icon: 'check',
        shortcut: ['q', 'l']
      },
      {
        title: '問題🚧',
        url: '/dashboard/issues',
        icon: 'warning',
        shortcut: ['i', 's']
      },
      {
        title: '施工進度',
        url: '/dashboard/construction-schedule',
        icon: 'dashboard',
        shortcut: ['c', 's']
      },
      {
        title: '每日施工日誌',
        url: '/dashboard/daily-construction-log',
        icon: 'page',
        shortcut: ['d', 'l']
      },
      {
        title: '工地天氣',
        url: '/dashboard/site-weather',
        icon: 'dashboard',
        shortcut: ['s', 'w']
      }
    ]
  },
    {
    title: '合作夥伴',
    url: '/dashboard/partners',
    icon: 'user2',
    shortcut: ['v', 'v'],
    isActive: false,
    items: [
      {
        title: '儀表板',
        url: '/dashboard/partners?view=dashboard',
        icon: 'dashboard',
        shortcut: ['d', 'd']
      },
      {
        title: '合作夥伴',
        url: '/dashboard/partners?view=partners',
        icon: 'user',
        shortcut: ['p', 'p']
      },
      {
        title: '工作流程',
        url: '/dashboard/partners?view=workflows',
        icon: 'settings',
        shortcut: ['w', 'w']
      }
    ]
  },
  {
    title: '管理',
    url: '#',
    icon: 'billing',
    isActive: false,
    items: [
      {
        title: '人力資源🚧',
        url: '/dashboard/hr',
        icon: 'user',
        shortcut: ['h', 'r']
      },
      {
        title: '財務🚧',
        url: '/dashboard/finance',
        icon: 'billing',
        shortcut: ['f', 'n']
      },
      {
        title: '報表🚧',
        url: '/dashboard/reports',
        icon: 'dashboard',
        shortcut: ['r', 'p']
      }
    ]
  },
  {
    title: '通訊',
    url: '#',
    icon: 'post',
    isActive: false,
    items: [
      {
        title: '訊息🚧',
        url: '/dashboard/messages',
        icon: 'post',
        shortcut: ['m', 'g']
      },
      {
        title: '通知🚧',
        url: '/dashboard/notifications',
        icon: 'warning',
        shortcut: ['n', 't']
      },
      {
        title: '公告🚧',
        url: '/dashboard/announcements',
        icon: 'post',
        shortcut: ['a', 'n']
      },
      {
        title: '知識庫🚧',
        url: '/dashboard/knowledge',
        icon: 'page',
        shortcut: ['k', 'w']
      },
      {
        title: '日誌🚧',
        url: '/dashboard/logbook',
        icon: 'page',
        shortcut: ['l', 'b']
      }
    ]
  },
  {
    title: '分析與工具',
    url: '#',
    icon: 'dashboard',
    isActive: false,
    items: [
      {
        title: '分析🚧',
        url: '/dashboard/analytics',
        icon: 'dashboard',
        shortcut: ['a', 'l']
      },
      {
        title: '行事曆🚧',
        url: '/dashboard/calendar',
        icon: 'dashboard',
        shortcut: ['c', 'l']
      }
    ]
  },
  {
    title: '帳戶',
    url: '#',
    icon: 'user',
    isActive: false,
    items: [
      {
        title: '個人資料',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['p', 'f']
      },

      {
        title: '登入',
        shortcut: ['l', 'n'],
        url: '/dashboard/sign-in',
        icon: 'login'
      },
      {
        title: '設定🚧',
        url: '/dashboard/settings',
        icon: 'settings',
        shortcut: ['s', 'g']
      }
    ]
  },
  {
    title: '公開資訊',
    url: '#',
    icon: 'logo',
    isActive: false,
    items: [
      {
        title: '關於🚧',
        url: '/public/about',
        icon: 'help',
        shortcut: ['a', 'b']
      },
      {
        title: '部落格🚧',
        url: '/public/blog',
        icon: 'post',
        shortcut: ['b', 'l']
      },
      {
        title: '職缺🚧',
        url: '/public/careers',
        icon: 'user',
        shortcut: ['c', 'r']
      },
      {
        title: '案例研究🚧',
        url: '/public/case-studies',
        icon: 'post',
        shortcut: ['c', 's']
      },
      {
        title: '聯絡我們🚧',
        url: '/public/contact',
        icon: 'help',
        shortcut: ['c', 't']
      },
      {
        title: '法律🚧',
        url: '/public/legal',
        icon: 'post',
        shortcut: ['l', 'g']
      }
    ]
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
