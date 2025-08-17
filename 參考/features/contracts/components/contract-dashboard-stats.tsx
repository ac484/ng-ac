import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Briefcase, CheckCircle, CircleDollarSign, Clock } from 'lucide-react';
import type { ContractStats } from '../types';

interface ContractDashboardStatsProps {
  stats: ContractStats;
}

export function ContractDashboardStats({ stats }: ContractDashboardStatsProps) {
  const { totalContracts, active, completed, totalValue } = stats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">總合約數</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalContracts}</div>
          <p className="text-xs text-muted-foreground">所有註冊的合約</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">進行中合約</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{active}</div>
          <p className="text-xs text-muted-foreground">目前進行中的專案</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">已完成合約</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completed}</div>
          <p className="text-xs text-muted-foreground">成功完成的專案</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">合約總價值</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(totalValue)}
          </div>
          <p className="text-xs text-muted-foreground">所有合約的總價值</p>
        </CardContent>
      </Card>
    </div>
  );
}
