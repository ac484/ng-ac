'use client';

import { firestore } from '@/lib/firebase';
import { useCollectionQuery, useDocumentQuery } from '@tanstack-query-firebase/react/firestore';
import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import type { Contract, ContractStats } from '../types';

// 合約集合引用
const contractsCollection = collection(firestore, 'contracts');

// 獲取所有合約
export function useContracts() {
  const contractsQuery = query(
    contractsCollection,
    orderBy('createdAt', 'desc')
  );

  return useCollectionQuery(
    contractsQuery,
    {
      queryKey: ['contracts', 'all'],
      select: (snapshot) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Contract[]
    }
  );
}

// 根據狀態獲取合約
export function useContractsByStatus(status: Contract['status']) {
  const contractsQuery = query(
    contractsCollection,
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );

  return useCollectionQuery(
    contractsQuery,
    {
      queryKey: ['contracts', 'status', status],
      select: (snapshot) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Contract[]
    }
  );
}

// 獲取單個合約
export function useContract(id: string) {
  const docRef = doc(firestore, 'contracts', id);

  return useDocumentQuery(
    docRef,
    {
      queryKey: ['contracts', id],
      select: (snapshot) => {
        if (!snapshot.exists()) return null;
        return {
          id: snapshot.id,
          ...snapshot.data()
        } as Contract;
      }
    }
  );
}

// 獲取合約統計
export function useContractStats() {
  const { data: contracts, isLoading, error } = useContracts();

  if (isLoading || !contracts) {
    return {
      stats: null,
      loading: isLoading,
      error
    };
  }

  const stats: ContractStats = {
    totalContracts: contracts.length,
    active: contracts.filter(c => c.status === 'Active').length,
    completed: contracts.filter(c => c.status === 'Completed').length,
    totalValue: contracts.reduce((acc, c) => acc + c.totalValue, 0),
  };

  return {
    stats,
    loading: false,
    error: null
  };
}

// 搜索合約
export function useSearchContracts(searchTerm: string) {
  const { data: contracts, isLoading, error } = useContracts();

  if (isLoading || !contracts) {
    return {
      results: [],
      loading: isLoading,
      error
    };
  }

  const results = contracts.filter(contract =>
    contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    results,
    loading: false,
    error: null
  };
}
