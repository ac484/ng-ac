// 基礎Firebase hooks
export * from './useFirebaseMutation';
export * from './useFirebaseQuery';

// 具體業務hooks
export * from './useProjects';

// 重新導出基礎服務
export { BaseFirebaseService } from '@/services/firebase/base';
export { projectService } from '@/services/firebase/projects';

