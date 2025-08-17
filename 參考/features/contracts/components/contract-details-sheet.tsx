'use client';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
import type { ChangeOrder, Contract, Payment } from '../types';

interface ContractDetailsSheetProps {
  contract: Contract;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ContractDetailsSheet({ contract, isOpen, onOpenChange }: ContractDetailsSheetProps) {
  const totalPaid = contract.payments
    .filter((p) => p.status === 'Paid')
    .reduce((acc, p) => acc + p.amount, 0);
  const paymentProgress = (totalPaid / contract.totalValue) * 100;

  const getStatusVariant = (status: Payment['status'] | ChangeOrder['status']): 'default' | 'secondary' | 'outline' | 'destructive' => {
     switch (status) {
      case 'Paid':
      case 'Approved':
        return 'default';
      case 'Pending':
        return 'outline';
      case 'Overdue':
      case 'Rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl">
        <ScrollArea className="h-full pr-6">
          <SheetHeader className="mb-4">
            <SheetTitle>{contract.name}</SheetTitle>
            <SheetDescription>
              {contract.id} - {contract.client}
            </SheetDescription>
          </SheetHeader>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">詳情</TabsTrigger>
              <TabsTrigger value="payments">付款</TabsTrigger>
              <TabsTrigger value="changes">變更單</TabsTrigger>
              <TabsTrigger value="history">版本歷史</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">承包商</h3>
                      <p className="font-semibold">{contract.contractor}</p>
                    </div>
                     <div>
                      <h3 className="text-sm font-medium text-muted-foreground">客戶</h3>
                      <p className="font-semibold">{contract.client}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">開始日期</h3>
                      <p className="font-semibold">{formatDate(contract.startDate)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">結束日期</h3>
                      <p className="font-semibold">{formatDate(contract.endDate)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">合約總值</h3>
                      <p className="font-semibold">${contract.totalValue.toLocaleString()}</p>
                    </div>
                     <div>
                      <h3 className="text-sm font-medium text-muted-foreground">狀態</h3>
                      <Badge>{contract.status}</Badge>
                    </div>
                  </div>
                  <Separator />
                   <div>
                      <h3 className="text-sm font-medium text-muted-foreground">工作範圍</h3>
                      <p className="text-sm mt-1">{contract.scope}</p>
                    </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>付款追蹤</CardTitle>
                  <CardDescription>所有付款請求和狀態的記錄。</CardDescription>
                  <div className="pt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">已付款總額: ${totalPaid.toLocaleString()}</span>
                       <span className="text-sm font-medium">${contract.totalValue.toLocaleString()}</span>
                    </div>
                    <Progress value={paymentProgress} aria-label={`${paymentProgress.toFixed(0)}% 已付款`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>金額</TableHead>
                        <TableHead>請款日期</TableHead>
                         <TableHead>狀態</TableHead>
                        <TableHead>付款日期</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contract.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>${payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{formatDate(payment.requestDate)}</TableCell>
                          <TableCell><Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge></TableCell>
                          <TableCell>{payment.paidDate ? formatDate(payment.paidDate) : 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="changes" className="mt-4">
               <Card>
                <CardHeader>
                  <CardTitle>變更單</CardTitle>
                  <CardDescription>合約修改和修訂的管理。</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>標題</TableHead>
                        <TableHead>日期</TableHead>
                        <TableHead>狀態</TableHead>
                         <TableHead>成本影響</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contract.changeOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.title}</TableCell>
                           <TableCell>{formatDate(order.date)}</TableCell>
                           <TableCell><Badge variant={getStatusVariant(order.status)}>{order.status}</Badge></TableCell>
                          <TableCell>${order.impact.cost.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>版本歷史</CardTitle>
                  <CardDescription>合約版本的按時間順序記錄。</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                    {contract.versions.map((version, index) => (
                      <div key={version.version} className="grid grid-cols-[auto_1fr] items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            {version.version}
                          </div>
                          {index < contract.versions.length - 1 && <div className="h-10 w-px bg-border" />}
                        </div>
                        <div>
                          <p className="font-semibold">{formatDate(version.date)}</p>
                          <p className="text-sm text-muted-foreground">{version.changeSummary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
