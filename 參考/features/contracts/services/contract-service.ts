import type { Contract, ContractStats } from '../types';

export class ContractService {
  /**
   * 獲取所有合約
   */
  static async getAllContracts(): Promise<Contract[]> {
    // 這裡可以替換為實際的 API 調用
    // 目前使用模擬數據
    return [
      {
        id: 'CTR-001',
        name: '台北101大樓維修工程',
        contractor: '台北建設公司',
        client: '台北101管理委員會',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
        totalValue: 2500000,
        status: 'Active',
        scope: '大樓外牆維修、電梯系統升級、消防設備檢查',
        payments: [
          {
            id: 'PAY-001',
            amount: 500000,
            requestDate: new Date('2024-02-01'),
            status: 'Paid',
            paidDate: new Date('2024-02-15'),
          },
          {
            id: 'PAY-002',
            amount: 750000,
            requestDate: new Date('2024-03-01'),
            status: 'Pending',
          },
        ],
        changeOrders: [
          {
            id: 'CO-001',
            title: '增加隔音材料',
            date: new Date('2024-02-15'),
            status: 'Approved',
            impact: { cost: 50000, schedule: 5 },
          },
        ],
        versions: [
          {
            version: 1,
            date: new Date('2024-01-15'),
            changeSummary: '初始合約簽署',
          },
          {
            version: 2,
            date: new Date('2024-02-15'),
            changeSummary: '增加隔音材料變更單',
          },
        ],
      },
      {
        id: 'CTR-002',
        name: '台中商業大樓新建工程',
        contractor: '台中營造公司',
        client: '台中開發商',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2024-12-31'),
        totalValue: 5000000,
        status: 'Active',
        scope: '15層商業大樓新建，包含地下停車場',
        payments: [
          {
            id: 'PAY-003',
            amount: 1000000,
            requestDate: new Date('2023-10-01'),
            status: 'Paid',
            paidDate: new Date('2023-10-15'),
          },
          {
            id: 'PAY-004',
            amount: 1500000,
            requestDate: new Date('2024-01-01'),
            status: 'Paid',
            paidDate: new Date('2024-01-20'),
          },
        ],
        changeOrders: [],
        versions: [
          {
            version: 1,
            date: new Date('2023-09-01'),
            changeSummary: '初始合約簽署',
          },
        ],
      },
      {
        id: 'CTR-003',
        name: '高雄商務中心裝修工程',
        contractor: '高雄裝修公司',
        client: '高雄商務中心',
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-11-30'),
        totalValue: 800000,
        status: 'Completed',
        scope: '辦公室裝修、會議室設備安裝、網路系統佈線',
        payments: [
          {
            id: 'PAY-005',
            amount: 400000,
            requestDate: new Date('2023-07-01'),
            status: 'Paid',
            paidDate: new Date('2023-07-15'),
          },
          {
            id: 'PAY-006',
            amount: 400000,
            requestDate: new Date('2023-09-01'),
            status: 'Paid',
            paidDate: new Date('2023-09-20'),
          },
        ],
        changeOrders: [
          {
            id: 'CO-002',
            title: '增加智能照明系統',
            date: new Date('2023-08-01'),
            status: 'Approved',
            impact: { cost: 30000, schedule: 3 },
          },
        ],
        versions: [
          {
            version: 1,
            date: new Date('2023-06-01'),
            changeSummary: '初始合約簽署',
          },
          {
            version: 2,
            date: new Date('2023-08-01'),
            changeSummary: '增加智能照明系統變更單',
          },
        ],
      },
    ];
  }

  /**
   * 獲取合約統計數據
   */
  static async getContractStats(): Promise<ContractStats> {
    const contracts = await this.getAllContracts();

    return {
      totalContracts: contracts.length,
      active: contracts.filter(c => c.status === 'Active').length,
      completed: contracts.filter(c => c.status === 'Completed').length,
      totalValue: contracts.reduce((acc, c) => acc + c.totalValue, 0),
    };
  }

  /**
   * 根據 ID 獲取合約
   */
  static async getContractById(id: string): Promise<Contract | null> {
    const contracts = await this.getAllContracts();
    return contracts.find(c => c.id === id) || null;
  }

  /**
   * 創建新合約
   */
  static async createContract(contractData: Omit<Contract, 'id' | 'versions'>): Promise<Contract> {
    const newContract: Contract = {
      ...contractData,
      id: `CTR-${Date.now()}`,
      versions: [
        {
          version: 1,
          date: new Date(),
          changeSummary: '初始合約創建',
        },
      ],
    };

    // 這裡應該調用 API 來保存合約
    console.log('創建新合約:', newContract);
    return newContract;
  }

  /**
   * 更新合約
   */
  static async updateContract(id: string, updates: Partial<Contract>): Promise<Contract | null> {
    const contract = await this.getContractById(id);
    if (!contract) return null;

    const updatedContract: Contract = {
      ...contract,
      ...updates,
      versions: [
        ...contract.versions,
        {
          version: contract.versions.length + 1,
          date: new Date(),
          changeSummary: '合約更新',
        },
      ],
    };

    // 這裡應該調用 API 來更新合約
    console.log('更新合約:', updatedContract);
    return updatedContract;
  }

  /**
   * 刪除合約
   */
  static async deleteContract(id: string): Promise<boolean> {
    // 這裡應該調用 API 來刪除合約
    console.log('刪除合約:', id);
    return true;
  }
}
