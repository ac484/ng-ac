// 合約模組 Hooks 導出

// 原有 hooks
export { useContract, useContractStats, useContracts } from './use-contracts';

// Firebase + React Query hooks
export {
    useContract as useContractFirebase,
    useContractStats as useContractStatsFirebase, useContractsByStatus, useContracts as useContractsFirebase, useSearchContracts
} from './use-contracts-firebase';

// React Query mutations
export {
    useAddContractVersion, useCreateContract, useDeleteContract, useUpdateContract, useUpdateContractStatus
} from './use-contract-mutations';

