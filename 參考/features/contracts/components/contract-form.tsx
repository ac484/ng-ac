'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useContracts } from '../hooks/use-contracts';
import type { Contract } from '../types';

interface ContractFormProps {
  contract?: Contract;
  isEdit?: boolean;
}

export function ContractForm({ contract, isEdit = false }: ContractFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: contract?.name || '',
    contractor: contract?.contractor || '',
    client: contract?.client || '',
    startDate: contract?.startDate ? contract.startDate.toISOString().split('T')[0] : '',
    endDate: contract?.endDate ? contract.endDate.toISOString().split('T')[0] : '',
    totalValue: contract?.totalValue || 0,
    status: contract?.status || 'Active',
    scope: contract?.scope || '',
  });

  const { createContract, updateContract } = useContracts();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEdit && contract) {
        await updateContract(contract.id, {
          ...formData,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
        });
        toast({
          title: "合約更新成功",
          description: "合約已成功更新。",
        });
      } else {
        await createContract({
          ...formData,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
          payments: [],
          changeOrders: [],
          versions: [],
        });
        toast({
          title: "合約創建成功",
          description: "新合約已成功創建。",
        });
      }

      setIsOpen(false);
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "操作失敗",
        description: error instanceof Error ? error.message : "發生未知錯誤",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contractor: '',
      client: '',
      startDate: '',
      endDate: '',
      totalValue: 0,
      status: 'Active',
      scope: '',
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        {isEdit ? '編輯合約' : '新建合約'}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEdit ? '編輯合約' : '新建合約'}</DialogTitle>
            <DialogDescription>
              {isEdit ? '修改現有合約的詳細信息。' : '創建新的建築合約。'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">合約名稱 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="輸入合約名稱"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contractor">承包商 *</Label>
                <Input
                  id="contractor"
                  value={formData.contractor}
                  onChange={(e) => setFormData(prev => ({ ...prev, contractor: e.target.value }))}
                  placeholder="輸入承包商名稱"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">客戶 *</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                  placeholder="輸入客戶名稱"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">狀態</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Contract['status'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">進行中</SelectItem>
                    <SelectItem value="Completed">已完成</SelectItem>
                    <SelectItem value="On Hold">暫停</SelectItem>
                    <SelectItem value="Terminated">終止</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">開始日期 *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">結束日期 *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="totalValue">合約總值 *</Label>
              <Input
                id="totalValue"
                type="number"
                value={formData.totalValue}
                onChange={(e) => setFormData(prev => ({ ...prev, totalValue: Number(e.target.value) }))}
                placeholder="輸入合約金額"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <Label htmlFor="scope">工作範圍 *</Label>
              <Textarea
                id="scope"
                value={formData.scope}
                onChange={(e) => setFormData(prev => ({ ...prev, scope: e.target.value }))}
                placeholder="詳細描述工作範圍..."
                rows={4}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isEdit ? '更新合約' : '創建合約'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
