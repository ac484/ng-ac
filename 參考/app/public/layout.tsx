import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: '公共頁面 - 建築工程管理公司',
  description: '關於我們、部落格、職涯機會、案例研究、聯絡我們、法律條款等公共資訊'
};

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* Public page main content */}
          {children}
          {/* Public page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
