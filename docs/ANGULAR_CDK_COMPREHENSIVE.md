# Angular CDK (Component Dev Kit) 完整文档

## 概述

Angular CDK (Component Dev Kit) 是 Angular 官方提供的组件开发工具包，为构建自定义组件提供基础架构和可访问性支持。CDK 不包含样式，专注于功能性和可访问性。

## 安装

```bash
# 安装 CDK
ng add @angular/cdk

# 或者使用 npm
npm install @angular/cdk

# 或者使用 pnpm (推荐)
pnpm add @angular/cdk
```

## 核心模块

### 1. Accessibility (a11y)

#### FocusMonitor
监控元素的焦点状态。

```typescript
import { FocusMonitor } from '@angular/cdk/a11y';

constructor(private focusMonitor: FocusMonitor) {}

ngOnInit() {
  this.focusMonitor.monitor(this.elementRef.nativeElement)
    .subscribe(origin => {
      console.log('Focus origin:', origin);
    });
}

ngOnDestroy() {
  this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
}
```

#### LiveAnnouncer
为屏幕阅读器提供实时公告。

```typescript
import { LiveAnnouncer } from '@angular/cdk/a11y';

constructor(private liveAnnouncer: LiveAnnouncer) {}

announceMessage(message: string) {
  this.liveAnnouncer.announce(message);
}
```

### 2. Overlay

#### Overlay
创建浮动面板、模态框等覆盖层。

```typescript
import { Overlay } from '@angular/cdk/overlay';

constructor(private overlay: Overlay) {}

openOverlay() {
  const overlayRef = this.overlay.create({
    positionStrategy: this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically(),
    hasBackdrop: true,
    backdropClass: 'cdk-overlay-dark-backdrop'
  });

  const portal = new ComponentPortal(MyComponent);
  overlayRef.attach(portal);
}
```

#### OverlayModule
```typescript
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [OverlayModule]
})
export class AppModule {}
```

### 3. Portal

#### ComponentPortal
将组件动态渲染到 DOM 中的其他位置。

```typescript
import { ComponentPortal } from '@angular/cdk/portal';

userSettingsPortal: ComponentPortal<UserSettingsComponent>;

ngAfterViewInit() {
  this.userSettingsPortal = new ComponentPortal(UserSettingsComponent);
}
```

#### TemplatePortal
将模板动态渲染到 DOM 中的其他位置。

```typescript
import { TemplatePortal } from '@angular/cdk/portal';

@ViewChild('templateRef') templateRef: TemplateRef<any>;
templatePortal: TemplatePortal<any>;

ngAfterViewInit() {
  this.templatePortal = new TemplatePortal(this.templateRef, this.viewContainerRef);
}
```

### 4. Table

#### CdkTable
无样式的数据表格组件，提供完全模板化的 API。

```html
<table cdk-table [dataSource]="dataSource">
  <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
  <tr cdk-row *cdkRowDef="let row; columns: displayedColumns;"></tr>

  <ng-container cdkColumnDef="position">
    <th cdk-header-cell *cdkHeaderCellDef> No. </th>
    <td cdk-cell *cdkCellDef="let element"> {{element.position}} </td>
  </ng-container>

  <ng-container cdkColumnDef="name">
    <th cdk-header-cell *cdkHeaderCellDef> Name </th>
    <td cdk-cell *cdkCellDef="let element"> {{element.name}} </td>
  </ng-container>
</table>
```

#### CdkTableModule
```typescript
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
  imports: [CdkTableModule]
})
export class AppModule {}
```

### 5. Drag and Drop

#### CdkDrag
使元素可拖拽。

```html
<div cdkDrag [cdkDragData]="item">
  <div class="drag-handle" cdkDragHandle>拖拽手柄</div>
  {{ item.name }}
</div>
```

#### CdkDropList
定义可放置区域。

```html
<div cdkDropList
     [cdkDropListData]="items"
     (cdkDropListDropped)="drop($event)">
  <div *ngFor="let item of items" cdkDrag>
    {{ item.name }}
  </div>
</div>
```

#### 拖拽事件处理
```typescript
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

drop(event: CdkDragDrop<string[]>) {
  moveItemInArray(this.items, event.previousIndex, event.currentIndex);
}
```

### 6. Scrolling

#### CdkVirtualScrollViewport
虚拟滚动，只渲染可见的元素。

```html
<cdk-virtual-scroll-viewport itemSize="50" class="example-viewport">
  <div *cdkVirtualFor="let item of items">
    {{ item }}
  </div>
</cdk-virtual-scroll-viewport>
```

#### CdkVirtualScrollViewportModule
```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [ScrollingModule]
})
export class AppModule {}
```

### 7. Layout

#### BreakpointObserver
响应式断点观察器。

```typescript
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

constructor(private breakpointObserver: BreakpointObserver) {
  this.breakpointObserver.observe([
    Breakpoints.HandsetPortrait,
    Breakpoints.TabletPortrait
  ]).subscribe(result => {
    if (result.matches) {
      console.log('Viewport matches breakpoint');
    }
  });
}
```

#### LayoutModule
```typescript
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  imports: [LayoutModule]
})
export class AppModule {}
```

### 8. Menu

#### CdkMenu
菜单容器指令。

```html
<div cdkMenu>
  <button cdkMenuItem>菜单项 1</button>
  <button cdkMenuItem>菜单项 2</button>
  <button cdkMenuItem [cdkMenuTriggerFor]="submenu">子菜单</button>
</div>

<div cdkMenu #submenu="cdkMenu">
  <button cdkMenuItem>子菜单项 1</button>
  <button cdkMenuItem>子菜单项 2</button>
</div>
```

#### CdkMenuModule
```typescript
import { CdkMenuModule } from '@angular/cdk/menu';

@NgModule({
  imports: [CdkMenuModule]
})
export class AppModule {}
```

### 9. Dialog

#### CdkDialog
对话框服务。

```typescript
import { CdkDialog } from '@angular/cdk/dialog';

constructor(private dialog: CdkDialog) {}

openDialog() {
  const dialogRef = this.dialog.open(MyDialogComponent, {
    data: { message: 'Hello World' }
  });

  dialogRef.closed.subscribe(result => {
    console.log('Dialog closed with result:', result);
  });
}
```

#### CdkDialogModule
```typescript
import { CdkDialogModule } from '@angular/cdk/dialog';

@NgModule({
  imports: [CdkDialogModule]
})
export class AppModule {}
```

### 10. Testing

#### ComponentHarness
组件测试工具。

```typescript
import { ComponentHarness, HarnessLoader } from '@angular/cdk/testing';

class MyComponentHarness extends ComponentHarness {
  static hostSelector = 'app-my-component';

  async getText(): Promise<string> {
    return this.locatorFor('.text-content')();
  }

  async clickButton(): Promise<void> {
    return this.locatorFor('button')();
  }
}
```

#### TestbedHarnessEnvironment
```typescript
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('MyComponent', () => {
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(MyComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should display text', async () => {
    const harness = await loader.getHarness(MyComponentHarness);
    const text = await harness.getText();
    expect(text).toBe('Expected Text');
  });
});
```

## 样式导入

如果只使用 CDK 而不使用 Angular Material，需要导入必要的样式：

```scss
// 导入 CDK 覆盖层样式
@import '@angular/cdk/overlay-prebuilt.css';

// 或者使用 SCSS
@use '@angular/cdk/overlay' as cdk-overlay;
```

## 最佳实践

### 1. 模块化导入
只导入需要的模块，避免导入整个 CDK：

```typescript
// 推荐：只导入需要的模块
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';

// 避免：导入整个 CDK
// import { CdkModule } from '@angular/cdk';
```

### 2. 性能优化
使用 OnPush 变更检测策略：

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {
  // 组件实现
}
```

### 3. 可访问性
确保所有交互元素都有适当的 ARIA 标签：

```html
<button cdkMenuItem
        [attr.aria-label]="'操作按钮'"
        [attr.aria-describedby]="'button-description'">
  操作
</button>
<div id="button-description">此按钮执行特定操作</div>
```

### 4. 错误处理
为异步操作添加适当的错误处理：

```typescript
this.overlay.create(config).subscribe({
  next: (overlayRef) => {
    // 处理成功情况
  },
  error: (error) => {
    console.error('创建覆盖层失败:', error);
    // 显示用户友好的错误消息
  }
});
```

## 常见问题

### Q: CDK 和 Angular Material 的区别是什么？
A: CDK 提供无样式的功能组件，而 Angular Material 基于 CDK 构建，提供完整的 Material Design 样式组件。

### Q: 如何自定义 CDK 组件的外观？
A: CDK 组件本身没有样式，你可以通过 CSS 完全自定义它们的外观。

### Q: CDK 是否支持服务器端渲染？
A: 是的，CDK 支持 Angular Universal 的服务器端渲染。

### Q: 如何测试使用 CDK 的组件？
A: 使用 CDK 提供的测试工具，如 ComponentHarness 和 TestbedHarnessEnvironment。

## 版本兼容性

确保 CDK 版本与 Angular 版本兼容：

| Angular 版本 | CDK 版本 |
|-------------|----------|
| 17.x        | 17.x     |
| 18.x        | 18.x     |
| 19.x        | 19.x     |
| 20.x        | 20.x     |

## 参考资料

- [官方文档](https://material.angular.io/cdk)
- [GitHub 仓库](https://github.com/angular/components)
- [API 参考](https://material.angular.io/cdk/categories)
- [示例代码](https://github.com/angular/components/tree/main/src/cdk)

---

*本文档基于 Angular CDK 最新版本编写，如有更新请参考官方文档。*
