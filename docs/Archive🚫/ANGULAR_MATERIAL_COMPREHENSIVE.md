# Angular Material 完整文档

## 概述

Angular Material 是 Angular 官方提供的 Material Design 组件库，基于 Angular CDK 构建，提供完整的 UI 组件、主题系统和可访问性支持。它遵循 Google 的 Material Design 设计规范，为 Angular 应用提供一致的用户体验。

## 安装

```bash
# 安装 Angular Material
ng add @angular/material

# 或者使用 npm
npm install @angular/material

# 或者使用 pnpm (推荐)
pnpm add @angular/material
```

## 核心组件

### 1. 按钮 (Button)

#### MatButton
Material Design 按钮组件。

```html
<!-- 基础按钮 -->
<button mat-button>基础按钮</button>
<button mat-raised-button>凸起按钮</button>
<button mat-flat-button>扁平按钮</button>
<button mat-stroked-button>描边按钮</button>
<button mat-fab>浮动操作按钮</button>
<button mat-mini-fab>迷你浮动按钮</button>
<button mat-icon-button>图标按钮</button>

<!-- 带颜色的按钮 -->
<button mat-raised-button color="primary">主要按钮</button>
<button mat-raised-button color="accent">强调按钮</button>
<button mat-raised-button color="warn">警告按钮</button>

<!-- 禁用状态 -->
<button mat-raised-button [disabled]="true">禁用按钮</button>
```

#### MatButtonModule
```typescript
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [MatButtonModule]
})
export class AppModule {}
```

### 2. 表单控件 (Form Controls)

#### MatFormField
表单字段容器，提供标签、提示和错误状态。

```html
<mat-form-field appearance="outline">
  <mat-label>用户名</mat-label>
  <input matInput placeholder="请输入用户名">
  <mat-icon matSuffix>person</mat-icon>
  <mat-hint>用户名长度 3-20 个字符</mat-hint>
  <mat-error *ngIf="usernameControl.hasError('required')">
    用户名是必填项
  </mat-error>
</mat-form-field>
```

#### MatInput
Material Design 输入框。

```html
<mat-form-field>
  <mat-label>邮箱</mat-label>
  <input matInput type="email" [formControl]="emailControl">
  <mat-error *ngIf="emailControl.hasError('email')">
    请输入有效的邮箱地址
  </mat-error>
</mat-form-field>
```

#### MatSelect
下拉选择框。

```html
<mat-form-field>
  <mat-label>选择国家</mat-label>
  <mat-select [formControl]="countryControl">
    <mat-option value="cn">中国</mat-option>
    <mat-option value="us">美国</mat-option>
    <mat-option value="jp">日本</mat-option>
  </mat-select>
</mat-form-field>
```

#### MatCheckbox
复选框。

```html
<mat-checkbox [formControl]="agreeControl">
  我同意服务条款
</mat-checkbox>
```

#### MatRadioButton
单选按钮。

```html
<mat-radio-group [formControl]="genderControl">
  <mat-radio-button value="male">男</mat-radio-button>
  <mat-radio-button value="female">女</mat-radio-button>
</mat-radio-group>
```

#### MatSlideToggle
滑动开关。

```html
<mat-slide-toggle [formControl]="notifyControl">
  接收通知
</mat-slide-toggle>
```

### 3. 导航 (Navigation)

#### MatToolbar
工具栏组件。

```html
<mat-toolbar color="primary">
  <span>我的应用</span>
  <span class="toolbar-spacer"></span>
  <button mat-icon-button>
    <mat-icon>search</mat-icon>
  </button>
  <button mat-icon-button>
    <mat-icon>more_vert</mat-icon>
  </button>
</mat-toolbar>

<mat-toolbar-row>
  <span>第二行工具栏</span>
</mat-toolbar-row>
```

#### MatSidenav
侧边导航栏。

```html
<mat-sidenav-container>
  <mat-sidenav #sidenav mode="side" opened>
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard">
        <mat-icon>dashboard</mat-icon>
        <span>仪表板</span>
      </a>
      <a mat-list-item routerLink="/users">
        <mat-icon>people</mat-icon>
        <span>用户管理</span>
      </a>
    </mat-nav-list>
  </mat-sidenav>

  <mat-sidenav-content>
    <router-outlet></router-outlet>
  </mat-sidenav-content>
</mat-sidenav-container>
```

#### MatMenu
下拉菜单。

```html
<button mat-icon-button [matMenuTriggerFor]="menu">
  <mat-icon>more_vert</mat-icon>
</button>

<mat-menu #menu="matMenu">
  <button mat-menu-item>
    <mat-icon>person</mat-icon>
    <span>个人资料</span>
  </button>
  <button mat-menu-item>
    <mat-icon>settings</mat-icon>
    <span>设置</span>
  </button>
  <mat-divider></mat-divider>
  <button mat-menu-item>
    <mat-icon>exit_to_app</mat-icon>
    <span>退出</span>
  </button>
</mat-menu>
```

#### MatTabs
标签页组件。

```html
<mat-tab-group>
  <mat-tab label="第一页">
    <div class="tab-content">
      第一页的内容
    </div>
  </mat-tab>
  <mat-tab label="第二页">
    <div class="tab-content">
      第二页的内容
    </div>
  </mat-tab>
  <mat-tab label="第三页">
    <div class="tab-content">
      第三页的内容
    </div>
  </mat-tab>
</mat-tab-group>
```

### 4. 布局 (Layout)

#### MatCard
卡片组件。

```html
<mat-card>
  <mat-card-header>
    <mat-card-title>卡片标题</mat-card-title>
    <mat-card-subtitle>卡片副标题</mat-card-subtitle>
    <img mat-card-avatar src="avatar.jpg" alt="头像">
  </mat-card-header>

  <img mat-card-image src="image.jpg" alt="卡片图片">

  <mat-card-content>
    <p>这是卡片的主要内容区域，可以包含文本、图片等。</p>
  </mat-card-content>

  <mat-card-actions>
    <button mat-button>喜欢</button>
    <button mat-button>分享</button>
  </mat-card-actions>
</mat-card>
```

#### MatDivider
分割线组件。

```html
<div>内容 1</div>
<mat-divider></mat-divider>
<div>内容 2</div>

<!-- 垂直分割线 -->
<mat-divider vertical></mat-divider>

<!-- 内嵌分割线 -->
<mat-divider inset></mat-divider>
```

#### MatExpansionPanel
可展开面板。

```html
<mat-accordion>
  <mat-expansion-panel>
    <mat-expansion-panel-header>
      <mat-panel-title>
        个人信息
      </mat-panel-title>
      <mat-panel-description>
        点击展开查看详细信息
      </mat-panel-description>
    </mat-expansion-panel-header>

    <p>这里是展开后的内容...</p>
  </mat-expansion-panel>
</mat-accordion>
```

### 5. 数据展示 (Data Display)

#### MatTable
数据表格。

```html
<mat-table [dataSource]="dataSource" class="mat-elevation-z8">
  <!-- 位置列 -->
  <ng-container matColumnDef="position">
    <mat-header-cell *matHeaderCellDef> 位置 </mat-header-cell>
    <mat-cell *matCellDef="let element"> {{element.position}} </mat-cell>
  </ng-container>

  <!-- 名称列 -->
  <ng-container matColumnDef="name">
    <mat-header-cell *matHeaderCellDef> 名称 </mat-header-cell>
    <mat-cell *matCellDef="let element"> {{element.name}} </mat-cell>
  </ng-container>

  <!-- 重量列 -->
  <ng-container matColumnDef="weight">
    <mat-header-cell *matHeaderCellDef> 重量 </mat-header-cell>
    <mat-cell *matCellDef="let element"> {{element.weight}} </mat-cell>
  </ng-container>

  <!-- 符号列 -->
  <ng-container matColumnDef="symbol">
    <mat-header-cell *matHeaderCellDef> 符号 </mat-header-cell>
    <mat-cell *matCellDef="let element"> {{element.symbol}} </mat-cell>
  </ng-container>

  <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
  <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
</mat-table>

<mat-paginator [pageSizeOptions]="[5, 10, 25, 100]"></mat-paginator>
```

#### MatList
列表组件。

```html
<mat-list>
  <h3 matSubheader>文件夹</h3>
  <mat-list-item *ngFor="let folder of folders">
    <mat-icon matListIcon>folder</mat-icon>
    <h4 matListItemTitle>{{folder.name}}</h4>
    <p matListItemLine>{{folder.updated}}</p>
  </mat-list-item>

  <mat-divider></mat-divider>

  <h3 matSubheader>笔记</h3>
  <mat-list-item *ngFor="let note of notes">
    <mat-icon matListIcon>note</mat-icon>
    <h4 matListItemTitle>{{note.name}}</h4>
    <p matListItemLine>{{note.updated}}</p>
  </mat-list-item>
</mat-list>
```

#### MatTree
树形组件。

```html
<mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
  <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding>
    <button mat-icon-button disabled></button>
    <mat-icon class="type-icon">folder</mat-icon>
    {{node.name}}
  </mat-tree-node>

  <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
    <button mat-icon-button matTreeNodeToggle
            [attr.aria-label]="'Toggle ' + node.name">
      <mat-icon class="mat-icon-rtl-mirror">
        {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
      </mat-icon>
    </button>
    <mat-icon class="type-icon">folder</mat-icon>
    {{node.name}}
  </mat-tree-node>
</mat-tree>
```

### 6. 反馈 (Feedback)

#### MatProgressBar
进度条。

```html
<!-- 确定进度条 -->
<mat-progress-bar mode="determinate" [value]="progress"></mat-progress-bar>

<!-- 不确定进度条 -->
<mat-progress-bar mode="indeterminate"></mat-progress-bar>

<!-- 缓冲进度条 -->
<mat-progress-bar mode="buffer" [value]="progress" [bufferValue]="bufferValue"></mat-progress-bar>

<!-- 查询进度条 -->
<mat-progress-bar mode="query"></mat-progress-bar>
```

#### MatProgressSpinner
进度指示器。

```html
<!-- 圆形进度指示器 -->
<mat-spinner></mat-spinner>

<!-- 带值的进度指示器 -->
<mat-progress-spinner mode="determinate" [value]="progress"></mat-progress-spinner>

<!-- 不确定进度指示器 -->
<mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
```

#### MatSnackBar
消息提示条。

```typescript
import { MatSnackBar } from '@angular/material/snack-bar';

constructor(private snackBar: MatSnackBar) {}

showMessage(message: string, action: string = '关闭') {
  this.snackBar.open(message, action, {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  });
}
```

### 7. 弹出框 (Popups & Modals)

#### MatDialog
对话框服务。

```typescript
import { MatDialog } from '@angular/material/dialog';

constructor(private dialog: MatDialog) {}

openDialog(): void {
  const dialogRef = this.dialog.open(DialogComponent, {
    width: '500px',
    data: { name: 'John', animal: 'Dog' }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('对话框关闭', result);
  });
}
```

#### MatTooltip
工具提示。

```html
<button mat-raised-button
        matTooltip="这是一个工具提示"
        matTooltipPosition="above">
  悬停查看提示
</button>
```

### 8. 日期和时间 (Date & Time)

#### MatDatepicker
日期选择器。

```html
<mat-form-field>
  <mat-label>选择日期</mat-label>
  <input matInput [matDatepicker]="picker">
  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>
```

#### MatTimepicker
时间选择器。

```html
<mat-form-field>
  <mat-label>选择时间</mat-label>
  <input matInput [matTimepicker]="picker">
  <mat-timepicker-toggle matSuffix [for]="picker"></mat-timepicker-toggle>
  <mat-timepicker #picker></mat-timepicker>
</mat-form-field>
```

## 主题系统

### 1. 基础主题

```scss
@use '@angular/material' as mat;

// 定义调色板
$my-primary: mat.define-palette(mat.$indigo-palette);
$my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$my-warn: mat.define-palette(mat.$red-palette);

// 定义主题
$my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
    warn: $my-warn,
  ),
  typography: mat.define-typography-config(),
  density: 0,
));

// 应用主题
@include mat.all-component-themes($my-theme);
```

### 2. 深色主题

```scss
$my-dark-theme: mat.define-dark-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
    warn: $my-warn,
  ),
  typography: mat.define-typography-config(),
  density: 0,
));

@include mat.all-component-themes($my-dark-theme);
```

### 3. 自定义组件主题

```scss
// 为自定义组件创建主题
@mixin custom-component-theme($theme) {
  $color-config: mat.get-color-config($theme);
  $typography-config: mat.get-typography-config($theme);

  .custom-component {
    background-color: mat.get-color-from-palette($color-config, 'primary');
    color: mat.get-color-from-palette($color-config, 'primary-contrast');
  }
}

// 应用自定义组件主题
@include custom-component-theme($my-theme);
```

## 响应式设计

### 1. 断点观察器

```typescript
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

constructor(private breakpointObserver: BreakpointObserver) {
  this.breakpointObserver.observe([
    Breakpoints.HandsetPortrait,
    Breakpoints.TabletPortrait,
    Breakpoints.WebPortrait
  ]).subscribe(result => {
    if (result.matches) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  });
}
```

### 2. 响应式指令

```html
<!-- 在小屏幕上隐藏 -->
<div class="hide-small"
     [class.hide-small]="breakpointObserver.isMatched(Breakpoints.Small)">
  小屏幕隐藏内容
</div>

<!-- 在大屏幕上显示 -->
<div class="show-large"
     [class.show-large]="breakpointObserver.isMatched(Breakpoints.Large)">
  大屏幕显示内容
</div>
```

## 国际化 (i18n)

### 1. 日期本地化

```typescript
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

@NgModule({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'YYYY/MM/DD',
        },
        display: {
          dateInput: 'YYYY/MM/DD',
          monthYearLabel: 'YYYY年 MM月',
          dateA11yLabel: 'YYYY/MM/DD',
          monthYearA11yLabel: 'YYYY年 MM月',
        },
      },
    },
  ],
})
export class AppModule {}
```

### 2. 分页器本地化

```typescript
import { MatPaginatorIntl } from '@angular/material/paginator';

export class ChinesePaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = '每页显示:';
  override nextPageLabel = '下一页';
  override previousPageLabel = '上一页';
  override firstPageLabel = '第一页';
  override lastPageLabel = '最后一页';

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 共 ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} 共 ${length}`;
  };
}

@NgModule({
  providers: [
    { provide: MatPaginatorIntl, useClass: ChinesePaginatorIntl }
  ]
})
export class AppModule {}
```

## 可访问性 (Accessibility)

### 1. ARIA 标签

```html
<button mat-raised-button
        [attr.aria-label]="'删除用户 ' + user.name"
        [attr.aria-describedby]="'delete-description'">
  删除
</button>
<div id="delete-description" class="sr-only">
  此操作将永久删除用户账户，无法撤销
</div>
```

### 2. 键盘导航

```typescript
// 确保所有交互元素都可以通过键盘访问
@HostListener('keydown.enter', ['$event'])
@HostListener('keydown.space', ['$event'])
onKeyDown(event: KeyboardEvent) {
  event.preventDefault();
  this.onClick();
}
```

### 3. 屏幕阅读器支持

```typescript
import { LiveAnnouncer } from '@angular/cdk/a11y';

constructor(private liveAnnouncer: LiveAnnouncer) {}

announceStatus(status: string) {
  this.liveAnnouncer.announce(`状态已更新为: ${status}`);
}
```

## 性能优化

### 1. 变更检测策略

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {
  // 使用 OnPush 策略提高性能
}
```

### 2. 虚拟滚动

```html
<cdk-virtual-scroll-viewport itemSize="50" class="example-viewport">
  <div *cdkVirtualFor="let item of items">
    {{ item }}
  </div>
</cdk-virtual-scroll-viewport>
```

### 3. 懒加载

```typescript
// 懒加载模块
const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule)
  }
];
```

## 测试

### 1. 组件测试

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyComponent ],
      imports: [ MatButtonModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### 2. 测试工具 (Harnesses)

```typescript
import { ComponentHarness, HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

class ButtonHarness extends ComponentHarness {
  static hostSelector = 'button[mat-raised-button]';

  async getText(): Promise<string> {
    return this.locatorFor('span')();
  }

  async click(): Promise<void> {
    return this.locatorFor('button')();
  }
}

describe('Button Component', () => {
  let loader: HarnessLoader;

  beforeEach(async () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should display correct text', async () => {
    const button = await loader.getHarness(ButtonHarness);
    const text = await button.getText();
    expect(text).toBe('Click me');
  });
});
```

## 最佳实践

### 1. 模块导入

```typescript
// 只导入需要的模块
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule
  ]
})
export class FeatureModule {}
```

### 2. 组件封装

```typescript
@Component({
  selector: 'app-custom-button',
  template: `
    <button mat-raised-button
            [color]="color"
            [disabled]="disabled"
            (click)="onClick()">
      <mat-icon *ngIf="icon">{{ icon }}</mat-icon>
      {{ label }}
    </button>
  `,
  styleUrls: ['./custom-button.component.scss']
})
export class CustomButtonComponent {
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() disabled = false;
  @Input() icon?: string;
  @Input() label = '按钮';

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
```

### 3. 错误处理

```typescript
// 为异步操作添加错误处理
this.dialog.open(ConfirmDialogComponent).afterClosed().subscribe({
  next: (result) => {
    if (result) {
      this.performAction();
    }
  },
  error: (error) => {
    console.error('对话框打开失败:', error);
    this.snackBar.open('操作失败，请重试', '关闭', { duration: 3000 });
  }
});
```

## 常见问题

### Q: 如何自定义 Material 组件的样式？
A: 可以通过 CSS 变量、主题系统或深度选择器来自定义样式。推荐使用主题系统，因为它提供了更好的维护性和一致性。

### Q: Material 组件是否支持服务器端渲染？
A: 是的，Angular Material 完全支持 Angular Universal 的服务器端渲染。

### Q: 如何处理 Material 组件的国际化？
A: 使用 Angular 的 i18n 系统，结合 Material 提供的本地化配置。

### Q: 如何优化 Material 应用的性能？
A: 使用 OnPush 变更检测策略、虚拟滚动、懒加载模块等技术。

## 版本兼容性

确保 Angular Material 版本与 Angular 版本兼容：

| Angular 版本 | Material 版本 |
|-------------|---------------|
| 17.x        | 17.x          |
| 18.x        | 18.x          |
| 19.x        | 19.x          |
| 20.x        | 20.x          |

## 参考资料

- [官方文档](https://material.angular.io/)
- [GitHub 仓库](https://github.com/angular/components)
- [Material Design 规范](https://material.io/design)
- [组件示例](https://material.angular.io/components/categories)
- [主题指南](https://material.angular.io/guide/theming)

---

*本文档基于 Angular Material 最新版本编写，如有更新请参考官方文档。*
