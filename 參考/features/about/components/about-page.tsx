import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconAward, IconBuilding, IconTarget, IconUsers } from '@tabler/icons-react';

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">關於我們</h1>
            <p className="text-muted-foreground">
              專注於建築工程管理，為客戶提供專業的解決方案
            </p>
          </div>
        </div>

        {/* Company Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBuilding className="h-5 w-5" />
              公司簡介
            </CardTitle>
            <CardDescription>
              我們是一家專業的建築工程管理公司，致力於提供高品質的工程服務
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              成立於2020年，我們專注於建築工程項目的全生命週期管理，從規劃設計到施工完成，
              為客戶提供一站式服務。我們的團隊由經驗豐富的工程師、項目經理和專業技術人員組成，
              確保每個項目都能按時、按質、按預算完成。
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">工程管理</Badge>
              <Badge variant="secondary">項目規劃</Badge>
              <Badge variant="secondary">品質控制</Badge>
              <Badge variant="secondary">成本管理</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconTarget className="h-5 w-5" />
                企業使命
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                通過創新的工程管理方法和先進的技術手段，為客戶創造價值，
                推動建築行業的可持續發展，建設更美好的城市環境。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconAward className="h-5 w-5" />
                企業願景
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                成為建築工程管理領域的領導者，以卓越的服務品質和專業能力，
                贏得客戶信賴，實現企業與社會的共同發展。
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUsers className="h-5 w-5" />
              專業團隊
            </CardTitle>
            <CardDescription>
              我們的團隊由各領域的專業人才組成
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              團隊功能開發中... 我們將展示專業的工程師、項目經理和技術專家團隊，
              他們擁有豐富的行業經驗和專業知識，能夠為客戶提供最優質的服務。
            </p>
          </CardContent>
        </Card>

        {/* Development Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>發展歷程</CardTitle>
            <CardDescription>公司的重要發展里程碑</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              發展歷程功能開發中... 我們將展示公司從成立至今的重要發展階段，
              包括重大項目完成、技術突破、團隊擴展等關鍵時刻。
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
