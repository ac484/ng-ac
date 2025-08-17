import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconBriefcase, IconBuilding, IconSchool, IconUsers } from '@tabler/icons-react';

export default function CareersPage() {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">人才招募</h1>
            <p className="text-muted-foreground">
              加入我們的團隊，一起建設更美好的未來
            </p>
          </div>
        </div>

        {/* Company Culture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBuilding className="h-5 w-5" />
              企業文化
            </CardTitle>
            <CardDescription>我們重視人才，提供良好的發展環境</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              我們相信優秀的人才是公司最寶貴的資產。我們提供具有競爭力的薪酬福利、
              完善的培訓體系、清晰的職業發展路徑，以及充滿活力的工作環境。
              在這裡，每個人都能發揮自己的潛能，實現職業理想。
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">專業培訓</Badge>
              <Badge variant="secondary">職業發展</Badge>
              <Badge variant="secondary">團隊合作</Badge>
              <Badge variant="secondary">創新文化</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Job Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconSchool className="h-5 w-5" />
                工程師
              </CardTitle>
              <CardDescription>各類工程技術崗位</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                結構工程師、機電工程師、土木工程師等專業技術崗位
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUsers className="h-5 w-5" />
                項目管理
              </CardTitle>
              <CardDescription>項目管理和協調崗位</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                項目經理、施工經理、品質經理等管理崗位
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBriefcase className="h-5 w-5" />
                行政支援
              </CardTitle>
              <CardDescription>行政和支援崗位</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                人力資源、財務、行政等支援崗位
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Openings */}
        <Card>
          <CardHeader>
            <CardTitle>當前職缺</CardTitle>
            <CardDescription>我們正在招募的職位</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              職缺列表功能開發中... 我們將展示所有正在招募的職位，包括職位描述、
              要求條件、工作地點、薪資範圍等詳細資訊，並提供便捷的申請流程。
            </p>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>員工福利</CardTitle>
            <CardDescription>我們為員工提供的福利待遇</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">薪酬福利</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 具有競爭力的基本薪資</li>
                  <li>• 績效獎金和年終獎金</li>
                  <li>• 五險一金和補充醫療保險</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">發展機會</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 專業技能培訓</li>
                  <li>• 職業發展規劃</li>
                  <li>• 內部晉升機會</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Process */}
        <Card>
          <CardHeader>
            <CardTitle>申請流程</CardTitle>
            <CardDescription>如何加入我們的團隊</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              申請流程功能開發中... 我們將提供清晰的申請步驟指引，包括簡歷投遞、
              面試安排、錄用通知等環節，讓求職者了解整個招聘流程。
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
