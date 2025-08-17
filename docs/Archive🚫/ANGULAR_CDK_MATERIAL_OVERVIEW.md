# Angular CDK 与 Angular Material 综合指南

## 概述

Angular CDK (Component Dev Kit) 和 Angular Material 是 Angular 官方提供的两个重要库，它们协同工作，为 Angular 应用提供完整的 UI 开发解决方案。

## 关系说明

### Angular CDK
- **定位**: 基础架构层，提供无样式的功能组件
- **特点**: 专注于功能性和可访问性，不包含视觉样式
- **用途**: 构建自定义组件的基础，提供核心功能如拖拽、覆盖层、表格等

### Angular Material
- **定位**: UI 组件层，基于 CDK 构建
- **特点**: 提供完整的 Material Design 样式组件
- **用途**: 快速构建符合 Material Design 规范的用户界面

### 关系图
```
┌─────────────────────────────────────┐
│           Angular Material          │
│        (样式 + 功能组件)            │
├─────────────────────────────────────┤
│           Angular CDK               │
│        (功能 + 可访问性)            │
├─────────────────────────────────────┤
│           Angular Core              │
│        (框架核心功能)                │
└─────────────────────────────────────┘
```

## 何时使用 CDK vs Material

### 使用 Angular CDK 的场景

1. **构建自定义组件**
   - 需要完全自定义外观
   - 有自己的设计系统
   - 需要特定的交互行为

2. **轻量级应用**
   - 只需要少数几个功能
   - 对包大小敏感
   - 不需要 Material Design 样式

3. **企业级应用**
   - 有严格的设计规范
   - 需要品牌一致性
   - 有专门的 UI/UX 团队

### 使用 Angular Material 的场景

1. **快速原型开发**
   - 需要快速构建界面
   - 遵循 Material Design 规范
   - 开发 MVP 或演示版本

2. **管理后台应用**
   - 数据密集型界面
   - 需要丰富的表单控件
   - 团队熟悉 Material Design

3. **移动优先应用**
   - 需要触摸友好的界面
   - 响应式设计要求
   - 跨平台一致性

## 混合使用策略

### 推荐方案：CDK + 自定义样式

```typescript
// 导入 CDK 功能模块
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';

// 导入少量 Material 组件
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    DragDropModule,      // CDK: 拖拽功能
    OverlayModule,       // CDK: 覆盖层
    ScrollingModule,     // CDK: 虚拟滚动
    MatButtonModule,     // Material: 按钮样式
    MatIconModule        // Material: 图标
  ]
})
export class AppModule {}
```

### 样式策略

```scss
// 使用 CDK 功能，自定义样式
.custom-drag-item {
  @include cdk-drag-drop-styles;

  background: var(--custom-bg);
  border-radius: var(--custom-radius);
  box-shadow: var(--custom-shadow);
}

// 继承 Material 主题，但自定义外观
.custom-button {
  @extend .mat-raised-button;

  background: var(--brand-primary);
  color: var(--brand-contrast);
  border-radius: 8px;
}
```

## 实际应用示例

### 示例 1: 自定义拖拽列表

```typescript
// 使用 CDK 拖拽功能，自定义样式
@Component({
  selector: 'app-custom-list',
  template: `
    <div cdkDropList
         [cdkDropListData]="items"
         (cdkDropListDropped)="drop($event)"
         class="custom-drop-list">
      <div *ngFor="let item of items"
           cdkDrag
           class="custom-drag-item">
        <div class="drag-handle" cdkDragHandle>
          <mat-icon>drag_indicator</mat-icon>
        </div>
        <span>{{ item.name }}</span>
      </div>
    </div>
  `,
  styleUrls: ['./custom-list.component.scss']
})
export class CustomListComponent {
  items = [
    { id: 1, name: '项目 A' },
    { id: 2, name: '项目 B' },
    { id: 3, name: '项目 C' }
  ];

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
}
```

```scss
// 自定义样式
.custom-drop-list {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 16px;
  min-height: 200px;
}

.custom-drag-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin: 8px 0;
  background: var(--item-bg);
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  .drag-handle {
    cursor: move;
    margin-right: 12px;
    color: var(--text-muted);
  }
}
```

### 示例 2: 自定义覆盖层

```typescript
// 使用 CDK 覆盖层，自定义内容
@Component({
  selector: 'app-custom-overlay',
  template: `
    <button mat-raised-button (click)="openOverlay()">
      打开自定义覆盖层
    </button>
  `
})
export class CustomOverlayComponent {
  constructor(private overlay: Overlay) {}

  openOverlay() {
    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      hasBackdrop: true,
      backdropClass: 'custom-backdrop'
    });

    // 使用自定义组件
    const portal = new ComponentPortal(CustomOverlayContentComponent);
    overlayRef.attach(portal);
  }
}
```

### 示例 3: 混合使用策略

```typescript
// 在同一个应用中混合使用 CDK 和 Material
@NgModule({
  imports: [
    // CDK 功能模块
    DragDropModule,           // 拖拽功能
    OverlayModule,            // 覆盖层
    ScrollingModule,          // 虚拟滚动
    LayoutModule,             // 响应式布局

    // Material 基础组件
    MatButtonModule,          // 按钮
    MatIconModule,            // 图标
    MatFormFieldModule,       // 表单字段
    MatInputModule,           // 输入框

    // Material 高级组件（根据需要）
    MatDialogModule,          // 对话框
    MatSnackBarModule,        // 消息提示
    MatMenuModule,            // 菜单
  ]
})
export class AppModule {}
```

## 性能考虑

### 包大小优化

```typescript
// 只导入需要的功能
// 避免导入整个库
import { DragDropModule } from '@angular/cdk/drag-drop';
// 而不是
// import { CdkModule } from '@angular/cdk';

import { MatButtonModule } from '@angular/material/button';
// 而不是
// import { MaterialModule } from '@angular/material';
```

### 懒加载策略

```typescript
// 在功能模块中按需导入
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

## 最佳实践总结

### 1. 架构原则
- **CDK 优先**: 优先使用 CDK 提供功能
- **Material 补充**: 在需要快速开发时使用 Material
- **混合使用**: 根据具体需求选择合适的组合

### 2. 开发流程
1. 分析需求，确定需要的功能
2. 优先使用 CDK 实现核心功能
3. 使用 Material 组件加速开发
4. 自定义样式，保持品牌一致性

### 3. 维护策略
- 定期更新依赖版本
- 监控包大小变化
- 收集用户反馈，优化体验
- 建立组件库规范

## 迁移指南

### 从纯 Material 迁移到 CDK + 自定义

1. **评估现有组件**
   - 识别可以自定义的组件
   - 确定必须保持 Material 样式的组件

2. **逐步替换**
   - 先替换简单的展示组件
   - 保留复杂的交互组件
   - 逐步自定义样式

3. **测试验证**
   - 确保功能完整性
   - 验证样式一致性
   - 检查可访问性

### 从纯 CDK 迁移到 Material

1. **识别重复功能**
   - 查找可以替换的自定义组件
   - 评估 Material 组件的适用性

2. **引入 Material 组件**
   - 从基础组件开始
   - 逐步替换复杂组件
   - 保持自定义样式的一致性

## 常见问题解答

### Q: CDK 和 Material 可以同时使用吗？
A: 是的，它们完全兼容，可以同时使用。CDK 提供功能，Material 提供样式。

### Q: 如何选择使用哪个？
A: 如果需要快速开发且遵循 Material Design，使用 Material；如果需要完全自定义且对包大小敏感，使用 CDK。

### Q: 混合使用会影响性能吗？
A: 不会，只要按需导入模块，不会产生额外的性能开销。

### Q: 如何保持样式一致性？
A: 建立统一的设计系统，使用 CSS 变量和主题系统，确保自定义样式与 Material 组件协调。

## 总结

Angular CDK 和 Angular Material 为 Angular 开发提供了灵活而强大的解决方案：

- **CDK**: 提供基础功能，适合需要完全自定义的场景
- **Material**: 提供完整组件，适合快速开发和 Material Design 项目
- **混合使用**: 最佳实践，既保持灵活性又提高开发效率

选择合适的使用策略，可以让你的 Angular 应用既美观又高效，同时保持代码的可维护性和扩展性。

---

*本文档提供了 CDK 和 Material 的综合使用指南，具体实现请参考各自的详细文档。*
