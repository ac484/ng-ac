# Implementation Plan

- [x] 1. 建立完整的目录结构和基础接口








  - 创建符合 tree.md 定义的完整目录结构
  - 定义各层之间的核心接口和抽象类
  - 建立依赖注入的基础配置
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. 重构 Domain 层实现纯业务逻辑




- [x] 2.1 创建领域实体和聚合根




  - 实现 ContractAggregate 类，包含完整的业务逻辑和不变量
  - 创建 ContractEntity、ContractVersionEntity 等核心实体
  - 实现聚合根的事件发布机制
  - _Requirements: 1.1, 1.4_


- [x] 2.2 实现值对象和领域服务

  - 重构现有的值对象，确保不可变性和验证逻辑
  - 实现 ContractDomainService、ContractValidationService 等领域服务
  - 创建业务规范和策略类
  - _Requirements: 1.1, 1.3_

- [x] 2.3 定义仓储接口和领域事件


  - 创建 ContractRepository、ContractVersionRepository 等仓储接口
  - 定义领域事件类：ContractCreatedEvent、ContractApprovedEvent 等
  - 实现工厂模式用于实体创建
  - _Requirements: 1.1, 1.3_

- [x] 3. 重构 Application 层协调业务用例




- [x] 3.1 实现用例类和命令查询分离


  - 创建 CreateContractUseCase、UpdateContractUseCase 等用例类
  - 实现 CQRS 模式的命令和查询处理器
  - 建立用例之间的协调机制
  - _Requirements: 2.1, 2.2, 2.5_

- [x] 3.2 创建 DTO 和映射器


  - 定义数据传输对象用于层间通信
  - 实现 ContractMapper、ContractVersionMapper 等映射器
  - 确保 DTO 不包含业务逻辑，只用于数据传输
  - _Requirements: 2.1, 2.4_

- [x] 3.3 实现应用服务和事件处理器


  - 创建 ContractApplicationService 协调多个用例
  - 实现事件处理器处理领域事件
  - 建立事务管理和工作单元模式
  - _Requirements: 2.1, 2.3_

- [x] 4. 重构 Infrastructure 层实现技术细节




- [x] 4.1 实现仓储模式的具体实现






  - 创建 ContractFirestoreRepository 实现 ContractRepository 接口
  - 实现数据库模型和领域模型之间的映射
  - 建立数据库连接和事务管理
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 4.2 集成外部服务和适配器


  - 实现通知服务、审计服务等外部服务适配器
  - 创建消息队列和事件发布机制
  - 建立缓存和安全服务的实现
  - _Requirements: 3.1, 3.4, 3.5_

- [x] 4.3 配置管理和环境设置


  - 实现环境配置管理，支持开发、测试、生产环境
  - 创建依赖注入的配置文件
  - 建立数据库迁移和种子数据机制
  - _Requirements: 3.1, 3.5_

- [ ] 5. 重构 Presentation 层处理用户交互
- [ ] 5.1 重构页面组件和控制器
  - 重构现有的页面组件，确保只依赖 Application 层
  - 实现控制器类处理 HTTP 请求
  - 建立路由配置和导航机制
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5.2 实现中间件和守卫
  - 创建认证、授权、验证等中间件
  - 实现路由守卫和权限检查
  - 建立错误处理和日志记录机制
  - _Requirements: 4.1, 4.4_

- [ ] 5.3 优化表现层适配器
  - 重构 ContractPresentationAdapter，确保正确的依赖关系
  - 实现视图模型和数据绑定
  - 建立客户端状态管理
  - _Requirements: 4.1, 4.2, 4.5_

- [ ] 6. 重构 Shared 层提供通用功能
- [ ] 6.1 清理共享类型和工具函数
  - 移除 shared 层对 domain 层的依赖
  - 重构通用类型定义，确保不包含业务逻辑
  - 实现通用工具函数和验证器
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 6.2 实现异常处理和装饰器
  - 创建统一的异常处理机制
  - 实现通用装饰器用于日志、缓存、验证等
  - 建立管道和过滤器的通用实现
  - _Requirements: 5.1, 5.4, 5.5_

- [ ] 7. 建立依赖检查和架构合规性验证
- [ ] 7.1 实现自动化依赖检查工具
  - 创建脚本检查各层之间的依赖关系
  - 实现 ESLint 规则防止依赖违规
  - 建立 CI/CD 中的架构合规性检查
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 7.2 建立架构文档和验证机制
  - 创建架构决策记录（ADR）
  - 实现架构合规性的自动化测试
  - 建立代码审查的架构检查清单
  - _Requirements: 6.1, 6.5_

- [ ] 8. 迁移现有代码到新架构
- [ ] 8.1 分析和映射现有代码
  - 分析现有代码的功能和依赖关系
  - 创建代码迁移映射表
  - 识别需要重构的关键组件
  - _Requirements: 7.1, 7.3_

- [ ] 8.2 执行代码迁移和路径更新
  - 移动文件到正确的目录结构
  - 更新所有导入路径和依赖引用
  - 重构违反架构原则的代码
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 8.3 清理旧代码和目录
  - 删除不再需要的 core 和 utils 目录
  - 整合 routes 目录到 presentation 层
  - 清理重复和冗余的代码
  - _Requirements: 7.1, 7.5_

- [ ] 9. 建立测试覆盖和质量保证
- [ ] 9.1 创建分层测试结构
  - 建立 unit、integration、e2e 测试目录结构
  - 创建测试工具和模拟对象
  - 实现测试数据和夹具管理
  - _Requirements: 7.4_

- [ ] 9.2 实现各层的测试覆盖
  - 为 Domain 层编写纯单元测试
  - 为 Application 层编写用例测试
  - 为 Infrastructure 层编写集成测试
  - 为 Presentation 层编写组件和 E2E 测试
  - _Requirements: 7.4_

- [ ] 10. 验证和优化重构结果
- [ ] 10.1 功能完整性验证
  - 运行所有现有测试确保功能完整性
  - 执行端到端测试验证用户流程
  - 进行性能测试确保无性能回归
  - _Requirements: 7.1, 7.4_

- [ ] 10.2 架构质量评估和文档更新
  - 运行架构合规性检查工具
  - 更新项目文档和开发指南
  - 创建架构迁移总结报告
  - _Requirements: 6.5, 7.5_