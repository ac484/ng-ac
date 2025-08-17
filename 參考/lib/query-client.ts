import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分鐘內數據被認為是新鮮的
      gcTime: 10 * 60 * 1000,   // 10分鐘後從緩存中清理
      retry: 3,                  // 失敗時重試3次
      refetchOnWindowFocus: false, // 窗口聚焦時不重新獲取
      refetchOnReconnect: true,   // 重新連接時重新獲取
    },
    mutations: {
      retry: 1,                  // 變更操作失敗時重試1次
    },
  },
});

// 導出QueryClient實例供其他地方使用
export default queryClient;
