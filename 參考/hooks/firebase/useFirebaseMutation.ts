import { BaseFirebaseService } from '@/services/firebase/base';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import type { DocumentData } from 'firebase/firestore';

// 創建文檔hook
export function useFirebaseCreate<T extends DocumentData>(
  service: BaseFirebaseService<T>,
  mutationOptions?: Omit<UseMutationOptions<string, Error, Omit<T, 'id'>, unknown>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<T, 'id'>) => service.create(data),
    onSuccess: () => {
      // 使相關查詢失效，觸發重新獲取
      queryClient.invalidateQueries({
        queryKey: [service.constructor.name]
      });
    },
    ...mutationOptions,
  });
}

// 更新文檔hook
export function useFirebaseUpdate<T extends DocumentData>(
  service: BaseFirebaseService<T>,
  mutationOptions?: Omit<UseMutationOptions<void, Error, { id: string; data: Partial<T> }, unknown>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => service.update(id, data),
    onSuccess: (_, { id }) => {
      // 使相關查詢失效
      queryClient.invalidateQueries({
        queryKey: [service.constructor.name]
      });
      queryClient.invalidateQueries({
        queryKey: [service.constructor.name, 'document', id]
      });
    },
    ...mutationOptions,
  });
}

// 刪除文檔hook
export function useFirebaseDelete<T extends DocumentData>(
  service: BaseFirebaseService<T>,
  mutationOptions?: Omit<UseMutationOptions<void, Error, string, unknown>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => service.delete(id),
    onSuccess: (_, id) => {
      // 使相關查詢失效
      queryClient.invalidateQueries({
        queryKey: [service.constructor.name]
      });
      queryClient.invalidateQueries({
        queryKey: [service.constructor.name, 'document', id]
      });

      // 從緩存中移除已刪除的文檔
      queryClient.removeQueries({
        queryKey: [service.constructor.name, 'document', id]
      });
    },
    ...mutationOptions,
  });
}

// 批量操作hook
export function useFirebaseBatch<T extends DocumentData>(
  service: BaseFirebaseService<T>,
  mutationOptions?: Omit<UseMutationOptions<void, Error, Array<{
    type: 'create' | 'update' | 'delete';
    data?: Partial<T>;
    id?: string;
  }>, unknown>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (operations: Array<{
      type: 'create' | 'update' | 'delete';
      data?: Partial<T>;
      id?: string;
    }>) => service.batch(operations),
    onSuccess: () => {
      // 使所有相關查詢失效
      queryClient.invalidateQueries({
        queryKey: [service.constructor.name]
      });
    },
    ...mutationOptions,
  });
}

// 樂觀更新hook（創建）
export function useFirebaseCreateOptimistic<T extends DocumentData>(
  service: BaseFirebaseService<T>,
  mutationOptions?: Omit<UseMutationOptions<string, Error, Omit<T, 'id'>, unknown>, 'mutationFn' | 'onMutate' | 'onError' | 'onSettled'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<T, 'id'>) => service.create(data),
    onMutate: async (newData) => {
      // 取消任何正在進行的查詢
      await queryClient.cancelQueries({
        queryKey: [service.constructor.name]
      });

      // 保存之前的數據
      const previousData = queryClient.getQueryData([service.constructor.name]);

      // 樂觀更新：添加臨時ID
      const tempId = `temp-${Date.now()}`;
      const optimisticData = { id: tempId, ...newData } as T;

      queryClient.setQueryData([service.constructor.name], (old: T[] | undefined) => {
        return old ? [...old, optimisticData] : [optimisticData];
      });

      return { previousData, tempId };
    },
    onError: (err, newData, context) => {
      // 發生錯誤時恢復之前的數據
      if (context?.previousData) {
        queryClient.setQueryData([service.constructor.name], context.previousData);
      }
    },
    onSettled: () => {
      // 無論成功還是失敗，都重新獲取數據
      queryClient.invalidateQueries({
        queryKey: [service.constructor.name]
      });
    },
    ...mutationOptions,
  });
}

// 樂觀更新hook（更新）
export function useFirebaseUpdateOptimistic<T extends DocumentData>(
  service: BaseFirebaseService<T>,
  mutationOptions?: Omit<UseMutationOptions<void, Error, { id: string; data: Partial<T> }, unknown>, 'mutationFn' | 'onMutate' | 'onError' | 'onSettled'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => service.update(id, data),
    onMutate: async ({ id, data }) => {
      // 取消任何正在進行的查詢
      await queryClient.cancelQueries({
        queryKey: [service.constructor.name]
      });
      await queryClient.cancelQueries({
        queryKey: [service.constructor.name, 'document', id]
      });

      // 保存之前的數據
      const previousData = queryClient.getQueryData([service.constructor.name]);
      const previousDocument = queryClient.getQueryData([service.constructor.name, 'document', id]);

      // 樂觀更新列表
      queryClient.setQueryData([service.constructor.name], (old: T[] | undefined) => {
        if (!old) return old;
        return old.map(item =>
          item.id === id ? { ...item, ...data } : item
        );
      });

      // 樂觀更新單個文檔
      queryClient.setQueryData([service.constructor.name, 'document', id], (old: T | null) => {
        if (!old) return old;
        return { ...old, ...data };
      });

      return { previousData, previousDocument };
    },
    onError: (err, { id }, context) => {
      // 發生錯誤時恢復之前的數據
      if (context?.previousData) {
        queryClient.setQueryData([service.constructor.name], context.previousData);
      }
      if (context?.previousDocument) {
        queryClient.setQueryData([service.constructor.name, 'document', id], context.previousDocument);
      }
    },
    onSettled: (_, __, { id }) => {
      // 重新獲取數據
      queryClient.invalidateQueries({
        queryKey: [service.constructor.name]
      });
      queryClient.invalidateQueries({
        queryKey: [service.constructor.name, 'document', id]
      });
    },
    ...mutationOptions,
  });
}

// 樂觀更新hook（刪除）
export function useFirebaseDeleteOptimistic<T extends DocumentData>(
  service: BaseFirebaseService<T>,
  mutationOptions?: Omit<UseMutationOptions<void, Error, string, unknown>, 'mutationFn' | 'onMutate' | 'onError' | 'onSettled'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => service.delete(id),
    onMutate: async (id) => {
      // 取消任何正在進行的查詢
      await queryClient.cancelQueries({
        queryKey: [service.constructor.name]
      });
      await queryClient.cancelQueries({
        queryKey: [service.constructor.name, 'document', id]
      });

      // 保存之前的數據
      const previousData = queryClient.getQueryData([service.constructor.name]);
      const previousDocument = queryClient.getQueryData([service.constructor.name, 'document', id]);

      // 樂觀更新：從列表中移除
      queryClient.setQueryData([service.constructor.name], (old: T[] | undefined) => {
        if (!old) return old;
        return old.filter(item => item.id !== id);
      });

      // 樂觀更新：清空單個文檔
      queryClient.setQueryData([service.constructor.name, 'document', id], null);

      return { previousData, previousDocument };
    },
    onError: (err, id, context) => {
      // 發生錯誤時恢復之前的數據
      if (context?.previousData) {
        queryClient.setQueryData([service.constructor.name], context.previousData);
      }
      if (context?.previousDocument) {
        queryClient.setQueryData([service.constructor.name, 'document', id], context.previousDocument);
      }
    },
    onSettled: (_, __, id) => {
      // 重新獲取數據
      queryClient.invalidateQueries({
        queryKey: [service.constructor.name]
      });
      queryClient.invalidateQueries({
        queryKey: [service.constructor.name, 'document', id]
      });
    },
    ...mutationOptions,
  });
}
