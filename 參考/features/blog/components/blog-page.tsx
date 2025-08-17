import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconArticle, IconCalendar, IconSearch, IconTag, IconUser } from '@tabler/icons-react';

export default function BlogPage() {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">部落格/新聞中心</h1>
            <p className="text-muted-foreground">
              分享最新的工程技術、行業動態和公司資訊
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconSearch className="h-5 w-5" />
              搜尋文章
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="搜尋文章標題、內容或標籤..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button className="shrink-0">
                <IconSearch className="h-4 w-4 mr-2" />
                搜尋
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                全部
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                工程技術
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                行業動態
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                公司新聞
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Featured Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconArticle className="h-5 w-5" />
              精選文章
            </CardTitle>
            <CardDescription>最新發布的重要文章</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              精選文章功能開發中... 我們將展示最新的工程技術文章、行業分析報告、
              項目案例分享等內容，為讀者提供有價值的資訊和見解。
            </p>
          </CardContent>
        </Card>

        {/* Article Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconTag className="h-5 w-5" />
                工程技術
              </CardTitle>
              <CardDescription>最新的工程技術和創新方法</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                涵蓋建築工程、施工技術、品質管理等方面的專業文章
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                行業動態
              </CardTitle>
              <CardDescription>建築行業的最新發展趨勢</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                市場分析、政策解讀、行業趨勢等相關內容
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUser className="h-5 w-5" />
                公司新聞
              </CardTitle>
              <CardDescription>公司的最新動態和成就</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                項目完成、團隊擴展、榮譽獎項等公司相關資訊
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Article List */}
        <Card>
          <CardHeader>
            <CardTitle>文章列表</CardTitle>
            <CardDescription>所有已發布的文章</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              文章列表功能開發中... 我們將提供完整的文章目錄，包括標題、摘要、
              發布時間、作者、標籤等資訊，方便讀者快速找到感興趣的內容。
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
