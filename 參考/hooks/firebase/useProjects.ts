import { projectService } from '@/services/firebase/projects';
import type { TaskStatus } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    useFirebaseCreate,
    useFirebaseCreateOptimistic,
    useFirebaseDelete,
    useFirebaseDeleteOptimistic,
    useFirebaseUpdate,
    useFirebaseUpdateOptimistic
} from './useFirebaseMutation';
import {
    useFirebaseDocument,
    useFirebaseInfiniteQuery,
    useFirebaseQuery,
    useFirebaseQueryWithFilters,
    useFirebaseRealtimeQuery
} from './useFirebaseQuery';

// 獲取所有項目
export function useProjects() {
  return useFirebaseQuery(projectService);
}

// 獲取活躍項目
export function useActiveProjects() {
  return useFirebaseQuery(projectService, {
    where: [{ field: 'status', operator: '==', value: 'active' }],
    orderBy: { field: 'startDate', direction: 'desc' }
  });
}

// 根據ID獲取單個項目
export function useProject(id: string | null | undefined) {
  return useFirebaseDocument(projectService, id);
}

// 分頁獲取項目
export function useProjectsPaginated(pageSize: number = 10) {
  return useFirebaseInfiniteQuery(projectService, {
    pageSize,
    orderBy: { field: 'startDate', direction: 'desc' }
  });
}

// 根據客戶獲取項目
export function useProjectsByClient(clientId: string | null | undefined) {
  return useFirebaseQueryWithFilters(
    projectService,
    clientId ? [{ field: 'clientId', operator: '==', value: clientId }] : [],
    { orderBy: { field: 'startDate', direction: 'desc' } },
    { enabled: !!clientId }
  );
}

// 實時獲取項目（每30秒更新）
export function useProjectsRealtime() {
  return useFirebaseRealtimeQuery(projectService, undefined, 30000);
}

// 搜索項目
export function useProjectsSearch(searchTerm: string) {
  return useFirebaseQuery(projectService, undefined, {
    enabled: searchTerm.length > 0,
    queryFn: () => projectService.searchProjects(searchTerm)
  });
}

// 獲取即將到期的項目
export function useUpcomingDeadlines(days: number = 7) {
  return useFirebaseQuery(projectService, {
    where: [{ field: 'status', operator: '==', value: 'active' }]
  }, {
    queryFn: () => projectService.getUpcomingDeadlines(days)
  });
}

// 創建項目
export function useCreateProject() {
  return useFirebaseCreate(projectService);
}

// 樂觀創建項目
export function useCreateProjectOptimistic() {
  return useFirebaseCreateOptimistic(projectService);
}

// 更新項目
export function useUpdateProject() {
  return useFirebaseUpdate(projectService);
}

// 樂觀更新項目
export function useUpdateProjectOptimistic() {
  return useFirebaseUpdateOptimistic(projectService);
}

// 刪除項目
export function useDeleteProject() {
  return useFirebaseDelete(projectService);
}

// 樂觀刪除項目
export function useDeleteProjectOptimistic() {
  return useFirebaseDeleteOptimistic(projectService);
}

// 更新任務狀態
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, taskId, status }: {
      projectId: string;
      taskId: string;
      status: TaskStatus;
    }) => projectService.updateTaskStatus(projectId, taskId, status),
    onSuccess: (_, { projectId }) => {
      // 使相關查詢失效
      queryClient.invalidateQueries({
        queryKey: [projectService.constructor.name]
      });
      queryClient.invalidateQueries({
        queryKey: [projectService.constructor.name, 'document', projectId]
      });
    },
  });
}

// 添加任務
export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      parentTaskId,
      taskTitle,
      quantity,
      unitPrice
    }: {
      projectId: string;
      parentTaskId: string | null;
      taskTitle: string;
      quantity: number;
      unitPrice: number;
    }) => projectService.addTask(projectId, parentTaskId, taskTitle, quantity, unitPrice),
    onSuccess: (_, { projectId }) => {
      // 使相關查詢失效
      queryClient.invalidateQueries({
        queryKey: [projectService.constructor.name]
      });
      queryClient.invalidateQueries({
        queryKey: [projectService.constructor.name, 'document', projectId]
      });
    },
  });
}

// 獲取項目進度
export function useProjectProgress(projectId: string | null | undefined) {
  return useQuery({
    queryKey: ['project-progress', projectId],
    queryFn: () => projectService.getProjectProgress(projectId!),
    enabled: !!projectId,
  });
}

// 獲取項目統計
export function useProjectStats() {
  return useQuery({
    queryKey: ['project-stats'],
    queryFn: () => projectService.getProjectStats(),
    staleTime: 5 * 60 * 1000, // 5分鐘內不重新獲取
  });
}
