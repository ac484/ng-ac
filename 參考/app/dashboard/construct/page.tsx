import { ContractLogo } from '@/features/contracts/components/contract-logo';
import { ContractsWrapper } from '@/features/contracts/components/contracts-wrapper';

export default function ConstructPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
        <ContractLogo />
      </header>
      <main className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">工程合約管理</h2>
        </div>
        <ContractsWrapper />
      </main>
    </div>
  );
}
