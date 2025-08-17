'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Download, Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useContracts } from '../hooks/use-contracts';
import type { Contract } from '../types';
import { ContractDetailsSheet } from './contract-details-sheet';

export function ContractsTable() {
  const { contracts, loading, deleteContract } = useContracts();
  const [selectedContract, setSelectedContract] = React.useState<Contract | null>(null);
  const [isSheetOpen, setSheetOpen] = React.useState(false);

  const handleViewDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedContract(null);
    }
  };

  const handleEdit = (contract: Contract) => {
    // TODO: 實現編輯功能
    console.log('編輯合約:', contract);
  };

  const handleDelete = async (contract: Contract) => {
    if (confirm(`確定要刪除合約 "${contract.name}" 嗎？`)) {
      try {
        await deleteContract(contract.id);
      } catch (error) {
        console.error('刪除合約失敗:', error);
      }
    }
  };

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Contractor', 'Client', 'Start Date', 'End Date', 'Total Value', 'Status'];
    const rows = contracts.map(c => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.contractor.replace(/"/g, '""')}"`,
      `"${c.client.replace(/"/g, '""')}"`,
      c.startDate.toISOString().split('T')[0],
      c.endDate.toISOString().split('T')[0],
      c.totalValue,
      c.status,
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'contracts_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusVariant = (status: Contract['status']): 'default' | 'secondary' | 'outline' | 'destructive' => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Completed':
        return 'secondary';
      case 'On Hold':
        return 'outline';
      case 'Terminated':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>合約列表</CardTitle>
          <CardDescription>載入中...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>合約列表</CardTitle>
            <CardDescription>所有進行中和已完成的建築合約概覽。</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            匯出 CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>合約名稱</TableHead>
                <TableHead className="hidden md:table-cell">承包商</TableHead>
                <TableHead className="hidden lg:table-cell">結束日期</TableHead>
                <TableHead>價值</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead><span className="sr-only">操作</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id} className="cursor-pointer" onClick={() => handleViewDetails(contract)}>
                  <TableCell className="font-medium">{contract.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{contract.contractor}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDate(contract.endDate)}
                  </TableCell>
                  <TableCell>
                    ${contract.totalValue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(contract.status)}>{contract.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">切換選單</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onSelect={() => handleViewDetails(contract)}>
                          <Eye className="mr-2 h-4 w-4" />
                          查看詳情
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleEdit(contract)}>
                          <Edit className="mr-2 h-4 w-4" />
                          編輯
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDelete(contract)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          刪除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedContract && (
        <ContractDetailsSheet
          contract={selectedContract}
          isOpen={isSheetOpen}
          onOpenChange={handleSheetOpenChange}
        />
      )}
    </>
  );
}
