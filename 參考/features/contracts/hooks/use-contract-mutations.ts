'use client';

import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FirebaseContractService } from '../services/firebase-contract-service';
import type { Contract } from '../types';

export function useCreateContract() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (contractData: Omit<Contract, 'id' | 'versions'>) =>
      FirebaseContractService.createContract(contractData),
    onSuccess: (newContract) => {
      // 樂觀更新：立即添加到緩存
      queryClient.setQueryData(['contracts', 'all'], (oldData: Contract[] | undefined) => {
        if (!oldData) return [newContract];
        return [newContract, ...oldData];
      });

      // 更新統計數據
      queryClient.invalidateQueries({ queryKey: ['contracts', 'stats'] });

      toast({
        title: "合約創建成功",
        description: "新合約已成功創建。",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "創建失敗",
        description: error instanceof Error ? error.message : "發生未知錯誤",
      });
    },
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Contract> }) =>
      FirebaseContractService.updateContract(id, updates),
    onSuccess: (updatedContract, { id }) => {
      if (updatedContract) {
        // 更新單個合約緩存
        queryClient.setQueryData(['contracts', id], updatedContract);

        // 更新合約列表緩存
        queryClient.setQueryData(['contracts', 'all'], (oldData: Contract[] | undefined) => {
          if (!oldData) return [updatedContract];
          return oldData.map(contract =>
            contract.id === id ? updatedContract : contract
          );
        });

        // 更新相關查詢
        queryClient.invalidateQueries({ queryKey: ['contracts', 'all'] });
        queryClient.invalidateQueries({ queryKey: ['contracts', 'stats'] });
      }

      toast({
        title: "合約更新成功",
        description: "合約已成功更新。",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "更新失敗",
        description: error instanceof Error ? error.message : "發生未知錯誤",
      });
    },
  });
}

export function useDeleteContract() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => FirebaseContractService.deleteContract(id),
    onSuccess: (success, deletedId) => {
      if (success) {
        // 從緩存中移除合約
        queryClient.setQueryData(['contracts', 'all'], (oldData: Contract[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(contract => contract.id !== deletedId);
        });

        // 移除單個合約緩存
        queryClient.removeQueries({ queryKey: ['contracts', deletedId] });

        // 更新統計數據
        queryClient.invalidateQueries({ queryKey: ['contracts', 'stats'] });
      }

      toast({
        title: "合約刪除成功",
        description: "合約已成功刪除。",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "刪除失敗",
        description: error instanceof Error ? error.message : "發生未知錯誤",
      });
    },
  });
}

export function useUpdateContractStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Contract['status'] }) =>
      FirebaseContractService.updateContractStatus(id, status),
    onSuccess: (success, { id, status }) => {
      if (success) {
        // 樂觀更新狀態
        queryClient.setQueryData(['contracts', id], (oldData: Contract | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, status };
        });

        // 更新合約列表緩存
        queryClient.setQueryData(['contracts', 'all'], (oldData: Contract[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map(contract =>
            contract.id === id ? { ...contract, status } : contract
          );
        });

        // 更新相關查詢
        queryClient.invalidateQueries({ queryKey: ['contracts', 'all'] });
        queryClient.invalidateQueries({ queryKey: ['contracts', 'stats'] });
      }

      toast({
        title: "狀態更新成功",
        description: `合約狀態已更新為 ${status}。`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "狀態更新失敗",
        description: error instanceof Error ? error.message : "發生未知錯誤",
      });
    },
  });
}

export function useAddContractVersion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, changeSummary }: { id: string; changeSummary: string }) =>
      FirebaseContractService.addContractVersion(id, changeSummary),
    onSuccess: (success, { id }) => {
      if (success) {
        // 更新相關查詢
        queryClient.invalidateQueries({ queryKey: ['contracts', id] });
        queryClient.invalidateQueries({ queryKey: ['contracts', 'all'] });
      }

      toast({
        title: "版本添加成功",
        description: "合約版本已成功添加。",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "版本添加失敗",
        description: error instanceof Error ? error.message : "發生未知錯誤",
      });
    },
  });
}
