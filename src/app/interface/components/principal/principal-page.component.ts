import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';

import { PrincipalListComponent } from './principal-list.component';
import { PrincipalWorkflowComponent, WorkflowStep } from './principal-workflow.component';
import { Principal } from '../../../domain/entities/principal.entity';

@Component({
  selector: 'app-principal-page',
  templateUrl: './principal-page.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
    NzModalModule,
    NzSplitterModule,
    PrincipalListComponent,
    PrincipalWorkflowComponent
  ]
})
export class PrincipalPageComponent implements OnInit {
  selectedPrincipal: Principal | null = null;
  splitterSizes: number[] = [60, 40];

  constructor() {}

  ngOnInit(): void {}

  onPrincipalSelected(principal: Principal): void {
    this.selectedPrincipal = principal;
  }

  onWorkflowSaved(steps: WorkflowStep[]): void {
    console.log('Workflow saved:', steps);
  }

  onSplitterResize(sizes: number[]): void {
    this.splitterSizes = sizes;
  }
}
