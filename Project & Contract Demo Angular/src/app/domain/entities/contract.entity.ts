/**
 * @ai-context {
 *   "role": "Domain/Entity",
 *   "purpose": "合約實體-合約核心業務邏輯",
 *   "constraints": ["無外部服務依賴", "業務規則內部封裝", "聚合一致性"],
 *   "dependencies": ["Payment", "ChangeOrder", "ContractVersion"],
 *   "security": "high",
 *   "lastmod": "2025-08-19"
 * }
 * @usage Contract.create(data), contract.addPayment(payment)
 * @see docs/architecture/domain.md
 */
import { ChangeOrder, Contract, ContractStatus, ContractVersion, Payment } from '@shared/types';

export class ContractEntity implements Contract {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly contractor: string,
    public readonly client: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly totalValue: number,
    public readonly status: ContractStatus,
    public readonly scope: string,
    public readonly payments: Payment[] = [],
    public readonly changeOrders: ChangeOrder[] = [],
    public readonly versions: ContractVersion[] = []
  ) {}

  static create(data: Omit<Contract, 'payments' | 'changeOrders' | 'versions'>): ContractEntity {
    return new ContractEntity(
      data.id,
      data.name,
      data.contractor,
      data.client,
      data.startDate,
      data.endDate,
      data.totalValue,
      data.status,
      data.scope
    );
  }

  getTotalPaid(): number {
    return this.payments
      .filter(payment => payment.status === 'Paid')
      .reduce((sum, payment) => sum + payment.amount, 0);
  }

  getPaymentProgress(): number {
    const totalPaid = this.getTotalPaid();
    return Math.round((totalPaid / this.totalValue) * 100);
  }

  getPendingPayments(): Payment[] {
    return this.payments.filter(payment => payment.status === 'Pending');
  }

  getOverduePayments(): Payment[] {
    return this.payments.filter(payment => payment.status === 'Overdue');
  }

  getTotalChangeOrderImpact(): number {
    return this.changeOrders
      .filter(order => order.status === 'Approved')
      .reduce((sum, order) => sum + order.impact.cost, 0);
  }

  getLatestVersion(): ContractVersion | undefined {
    return this.versions.sort((a, b) => b.version - a.version)[0];
  }

  isActive(): boolean {
    return this.status === 'Active';
  }

  isCompleted(): boolean {
    return this.status === 'Completed';
  }
}
