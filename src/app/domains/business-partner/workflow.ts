// workflow-designer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WorkflowState {
    id: string;
    name: string;
    description: string;
    isInitial: boolean;
    isFinal: boolean;
    color: string;
}

interface StateTransition {
    id: string;
    from: string;
    to: string;
    condition: string;
    action: string;
}

@Component({
    selector: 'app-workflow-designer',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">工作流程狀態機設計器</h1>
        <p class="text-gray-600">建立您自己的工作流程狀態機</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 左側：狀態設計 -->
        <div class="space-y-6">
          <!-- 添加狀態 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 flex items-center">
              ⚙️ {{ editingState ? '編輯狀態' : '新增狀態' }}
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  狀態名稱
                </label>
                <input
                  type="text"
                  [(ngModel)]="newStateName"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例：草稿、已提交、審核中..."
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  狀態說明
                </label>
                <textarea
                  [(ngModel)]="newStateDescription"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="說明此狀態的用途..."
                ></textarea>
              </div>
              <div class="flex space-x-2">
                <ng-container *ngIf="editingState; else addStateButton">
                  <button
                    (click)="updateState()"
                    class="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
                  >
                    💾 更新
                  </button>
                  <button
                    (click)="cancelEdit()"
                    class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    取消
                  </button>
                </ng-container>
                <ng-template #addStateButton>
                  <button
                    (click)="addState()"
                    [disabled]="!newStateName.trim()"
                    class="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 flex items-center justify-center"
                  >
                    ➕ 新增狀態
                  </button>
                </ng-template>
              </div>
            </div>
          </div>

          <!-- 狀態列表 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">狀態列表</h2>
            <div class="space-y-2 max-h-60 overflow-y-auto">
              <div
                *ngFor="let state of states"
                [class]="'p-3 rounded-lg border-2 ' + (currentWorkflowState === state.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200')"
                [style.background-color]="state.color"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <h3 class="font-medium">{{ state.name }}</h3>
                      <span
                        *ngIf="state.isInitial"
                        class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                      >
                        初始
                      </span>
                      <span
                        *ngIf="state.isFinal"
                        class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded"
                      >
                        結束
                      </span>
                      <span
                        *ngIf="currentWorkflowState === state.id"
                        class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        當前
                      </span>
                    </div>
                    <p *ngIf="state.description" class="text-sm text-gray-600 mt-1">
                      {{ state.description }}
                    </p>
                  </div>
                  <div class="flex space-x-1">
                    <button
                      (click)="setAsInitialState(state.id)"
                      class="text-green-600 hover:text-green-800 p-1"
                      title="設為初始狀態"
                    >
                      ▶️
                    </button>
                    <button
                      (click)="editState(state)"
                      class="text-blue-600 hover:text-blue-800 p-1"
                      title="編輯"
                    >
                      ✏️
                    </button>
                    <button
                      (click)="deleteState(state.id)"
                      class="text-red-600 hover:text-red-800 p-1"
                      title="刪除"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
              <p *ngIf="states.length === 0" class="text-gray-500 text-center py-4">
                尚未新增任何狀態
              </p>
            </div>
          </div>

          <!-- 新增轉換 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">新增狀態轉換</h2>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    從狀態
                  </label>
                  <select
                    [(ngModel)]="selectedFromState"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選擇狀態</option>
                    <option *ngFor="let state of states" [value]="state.id">
                      {{ state.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    到狀態
                  </label>
                  <select
                    [(ngModel)]="selectedToState"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選擇狀態</option>
                    <option
                      *ngFor="let state of getAvailableToStates()"
                      [value]="state.id"
                    >
                      {{ state.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  轉換條件 / 動作
                </label>
                <input
                  type="text"
                  [(ngModel)]="transitionCondition"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例：提交、審核通過、退回..."
                />
              </div>
              <button
                (click)="addTransition()"
                [disabled]="!selectedFromState || !selectedToState || !transitionCondition.trim()"
                class="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-300 flex items-center justify-center"
              >
                ➡️ 新增轉換
              </button>
            </div>
          </div>
        </div>

        <!-- 右側：流程預覽和執行 -->
        <div class="space-y-6">
          <!-- 轉換列表 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">狀態轉換規則</h2>
            <div class="space-y-2 max-h-60 overflow-y-auto">
              <div
                *ngFor="let transition of transitions"
                class="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div class="flex items-center space-x-2">
                  <span class="font-medium">{{ getStateName(transition.from) }}</span>
                  <span>➡️</span>
                  <span class="font-medium">{{ getStateName(transition.to) }}</span>
                  <span class="text-sm text-gray-600">({{ transition.condition }})</span>
                </div>
                <button
                  (click)="deleteTransition(transition.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
              <p *ngIf="transitions.length === 0" class="text-gray-500 text-center py-4">
                尚未設定任何轉換規則
              </p>
            </div>
          </div>

          <!-- 流程執行 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">流程執行模擬</h2>
            <div *ngIf="currentWorkflowState; else noCurrentState" class="space-y-4">
              <div class="p-4 bg-blue-50 rounded-lg">
                <h3 class="font-medium text-blue-800">
                  當前狀態：{{ getCurrentStateName() }}
                </h3>
                <p class="text-sm text-blue-600 mt-1">
                  {{ getCurrentStateDescription() }}
                </p>
              </div>

              <div>
                <h4 class="font-medium mb-2">可執行的操作：</h4>
                <div class="space-y-2">
                  <button
                    *ngFor="let transition of getAvailableTransitions()"
                    (click)="executeTransition(transition.id)"
                    class="w-full p-3 text-left bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
                  >
                    <div class="font-medium">{{ transition.condition }}</div>
                    <div class="text-sm text-gray-600">→ {{ getStateName(transition.to) }}</div>
                  </button>
                  <p
                    *ngIf="getAvailableTransitions().length === 0"
                    class="text-gray-500 text-center py-4"
                  >
                    此狀態無可執行的轉換操作
                  </p>
                </div>
              </div>
            </div>
            <ng-template #noCurrentState>
              <div class="text-center py-8">
                <p class="text-gray-500">請先新增狀態並設定初始狀態</p>
              </div>
            </ng-template>
          </div>

          <!-- 流程圖視覺化 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">流程圖預覽</h2>
            <div class="bg-gray-50 rounded-lg p-4 min-h-[300px]">
              <div *ngIf="states.length > 0; else noStatesPreview" class="flex flex-wrap gap-4 justify-center items-start">
                <div
                  *ngFor="let state of states"
                  [class]="'relative p-3 rounded-lg border-2 text-center min-w-[120px] ' + (currentWorkflowState === state.id ? 'border-blue-500 shadow-lg' : 'border-gray-300')"
                  [style.background-color]="state.color"
                >
                  <div class="font-medium text-sm">{{ state.name }}</div>
                  <div
                    *ngIf="state.isInitial"
                    class="absolute -top-2 -left-2 w-4 h-4 bg-green-500 rounded-full"
                  ></div>
                  <div
                    *ngIf="state.isFinal"
                    class="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"
                  ></div>
                </div>
              </div>
              <ng-template #noStatesPreview>
                <div class="flex items-center justify-center h-full">
                  <p class="text-gray-500">新增狀態後，此處會顯示流程圖</p>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .transition-colors {
      transition: background-color 0.2s ease;
    }
  `]
})
export class WorkflowDesignerComponent {
    states: WorkflowState[] = [];
    transitions: StateTransition[] = [];
    editingState: WorkflowState | null = null;
    newStateName: string = '';
    newStateDescription: string = '';
    selectedFromState: string = '';
    selectedToState: string = '';
    transitionCondition: string = '';
    currentWorkflowState: string = '';

    // 添加新狀態
    addState(): void {
        if (this.newStateName.trim()) {
            const newState: WorkflowState = {
                id: Date.now().toString(),
                name: this.newStateName.trim(),
                description: this.newStateDescription.trim(),
                isInitial: this.states.length === 0,
                isFinal: false,
                color: `hsl(${Math.random() * 360}, 70%, 85%)`
            };
            this.states.push(newState);
            this.newStateName = '';
            this.newStateDescription = '';

            // 如果是第一個狀態，設為當前狀態
            if (this.states.length === 1) {
                this.currentWorkflowState = newState.id;
            }
        }
    }

    // 編輯狀態
    editState(state: WorkflowState): void {
        this.editingState = state;
        this.newStateName = state.name;
        this.newStateDescription = state.description;
    }

    // 更新狀態
    updateState(): void {
        if (this.editingState && this.newStateName.trim()) {
            const index = this.states.findIndex(s => s.id === this.editingState!.id);
            if (index !== -1) {
                this.states[index] = {
                    ...this.states[index],
                    name: this.newStateName.trim(),
                    description: this.newStateDescription.trim()
                };
            }
            this.cancelEdit();
        }
    }

    // 取消編輯
    cancelEdit(): void {
        this.editingState = null;
        this.newStateName = '';
        this.newStateDescription = '';
    }

    // 刪除狀態
    deleteState(stateId: string): void {
        this.states = this.states.filter(s => s.id !== stateId);
        this.transitions = this.transitions.filter(t => t.from !== stateId && t.to !== stateId);
        if (this.currentWorkflowState === stateId) {
            this.currentWorkflowState = '';
        }
    }

    // 獲取可選的目標狀態
    getAvailableToStates(): WorkflowState[] {
        return this.states.filter(s => s.id !== this.selectedFromState);
    }

    // 添加轉換
    addTransition(): void {
        if (this.selectedFromState && this.selectedToState && this.transitionCondition.trim()) {
            const newTransition: StateTransition = {
                id: Date.now().toString(),
                from: this.selectedFromState,
                to: this.selectedToState,
                condition: this.transitionCondition.trim(),
                action: ''
            };
            this.transitions.push(newTransition);
            this.selectedFromState = '';
            this.selectedToState = '';
            this.transitionCondition = '';
        }
    }

    // 刪除轉換
    deleteTransition(transitionId: string): void {
        this.transitions = this.transitions.filter(t => t.id !== transitionId);
    }

    // 執行狀態轉換
    executeTransition(transitionId: string): void {
        const transition = this.transitions.find(t => t.id === transitionId);
        if (transition) {
            this.currentWorkflowState = transition.to;
        }
    }

    // 設置為初始狀態
    setAsInitialState(stateId: string): void {
        this.states = this.states.map(s => ({
            ...s,
            isInitial: s.id === stateId
        }));
        this.currentWorkflowState = stateId;
    }

    // 切換終止狀態
    toggleFinalState(stateId: string): void {
        const index = this.states.findIndex(s => s.id === stateId);
        if (index !== -1) {
            this.states[index] = {
                ...this.states[index],
                isFinal: !this.states[index].isFinal
            };
        }
    }

    // 獲取可用的轉換
    getAvailableTransitions(): StateTransition[] {
        return this.transitions.filter(t => t.from === this.currentWorkflowState);
    }

    // 獲取狀態名稱
    getStateName(stateId: string): string {
        const state = this.states.find(s => s.id === stateId);
        return state ? state.name : '未知狀態';
    }

    // 獲取當前狀態名稱
    getCurrentStateName(): string {
        const state = this.states.find(s => s.id === this.currentWorkflowState);
        return state ? state.name : '';
    }

    // 獲取當前狀態描述
    getCurrentStateDescription(): string {
        const state = this.states.find(s => s.id === this.currentWorkflowState);
        return state ? state.description : '';
    }
}