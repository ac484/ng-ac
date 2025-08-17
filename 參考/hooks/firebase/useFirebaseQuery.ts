import { BaseFirebaseService, BaseQueryOptions, PaginationOptions } from '@/services/firebase/base';
import { useInfiniteQuery, UseInfiniteQueryOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import type { DocumentData } from 'firebase/firestore';

// 基礎查詢hook
export function useFirebaseQuery<T extends DocumentData>(
  service: BaseFirebaseService<T>,
  options?: BaseQueryOptions,
  queryOptions?: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [service.constructor.name, 'all', options],
    queryFn: () => service.getAll(options),
    ...queryOptions,
  });
}

// 根據ID查詢單個文檔
export function useFirebaseDocument<T extends DocumentData>(
  service: BaseFirebaseService<T>,
  id: string | null | undefined,
  queryOptions?: Omit<UseQueryOptions<T | null, Error>, 'queryKey' | 'queryFn' | 'enabled'>
) {
  return useQuery({
    queryKey: [service.constructor.name, 'document', id],
    queryFn: () => service.getById(id!),
    enabled: !!id,
    ...queryOptions,
  });
}

// 分頁查詢hook
export function useFirebaseInfiniteQuery<T extends DocumentData>(
  service: BaseFirebaseService<T>,
  options: Omit<PaginationOptions, 'startAfter'>,
  queryOptions?: Omit<UseInfiniteQueryOptions<{
    data: T[];
    hasNextPage: boolean;
    lastDoc: any;
  }, Error>, 'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'>
) {
  return useInfiniteQuery({
    queryKey: [service.constructor.name, 'paginated', options],
    queryFn: async ({ pageParam }) => {
      return service.getPaginated({
        ...options,
        startAfter: pageParam,
      });
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.lastDoc : undefined,
    ...queryOptions,
  });
}

// 條件查詢hook
export function useFirebaseQueryWithFilters<T extends DocumentData>(
  service: BaseFirebaseService<T>,
  filters: Array<{ field: string; operator: any; value: any }>,
  options?: Omit<BaseQueryOptions, 'where'>,
  queryOptions?: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [service.constructor.name, 'filtered', filters, options],
    queryFn: () => service.getAll({
      ...options,
      where: filters,
    }),
    ...queryOptions,
  });
}

// 實時查詢hook（使用輪詢模擬實時性）
export function useFirebaseRealtimeQuery<T extends DocumentData>(
  service: BaseFirebaseService<T>,
  options?: BaseQueryOptions,
  refetchInterval: number = 5000, // 每5秒更新一次
  queryOptions?: Omit<UseQueryOptions<T[], Error>, 'queryKey' | 'queryFn' | 'refetchInterval'>
) {
  return useQuery({
    queryKey: [service.constructor.name, 'realtime', options],
    queryFn: () => service.getAll(options),
    refetchInterval,
    refetchIntervalInBackground: true,
    ...queryOptions,
  });
}
