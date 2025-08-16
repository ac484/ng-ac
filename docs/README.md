# Angular CDK 与 Material 完整文档

本目录包含了 Angular CDK (Component Dev Kit) 和 Angular Material 的完整文档，为开发者提供全面的参考和使用指南。

## 📚 文档目录

### 1. [Angular CDK 完整文档](./ANGULAR_CDK_COMPREHENSIVE.md)
- **概述**: Angular CDK 的基础介绍和定位
- **核心模块**: 详细的功能模块说明
  - Accessibility (a11y) - 可访问性支持
  - Overlay - 覆盖层系统
  - Portal - 动态内容渲染
  - Table - 数据表格
  - Drag and Drop - 拖拽功能
  - Scrolling - 滚动优化
  - Layout - 响应式布局
  - Menu - 菜单系统
  - Dialog - 对话框
  - Testing - 测试工具
- **样式导入**: 必要的 CSS 导入说明
- **最佳实践**: 性能优化和开发建议
- **常见问题**: FAQ 和解决方案

### 2. [Angular Material 完整文档](./ANGULAR_MATERIAL_COMPREHENSIVE.md)
- **概述**: Angular Material 组件库介绍
- **核心组件**: 完整的 UI 组件说明
  - 按钮 (Button) - 各种按钮样式
  - 表单控件 (Form Controls) - 输入框、选择器等
  - 导航 (Navigation) - 工具栏、侧边栏、菜单等
  - 布局 (Layout) - 卡片、分割线、面板等
  - 数据展示 (Data Display) - 表格、列表、树形等
  - 反馈 (Feedback) - 进度条、提示等
  - 弹出框 (Popups & Modals) - 对话框、工具提示等
  - 日期和时间 (Date & Time) - 日期选择器、时间选择器等
- **主题系统**: 完整的主题配置指南
- **响应式设计**: 断点观察器和响应式指令
- **国际化**: 多语言支持和本地化配置
- **可访问性**: ARIA 标签和键盘导航
- **性能优化**: 变更检测和虚拟滚动
- **测试**: 组件测试和测试工具

### 3. [综合指南](./ANGULAR_CDK_MATERIAL_OVERVIEW.md)
- **关系说明**: CDK 与 Material 的架构关系
- **使用场景**: 何时使用 CDK vs Material
- **混合使用策略**: 推荐的使用方案
- **实际应用示例**: 代码示例和最佳实践
- **性能考虑**: 包大小优化和懒加载
- **迁移指南**: 从一种方案迁移到另一种
- **常见问题**: 综合 FAQ

## 🚀 快速开始

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm add @angular/cdk @angular/material

# 或使用 npm
npm install @angular/cdk @angular/material

# 或使用 Angular CLI
ng add @angular/material
```

### 基础使用示例

```typescript
// 导入需要的模块
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    MatButtonModule,    // Material 按钮
    DragDropModule      // CDK 拖拽功能
  ]
})
export class AppModule {}
```

```html
<!-- 使用 Material 按钮 -->
<button mat-raised-button color="primary">
  主要按钮
</button>

<!-- 使用 CDK 拖拽功能 -->
<div cdkDropList [cdkDropListData]="items">
  <div *ngFor="let item of items" cdkDrag>
    {{ item.name }}
  </div>
</div>
```

## 🎯 使用建议

### 选择策略

1. **使用 Angular CDK 当**:
   - 需要完全自定义外观
   - 构建自己的设计系统
   - 对包大小敏感
   - 只需要特定功能

2. **使用 Angular Material 当**:
   - 需要快速开发
   - 遵循 Material Design 规范
   - 需要完整的 UI 组件
   - 团队熟悉 Material Design

3. **混合使用**:
   - 使用 CDK 提供功能
   - 使用 Material 提供样式
   - 自定义特定组件的外观

### 性能优化

- 按需导入模块，避免导入整个库
- 使用 OnPush 变更检测策略
- 实现虚拟滚动处理大量数据
- 使用懒加载减少初始包大小

## 🔧 开发工具

### 官方资源

- [Angular Material 官网](https://material.angular.io/)
- [Angular CDK 文档](https://material.angular.io/cdk)
- [GitHub 仓库](https://github.com/angular/components)
- [Material Design 规范](https://material.io/design)

### 开发工具

- Angular DevTools (浏览器扩展)
- Angular CLI
- VS Code + Angular 扩展
- StackBlitz (在线编辑器)

## 📖 学习路径

### 初学者
1. 阅读 [综合指南](./ANGULAR_CDK_MATERIAL_OVERVIEW.md) 了解整体架构
2. 学习 [Angular Material 完整文档](./ANGULAR_MATERIAL_COMPREHENSIVE.md) 掌握基础组件
3. 实践基础示例，熟悉组件用法

### 进阶开发者
1. 深入学习 [Angular CDK 完整文档](./ANGULAR_CDK_COMPREHENSIVE.md)
2. 掌握主题系统和自定义样式
3. 学习性能优化和最佳实践
4. 构建自定义组件库

### 专家级
1. 研究源码实现
2. 贡献开源项目
3. 分享最佳实践
4. 指导团队开发

## 🤝 贡献指南

如果你发现文档中的错误或有改进建议，欢迎：

1. 提交 Issue 描述问题
2. 提交 Pull Request 修复问题
3. 分享使用经验和最佳实践
4. 翻译文档到其他语言

## 📄 许可证

本文档基于 Angular 官方文档编写，遵循相应的开源许可证。

## 🔄 更新日志

- **2024-12-19**: 创建完整的文档结构
- 包含 CDK 和 Material 的全面指南
- 提供实际应用示例和最佳实践
- 建立综合使用策略和迁移指南

---

*本文档持续更新中，请关注最新版本以获取最新的功能和最佳实践。*
