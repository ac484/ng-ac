/**
 * @ai-context {
 *   "role": "Domain/Repository",
 *   "purpose": "合約倉儲接口-合約數據存取抽象",
 *   "constraints": ["接口契約定義", "無實現細節", "領域語言"],
 *   "dependencies": ["Contract"],
 *   "security": "medium",
 *   "lastmod": "2025-01-18"
 * }
 * @usage contractRepo.getById(id), contractRepo.create(contract)
 * @see docs/architecture/domain.md
 */
import { Contract } from '../../shared/types';

export abstract class ContractRepository {
  abstract getAll(): Promise<Contract[]>;
  abstract getById(id: string): Promise<Contract | null>;
  abstract create(contract: Omit<Contract, 'id'>): Promise<Contract>;
  abstract update(id: string, updates: Partial<Contract>): Promise<Contract>;
  abstract delete(id: string): Promise<void>;
}
