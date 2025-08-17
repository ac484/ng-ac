import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IconBuilding, IconClock, IconMail, IconMapPin, IconPhone, IconSend } from '@tabler/icons-react';

export default function ContactPage() {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">聯絡我們</h1>
            <p className="text-muted-foreground">
              我們隨時準備為您提供專業的服務和支援
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconMail className="h-5 w-5" />
                電子郵件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">info@company.com</p>
              <p className="text-sm text-muted-foreground">support@company.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPhone className="h-5 w-5" />
                電話號碼
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">+886 2 1234 5678</p>
              <p className="text-sm text-muted-foreground">+886 2 1234 5679</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconClock className="h-5 w-5" />
                營業時間
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">週一至週五: 9:00 - 18:00</p>
              <p className="text-sm text-muted-foreground">週六: 9:00 - 12:00</p>
            </CardContent>
          </Card>
        </div>

        {/* Office Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMapPin className="h-5 w-5" />
              辦公室地址
            </CardTitle>
            <CardDescription>我們的辦公地點</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">台北總部</h4>
                <p className="text-sm text-muted-foreground">
                  台北市信義區信義路五段7號<br />
                  台北101大樓 89樓
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">台中分公司</h4>
                <p className="text-sm text-muted-foreground">
                  台中市西區台灣大道二段2號<br />
                  台中商業大樓 15樓
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">高雄分公司</h4>
                <p className="text-sm text-muted-foreground">
                  高雄市前金區中正路123號<br />
                  高雄商務中心 8樓
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconSend className="h-5 w-5" />
              聯絡表單
            </CardTitle>
            <CardDescription>填寫表單，我們會盡快回覆您</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">姓名 *</label>
                  <Input placeholder="請輸入您的姓名" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">公司名稱</label>
                  <Input placeholder="請輸入公司名稱" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">電子郵件 *</label>
                  <Input type="email" placeholder="請輸入電子郵件" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">電話號碼</label>
                  <Input placeholder="請輸入電話號碼" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">聯絡主題 *</label>
                <Input placeholder="請輸入聯絡主題" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">訊息內容 *</label>
                <Textarea
                  placeholder="請詳細描述您的需求或問題..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              <Button className="w-full">
                <IconSend className="h-4 w-4 mr-2" />
                發送訊息
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Department Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBuilding className="h-5 w-5" />
              部門聯絡方式
            </CardTitle>
            <CardDescription>根據您的需求選擇合適的聯絡部門</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">業務洽談</h4>
                <p className="text-sm text-muted-foreground">sales@company.com</p>
                <p className="text-sm text-muted-foreground">+886 2 1234 5680</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">技術支援</h4>
                <p className="text-sm text-muted-foreground">tech@company.com</p>
                <p className="text-sm text-muted-foreground">+886 2 1234 5681</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">人力資源</h4>
                <p className="text-sm text-muted-foreground">hr@company.com</p>
                <p className="text-sm text-muted-foreground">+886 2 1234 5682</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">媒體聯絡</h4>
                <p className="text-sm text-muted-foreground">media@company.com</p>
                <p className="text-sm text-muted-foreground">+886 2 1234 5683</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>地圖位置</CardTitle>
            <CardDescription>我們的辦公室位置</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              地圖功能開發中... 我們將整合地圖服務，顯示各辦公室的具體位置，
              包括交通路線、停車資訊、周邊設施等，方便客戶前來拜訪。
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
