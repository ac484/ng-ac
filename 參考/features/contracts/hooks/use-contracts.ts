'use client';

import { useCallback, useEffect, useState } from 'react';
import { ContractService } from '../services/contract-service';
import type { Contract, ContractStats } from '../types';

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ContractService.getAllContracts();
      setContracts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取合約失敗');
    } finally {
      setLoading(false);
    }
  }, []);

  const createContract = useCallback(async (contractData: Omit<Contract, 'id' | 'versions'>) => {
    try {
      const newContract = await ContractService.createContract(contractData);
      setContracts(prev => [...prev, newContract]);
      return newContract;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '創建合約失敗');
    }
  }, []);

  const updateContract = useCallback(async (id: string, updates: Partial<Contract>) => {
    try {
      const updatedContract = await ContractService.updateContract(id, updates);
      if (updatedContract) {
        setContracts(prev => prev.map(c => c.id === id ? updatedContract : c));
      }
      return updatedContract;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '更新合約失敗');
    }
  }, []);

  const deleteContract = useCallback(async (id: string) => {
    try {
      const success = await ContractService.deleteContract(id);
      if (success) {
        setContracts(prev => prev.filter(c => c.id !== id));
      }
      return success;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : '刪除合約失敗');
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts,
    loading,
    error,
    refetch: fetchContracts,
    createContract,
    updateContract,
    deleteContract,
  };
}

export function useContractStats() {
  const [stats, setStats] = useState<ContractStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ContractService.getContractStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取統計數據失敗');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

export function useContract(id: string) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContract = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await ContractService.getContractById(id);
      setContract(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取合約失敗');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  return {
    contract,
    loading,
    error,
    refetch: fetchContract,
  };
}
