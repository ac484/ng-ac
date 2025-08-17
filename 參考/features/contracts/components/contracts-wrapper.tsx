'use client';

import { useContractStats } from '../hooks/use-contracts';
import { ContractAiSummarizer } from './contract-ai-summarizer';
import { ContractDashboardStats } from './contract-dashboard-stats';
import { ContractForm } from './contract-form';
import { ContractsTable } from './contracts-table';

export function ContractsWrapper() {
  const { stats, loading } = useContractStats();

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded" />
          ))}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ContractDashboardStats stats={stats} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">合約管理</h2>
        <div className="flex gap-2">
          <ContractForm />
          <ContractAiSummarizer />
        </div>
      </div>
      <ContractsTable />
    </div>
  );
}
