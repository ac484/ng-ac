import { PrismaClient } from '@prisma/client';
import type { ChangeOrder, Contract, ContractVersion, Payment } from '../types';

const prisma = new PrismaClient();

export class PrismaContractService {
  /**
   * 創建新合約
   */
  static async createContract(contractData: Omit<Contract, 'id' | 'versions'>): Promise<Contract> {
    const contract = await prisma.contract.create({
      data: {
        name: contractData.name,
        contractor: contractData.contractor,
        client: contractData.client,
        startDate: contractData.startDate,
        endDate: contractData.endDate,
        totalValue: contractData.totalValue,
        status: contractData.status,
        scope: contractData.scope,
        createdBy: contractData.createdBy,
        versions: {
          create: {
            version: 1,
            date: new Date(),
            changeSummary: '初始合約創建',
          },
        },
      },
      include: {
        versions: true,
        payments: true,
        changeOrders: true,
      },
    });

    return this.mapPrismaToContract(contract);
  }

  /**
   * 更新合約
   */
  static async updateContract(id: string, updates: Partial<Contract>): Promise<Contract | null> {
    // 過濾掉關聯模型，只保留基本字段
    const { payments, changeOrders, versions, ...basicUpdates } = updates;

    const contract = await prisma.contract.update({
      where: { id },
      data: {
        ...basicUpdates,
        updatedAt: new Date(),
      },
      include: {
        versions: true,
        payments: true,
        changeOrders: true,
      },
    });

    return this.mapPrismaToContract(contract);
  }

  /**
   * 刪除合約
   */
  static async deleteContract(id: string): Promise<boolean> {
    try {
      await prisma.contract.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('刪除合約失敗:', error);
      return false;
    }
  }

  /**
   * 根據 ID 獲取合約
   */
  static async getContractById(id: string): Promise<Contract | null> {
    try {
      const contract = await prisma.contract.findUnique({
        where: { id },
        include: {
          versions: true,
          payments: true,
          changeOrders: true,
        },
      });

      return contract ? this.mapPrismaToContract(contract) : null;
    } catch (error) {
      console.error('獲取合約失敗:', error);
      return null;
    }
  }

  /**
   * 獲取所有合約
   */
  static async getAllContracts(): Promise<Contract[]> {
    try {
      const contracts = await prisma.contract.findMany({
        include: {
          versions: true,
          payments: true,
          changeOrders: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return contracts.map(this.mapPrismaToContract);
    } catch (error) {
      console.error('獲取所有合約失敗:', error);
      return [];
    }
  }

  /**
   * 根據狀態獲取合約
   */
  static async getContractsByStatus(status: Contract['status']): Promise<Contract[]> {
    try {
      const contracts = await prisma.contract.findMany({
        where: { status },
        include: {
          versions: true,
          payments: true,
          changeOrders: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return contracts.map(this.mapPrismaToContract);
    } catch (error) {
      console.error('根據狀態獲取合約失敗:', error);
      return [];
    }
  }

  /**
   * 添加合約版本
   */
  static async addContractVersion(id: string, changeSummary: string): Promise<boolean> {
    try {
      const contract = await prisma.contract.findUnique({
        where: { id },
        include: { versions: true },
      });

      if (!contract) return false;

      const newVersion = contract.versions.length + 1;

      await prisma.contractVersion.create({
        data: {
          contractId: id,
          version: newVersion,
          date: new Date(),
          changeSummary,
        },
      });

      return true;
    } catch (error) {
      console.error('添加合約版本失敗:', error);
      return false;
    }
  }

  /**
   * 更新合約狀態
   */
  static async updateContractStatus(id: string, status: Contract['status']): Promise<boolean> {
    try {
      await prisma.contract.update({
        where: { id },
        data: {
          status,
          updatedAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      console.error('更新合約狀態失敗:', error);
      return false;
    }
  }

  /**
   * 搜索合約
   */
  static async searchContracts(searchTerm: string): Promise<Contract[]> {
    try {
      const contracts = await prisma.contract.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { contractor: { contains: searchTerm, mode: 'insensitive' } },
            { client: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        include: {
          versions: true,
          payments: true,
          changeOrders: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return contracts.map(this.mapPrismaToContract);
    } catch (error) {
      console.error('搜索合約失敗:', error);
      return [];
    }
  }

  /**
   * 獲取合約統計
   */
  static async getContractStats() {
    try {
      const [totalContracts, activeContracts, completedContracts, totalValue] = await Promise.all([
        prisma.contract.count(),
        prisma.contract.count({ where: { status: 'ACTIVE' } }),
        prisma.contract.count({ where: { status: 'COMPLETED' } }),
        prisma.contract.aggregate({
          _sum: { totalValue: true },
        }),
      ]);

      return {
        totalContracts,
        active: activeContracts,
        completed: completedContracts,
        totalValue: totalValue._sum.totalValue || 0,
      };
    } catch (error) {
      console.error('獲取合約統計失敗:', error);
      return {
        totalContracts: 0,
        active: 0,
        completed: 0,
        totalValue: 0,
      };
    }
  }

  /**
   * 更新合約付款記錄
   */
  static async updateContractPayments(contractId: string, paymentUpdates: Partial<Payment>[]): Promise<Contract | null> {
    try {
      // 先刪除現有付款記錄
      await prisma.payment.deleteMany({
        where: { contractId }
      });

      // 重新創建付款記錄
      if (paymentUpdates.length > 0) {
        const paymentData = paymentUpdates.map(payment => ({
          contractId,
          amount: payment.amount || 0,
          requestDate: payment.requestDate || new Date(),
          status: payment.status || 'PENDING',
          paidDate: payment.paidDate,
          createdAt: new Date()
        }));

        await prisma.payment.createMany({
          data: paymentData
        });
      }

      // 返回更新後的合約
      return this.getContractById(contractId);
    } catch (error) {
      console.error('更新合約付款記錄失敗:', error);
      return null;
    }
  }

  /**
   * 更新合約變更單
   */
  static async updateContractChangeOrders(contractId: string, changeOrderUpdates: Partial<ChangeOrder>[]): Promise<Contract | null> {
    try {
      // 先刪除現有變更單
      await prisma.changeOrder.deleteMany({
        where: { contractId }
      });

      // 重新創建變更單
      if (changeOrderUpdates.length > 0) {
        const changeOrderData = changeOrderUpdates.map(changeOrder => ({
          contractId,
          title: changeOrder.title || '',
          date: changeOrder.date || new Date(),
          status: changeOrder.status || 'PENDING',
          costImpact: changeOrder.impact?.cost || 0,
          scheduleImpact: changeOrder.impact?.schedule || 0,
          createdAt: new Date()
        }));

        await prisma.changeOrder.createMany({
          data: changeOrderData
        });
      }

      // 返回更新後的合約
      return this.getContractById(contractId);
    } catch (error) {
      console.error('更新合約變更單失敗:', error);
      return null;
    }
  }

  /**
   * 更新合約版本歷史
   */
  static async updateContractVersions(contractId: string, versionUpdates: Partial<ContractVersion>[]): Promise<Contract | null> {
    try {
      // 先刪除現有版本歷史
      await prisma.contractVersion.deleteMany({
        where: { contractId }
      });

      // 重新創建版本歷史
      if (versionUpdates.length > 0) {
        const versionData = versionUpdates.map(version => ({
          contractId,
          version: version.version || 1,
          date: version.date || new Date(),
          changeSummary: version.changeSummary || '',
          createdAt: new Date()
        }));

        await prisma.contractVersion.createMany({
          data: versionData
        });
      }

      // 返回更新後的合約
      return this.getContractById(contractId);
    } catch (error) {
      console.error('更新合約版本歷史失敗:', error);
      return null;
    }
  }

  /**
   * 批量更新合約及其關聯模型
   */
  static async updateContractWithRelations(
    id: string,
    updates: Partial<Contract>
  ): Promise<Contract | null> {
    try {
      const { payments, changeOrders, versions, ...basicUpdates } = updates;

      // 更新基本合約信息
      await prisma.contract.update({
        where: { id },
        data: {
          ...basicUpdates,
          updatedAt: new Date(),
        },
      });

      // 更新關聯模型
      if (payments !== undefined) {
        await this.updateContractPayments(id, payments);
      }

      if (changeOrders !== undefined) {
        await this.updateContractChangeOrders(id, changeOrders);
      }

      if (versions !== undefined) {
        await this.updateContractVersions(id, versions);
      }

      // 返回更新後的合約
      return this.getContractById(id);
    } catch (error) {
      console.error('批量更新合約失敗:', error);
      return null;
    }
  }

  /**
   * 將 Prisma 模型映射為合約類型
   */
  private static mapPrismaToContract(prismaContract: any): Contract {
    return {
      id: prismaContract.id,
      name: prismaContract.name,
      contractor: prismaContract.contractor,
      client: prismaContract.client,
      startDate: prismaContract.startDate,
      endDate: prismaContract.endDate,
      totalValue: prismaContract.totalValue,
      status: prismaContract.status,
      scope: prismaContract.scope,
      createdAt: prismaContract.createdAt,
      updatedAt: prismaContract.updatedAt,
      createdBy: prismaContract.createdBy,
      versions: prismaContract.versions?.map((v: any) => ({
        version: v.version,
        date: v.date,
        changeSummary: v.changeSummary,
      })) || [],
      payments: prismaContract.payments?.map((p: any) => ({
        id: p.id,
        amount: p.amount,
        requestDate: p.requestDate,
        status: p.status,
        paidDate: p.paidDate,
      })) || [],
      changeOrders: prismaContract.changeOrders?.map((c: any) => ({
        id: c.id,
        title: c.title,
        date: c.date,
        status: c.status,
        impact: {
          cost: c.costImpact,
          schedule: c.scheduleImpact,
        },
      })) || [],
    };
  }
}

