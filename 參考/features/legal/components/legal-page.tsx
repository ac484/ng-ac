import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconDownload, IconEye, IconFileText, IconGavel, IconLock, IconShield } from '@tabler/icons-react';

export default function LegalPage() {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">法律文件總覽</h1>
            <p className="text-muted-foreground">
              重要的法律文件和政策資訊
            </p>
          </div>
        </div>

        {/* Legal Notice */}
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <IconShield className="h-5 w-5" />
              重要聲明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
              本頁面包含重要的法律文件和政策資訊。請仔細閱讀並理解這些文件的內容。
              如有疑問，請聯絡我們的法律部門或尋求專業法律建議。
            </p>
          </CardContent>
        </Card>

        {/* Document Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconFileText className="h-5 w-5" />
                服務條款
              </CardTitle>
              <CardDescription>使用我們服務的條款和條件</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                詳細說明使用我們服務的權利、義務和限制條件
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <IconEye className="h-4 w-4 mr-2" />
                  查看
                </Button>
                <Button variant="outline" size="sm">
                  <IconDownload className="h-4 w-4 mr-2" />
                  下載
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconLock className="h-5 w-5" />
                隱私政策
              </CardTitle>
              <CardDescription>我們如何保護您的個人資訊</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                說明我們如何收集、使用和保護您的個人資料
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <IconEye className="h-4 w-4 mr-2" />
                  查看
                </Button>
                <Button variant="outline" size="sm">
                  <IconDownload className="h-4 w-4 mr-2" />
                  下載
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconGavel className="h-5 w-5" />
                法律聲明
              </CardTitle>
              <CardDescription>重要的法律聲明和免責條款</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                包含免責聲明、責任限制等重要的法律條款
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <IconEye className="h-4 w-4 mr-2" />
                  查看
                </Button>
                <Button variant="outline" size="sm">
                  <IconDownload className="h-4 w-4 mr-2" />
                  下載
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terms of Service */}
        <Card>
          <CardHeader>
            <CardTitle>服務條款</CardTitle>
            <CardDescription>使用我們服務的完整條款</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              服務條款功能開發中... 我們將提供完整的服務條款文件，包括服務內容、
              用戶責任、公司權利、爭議解決等條款，確保雙方權益得到保障。
            </p>
          </CardContent>
        </Card>

        {/* Privacy Policy */}
        <Card>
          <CardHeader>
            <CardTitle>隱私政策</CardTitle>
            <CardDescription>個人資料保護政策</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              隱私政策功能開發中... 我們將詳細說明如何收集、使用、儲存和保護
              您的個人資料，包括資料類型、使用目的、保護措施、您的權利等內容。
            </p>
          </CardContent>
        </Card>

        {/* Cookie Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Cookie 政策</CardTitle>
            <CardDescription>網站 Cookie 使用說明</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cookie 政策功能開發中... 我們將說明網站使用的 Cookie 類型、
              用途、有效期等資訊，以及如何管理和控制 Cookie 設定。
            </p>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>智慧財產權</CardTitle>
            <CardDescription>智慧財產權保護聲明</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              智慧財產權功能開發中... 我們將說明網站內容、商標、專利等
              智慧財產權的歸屬和使用限制，保護公司的智慧財產權。
            </p>
          </CardContent>
        </Card>

        {/* Contact Legal Department */}
        <Card>
          <CardHeader>
            <CardTitle>聯絡法律部門</CardTitle>
            <CardDescription>如有法律相關問題，請聯絡我們</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                如果您對任何法律文件有疑問，或需要進一步的法律協助，
                請聯絡我們的法律部門。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">法律部門</h4>
                  <p className="text-sm text-muted-foreground">legal@company.com</p>
                  <p className="text-sm text-muted-foreground">+886 2 1234 5684</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">營業時間</h4>
                  <p className="text-sm text-muted-foreground">週一至週五: 9:00 - 18:00</p>
                  <p className="text-sm text-muted-foreground">緊急情況: 24/7</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
