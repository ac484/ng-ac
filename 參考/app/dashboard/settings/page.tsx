import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IndependentSidebarSettings } from '@/features/settings/components/independent-sidebar-settings';
import { SidebarEnhancer } from '@/features/settings/enhancers/sidebar-enhancer';
import { IconBell, IconGlobe, IconPalette, IconSettings } from '@tabler/icons-react';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <IconSettings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">系統設置</h1>
          <p className="text-muted-foreground">管理應用程序設置和偏好</p>
        </div>
      </div>

      {/* 使用側邊欄增強器包裝整個設置頁面 */}
      <SidebarEnhancer>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 側邊欄設置 - 使用獨立系統 */}
          <div className="lg:col-span-2">
            <IndependentSidebarSettings />
          </div>

          {/* 其他設置選項 */}
          <div className="space-y-6">
            {/* 主題設置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <IconPalette className="h-5 w-5" />
                  <span>主題設置</span>
                </CardTitle>
                <CardDescription>
                  選擇您喜歡的界面主題
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  主題設置功能將在後續版本中實現
                </p>
              </CardContent>
            </Card>

            {/* 通知設置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <IconBell className="h-5 w-5" />
                  <span>通知設置</span>
                </CardTitle>
                <CardDescription>
                  管理通知偏好設置
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  通知設置功能將在後續版本中實現
                </p>
              </CardContent>
            </Card>

            {/* 語言設置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <IconGlobe className="h-5 w-5" />
                  <span>語言設置</span>
                </CardTitle>
                <CardDescription>
                  選擇界面語言
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  語言設置功能將在後續版本中實現
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarEnhancer>
    </div>
  );
}
