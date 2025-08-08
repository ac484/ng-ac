import { Injectable, inject, signal } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, map, catchError, finalize, of } from 'rxjs';

import { CompanyService } from './company.service';
import { DynamicWorkflowStateVO, DynamicWorkflowState, DynamicStateTransition } from '../../domain/value-objects/dynamic-workflow-state.vo';

/**
 * 工作流程管理服務
 * 極簡設計，專注於工作流程的 CRUD 操作
 */
@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private readonly companyService = inject(CompanyService);
  private readonly message = inject(NzMessageService);

  // 當前選中的公司ID
  private readonly currentCompanyIdSignal = signal<string>('');

  // 當前工作流程狀態
  private readonly currentWorkflowSignal = signal<DynamicWorkflowStateVO | null>(null);

  // 載入狀態
  private readonly loadingSignal = signal(false);

  // Computed
  readonly currentCompanyId = this.currentCompanyIdSignal.asReadonly();
  readonly currentWorkflow = this.currentWorkflowSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * 設置當前公司並載入其工作流程
   */
  setCurrentCompany(companyId: string): void {
    this.currentCompanyIdSignal.set(companyId);
    this.loadWorkflow(companyId);
  }

  /**
   * 載入公司的工作流程
   */
  private loadWorkflow(companyId: string): void {
    this.loadingSignal.set(true);

    // 從公司服務獲取公司資料
    const companies = this.companyService.companies();
    const company = companies.find(c => c.id === companyId);

    if (company && (company as any).dynamicWorkflow) {
      // 如果公司已有工作流程，載入它
      const workflowData = (company as any).dynamicWorkflow;
      const workflow = DynamicWorkflowStateVO.fromPlainObject(workflowData);
      this.currentWorkflowSignal.set(workflow);
    } else {
      // 如果沒有工作流程，創建一個空的
      const workflow = DynamicWorkflowStateVO.create();
      this.currentWorkflowSignal.set(workflow);
    }

    this.loadingSignal.set(false);
  }

  /**
   * 添加狀態到當前工作流程
   */
  addState(state: DynamicWorkflowState): Observable<void> {
    const currentWorkflow = this.currentWorkflow();
    const companyId = this.currentCompanyId();

    if (!currentWorkflow || !companyId) {
      return of();
    }

    this.loadingSignal.set(true);

    try {
      const updatedWorkflow = currentWorkflow.addState(state);
      this.currentWorkflowSignal.set(updatedWorkflow);

      // 更新公司資料
      return this.updateCompanyWorkflow(companyId, updatedWorkflow).pipe(finalize(() => this.loadingSignal.set(false)));
    } catch {
      this.loadingSignal.set(false);
      this.message.error('添加狀態失敗');
      return of();
    }
  }

  /**
   * 更新狀態
   */
  updateState(stateId: string, updates: Partial<DynamicWorkflowState>): Observable<void> {
    const currentWorkflow = this.currentWorkflow();
    const companyId = this.currentCompanyId();

    if (!currentWorkflow || !companyId) {
      return of();
    }

    this.loadingSignal.set(true);

    try {
      const updatedWorkflow = currentWorkflow.updateState(stateId, updates);
      this.currentWorkflowSignal.set(updatedWorkflow);

      return this.updateCompanyWorkflow(companyId, updatedWorkflow).pipe(finalize(() => this.loadingSignal.set(false)));
    } catch {
      this.loadingSignal.set(false);
      this.message.error('更新狀態失敗');
      return of();
    }
  }

  /**
   * 刪除狀態
   */
  removeState(stateId: string): Observable<void> {
    const currentWorkflow = this.currentWorkflow();
    const companyId = this.currentCompanyId();

    if (!currentWorkflow || !companyId) {
      return of();
    }

    this.loadingSignal.set(true);

    try {
      const updatedWorkflow = currentWorkflow.removeState(stateId);
      this.currentWorkflowSignal.set(updatedWorkflow);

      return this.updateCompanyWorkflow(companyId, updatedWorkflow).pipe(finalize(() => this.loadingSignal.set(false)));
    } catch {
      this.loadingSignal.set(false);
      this.message.error('刪除狀態失敗');
      return of();
    }
  }

  /**
   * 添加轉換
   */
  addTransition(transition: DynamicStateTransition): Observable<void> {
    const currentWorkflow = this.currentWorkflow();
    const companyId = this.currentCompanyId();

    if (!currentWorkflow || !companyId) {
      return of();
    }

    this.loadingSignal.set(true);

    try {
      const updatedWorkflow = currentWorkflow.addTransition(transition);
      this.currentWorkflowSignal.set(updatedWorkflow);

      return this.updateCompanyWorkflow(companyId, updatedWorkflow).pipe(finalize(() => this.loadingSignal.set(false)));
    } catch {
      this.loadingSignal.set(false);
      this.message.error('添加轉換失敗');
      return of();
    }
  }

  /**
   * 刪除轉換
   */
  removeTransition(transitionId: string): Observable<void> {
    const currentWorkflow = this.currentWorkflow();
    const companyId = this.currentCompanyId();

    if (!currentWorkflow || !companyId) {
      return of();
    }

    this.loadingSignal.set(true);

    try {
      const updatedWorkflow = currentWorkflow.removeTransition(transitionId);
      this.currentWorkflowSignal.set(updatedWorkflow);

      return this.updateCompanyWorkflow(companyId, updatedWorkflow).pipe(finalize(() => this.loadingSignal.set(false)));
    } catch {
      this.loadingSignal.set(false);
      this.message.error('刪除轉換失敗');
      return of();
    }
  }

  /**
   * 設置初始狀態
   */
  setInitialState(stateId: string): Observable<void> {
    const currentWorkflow = this.currentWorkflow();
    const companyId = this.currentCompanyId();

    if (!currentWorkflow || !companyId) {
      return of();
    }

    this.loadingSignal.set(true);

    try {
      const updatedWorkflow = currentWorkflow.setInitialState(stateId);
      this.currentWorkflowSignal.set(updatedWorkflow);

      return this.updateCompanyWorkflow(companyId, updatedWorkflow).pipe(finalize(() => this.loadingSignal.set(false)));
    } catch {
      this.loadingSignal.set(false);
      this.message.error('設置初始狀態失敗');
      return of();
    }
  }

  /**
   * 執行狀態轉換
   */
  executeTransition(targetStateId: string, operator?: string, comment?: string): Observable<void> {
    const currentWorkflow = this.currentWorkflow();
    const companyId = this.currentCompanyId();

    if (!currentWorkflow || !companyId) {
      return of();
    }

    this.loadingSignal.set(true);

    try {
      const updatedWorkflow = currentWorkflow.transitionTo(targetStateId, operator, comment);
      this.currentWorkflowSignal.set(updatedWorkflow);

      return this.updateCompanyWorkflow(companyId, updatedWorkflow).pipe(finalize(() => this.loadingSignal.set(false)));
    } catch {
      this.loadingSignal.set(false);
      this.message.error('狀態轉換失敗');
      return of();
    }
  }

  /**
   * 更新公司的工作流程數據
   */
  private updateCompanyWorkflow(companyId: string, workflow: DynamicWorkflowStateVO): Observable<void> {
    // 獲取當前公司數據
    const companies = this.companyService.companies();
    const currentCompany = companies.find(c => c.id === companyId);

    if (!currentCompany) {
      this.message.error('找不到指定的公司');
      return of();
    }

    // 創建更新數據，包含動態工作流程
    const updateData: any = {
      dynamicWorkflow: workflow.toPlainObject()
    };

    console.log('正在保存工作流程到數據庫:', {
      companyId,
      workflowData: workflow.toPlainObject()
    });

    return this.companyService.updateCompany(companyId, updateData).pipe(
      map(() => {
        console.log('工作流程已成功保存到數據庫');
      }),
      catchError(error => {
        console.error('更新工作流程失敗:', error);
        this.message.error('保存工作流程失敗');
        throw error;
      })
    );
  }

  /**
   * 清除當前工作流程
   */
  clearCurrentWorkflow(): void {
    this.currentCompanyIdSignal.set('');
    this.currentWorkflowSignal.set(null);
  }
}
