import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconAward, IconBuilding, IconTarget, IconUsers } from '@tabler/icons-react';

export default function CaseStudiesPage() {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">成功案例/客戶故事</h1>
            <p className="text-muted-foreground">
              展示我們的專業能力和項目成果
            </p>
          </div>
        </div>

        {/* Featured Case Study */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconAward className="h-5 w-5 text-primary" />
              精選案例
            </CardTitle>
            <CardDescription>最具代表性的成功項目</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              精選案例功能開發中... 我們將展示最具代表性的成功項目，包括項目背景、
              解決方案、實施過程、最終成果等詳細資訊，體現我們的專業能力和服務品質。
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">商業建築</Badge>
              <Badge variant="outline">住宅項目</Badge>
              <Badge variant="outline">基礎設施</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Project Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBuilding className="h-5 w-5" />
                商業建築
              </CardTitle>
              <CardDescription>辦公大樓、商場、酒店等</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                涵蓋各類商業建築項目，展示我們的設計理念和施工技術
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUsers className="h-5 w-5" />
                住宅項目
              </CardTitle>
              <CardDescription>公寓、別墅、社區等</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                各類住宅項目案例，體現我們對居住品質的追求
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconTarget className="h-5 w-5" />
                基礎設施
              </CardTitle>
              <CardDescription>道路、橋樑、公共設施等</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                基礎設施建設項目，展示我們的工程實力和管理能力
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Case Study List */}
        <Card>
          <CardHeader>
            <CardTitle>案例列表</CardTitle>
            <CardDescription>所有已完成的項目案例</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              案例列表功能開發中... 我們將提供完整的項目案例目錄，包括項目名稱、
              類型、規模、完成時間、客戶評價等資訊，方便客戶了解我們的服務能力。
            </p>
          </CardContent>
        </Card>

        {/* Project Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">150+</CardTitle>
              <CardDescription>完成項目</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">98%</CardTitle>
              <CardDescription>客戶滿意度</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">5年+</CardTitle>
              <CardDescription>平均經驗</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">24/7</CardTitle>
              <CardDescription>服務支援</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Client Testimonials */}
        <Card>
          <CardHeader>
            <CardTitle>客戶評價</CardTitle>
            <CardDescription>客戶對我們服務的評價和反饋</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              客戶評價功能開發中... 我們將展示真實的客戶反饋和評價，包括項目完成後的
              滿意度調查、客戶推薦信、合作夥伴評價等，讓潛在客戶了解我們的服務品質。
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
