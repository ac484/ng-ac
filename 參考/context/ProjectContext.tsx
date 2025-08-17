'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Project, Task, TaskStatus } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, writeBatch, Timestamp, onSnapshot } from "firebase/firestore";

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  findProject: (projectId: string) => Project | undefined;
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus) => Promise<void>;
  addTask: (projectId: string, parentTaskId: string | null, taskTitle: string, quantity: number, unitPrice: number) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'tasks'>) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * 處理從 Firestore 獲取的項目數據，轉換為前端可用的格式
   * @param docs - Firestore 文檔數組
   * @returns 處理後的項目數組，包含轉換後的日期和任務
   */
  const processFirestoreProjects = (docs: any[]): Project[] => {
    return docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        startDate: (data.startDate as Timestamp)?.toDate(),
        endDate: (data.endDate as Timestamp)?.toDate(),
        tasks: processFirestoreTasks(data.tasks || [])
      } as Project;
    });
  }
  
  /**
   * 遞歸處理 Firestore 任務數據，確保所有子任務都被正確轉換
   * @param tasks - 任務數組
   * @returns 處理後的任務數組，保持原有的層級結構
   */
  const processFirestoreTasks = (tasks: any[]): Task[] => {
      return tasks.map(task => ({
          ...task,
          lastUpdated: task.lastUpdated, // Should already be ISO string
          subTasks: task.subTasks ? processFirestoreTasks(task.subTasks) : []
      }));
  }

  /**
   * 監聽 Firestore 項目集合的實時變化
   * 當數據發生變化時自動更新本地狀態
   */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (querySnapshot) => {
        const projectsData = processFirestoreProjects(querySnapshot.docs);
        setProjects(projectsData);
        setLoading(false);
    });

    return () => unsub();
  }, []);

  /**
   * 根據項目ID查找特定項目
   * @param projectId - 要查找的項目ID
   * @returns 找到的項目對象，如果未找到則返回 undefined
   */
  const findProject = useCallback((projectId: string) => {
    return projects.find((p) => p.id === projectId);
  }, [projects]);
  
  /**
   * 添加新項目到 Firestore 數據庫
   * @param project - 項目數據（不包含 id 和 tasks 字段）
   * @returns Promise，表示操作完成
   */
  const addProject = async (project: Omit<Project, 'id' | 'tasks'>) => {
    const batch = writeBatch(db);
    const newProjectRef = doc(collection(db, "projects"));
    
    batch.set(newProjectRef, {
        ...project,
        tasks: [],
    });

    await batch.commit();
  };

  /**
   * 更新指定任務的狀態
   * 支持遞歸更新嵌套的子任務狀態
   * @param projectId - 項目ID
   * @param taskId - 要更新的任務ID
   * @param status - 新的任務狀態
   * @returns Promise，表示操作完成
   */
  const updateTaskStatus = async (projectId: string, taskId: string, status: TaskStatus) => {
    const projectRef = doc(db, "projects", projectId);
    const projectData = findProject(projectId);
    if (!projectData) return;

    const updateRecursive = (tasks: Task[]): Task[] => {
      return tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, status, lastUpdated: new Date().toISOString() };
        }
        if (task.subTasks && task.subTasks.length > 0) {
          return { ...task, subTasks: updateRecursive(task.subTasks) };
        }
        return task;
      });
    };

    const newTasks = updateRecursive(projectData.tasks);
    const batch = writeBatch(db);
    batch.update(projectRef, { tasks: newTasks });
    await batch.commit();
  };
  
  /**
   * 添加新任務到指定項目
   * 支持添加到項目根級別或作為特定任務的子任務
   * @param projectId - 項目ID
   * @param parentTaskId - 父任務ID，如果為 null 則添加到項目根級別
   * @param taskTitle - 任務標題
   * @param quantity - 數量
   * @param unitPrice - 單價
   * @returns Promise，表示操作完成
   */
  const addTask = async (projectId: string, parentTaskId: string | null, taskTitle: string, quantity: number, unitPrice: number) => {
    const projectRef = doc(db, "projects", projectId);
    const projectData = findProject(projectId);
    if (!projectData) return;
    
    const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskTitle,
        status: 'Pending',
        lastUpdated: new Date().toISOString(),
        subTasks: [],
        quantity: quantity,
        unitPrice: unitPrice,
        value: quantity * unitPrice,
      };

    const addRecursive = (tasks: Task[]): Task[] => {
        if (parentTaskId === null) {
            return [...tasks, newTask];
        }
        return tasks.map(task => {
            if (task.id === parentTaskId) {
                return {...task, subTasks: [...task.subTasks, newTask]};
            }
            if (task.subTasks && task.subTasks.length > 0) {
                return {...task, subTasks: addRecursive(task.subTasks)};
            }
            return task;
        });
    };
    
    const newTasks = addRecursive(projectData.tasks);
    const batch = writeBatch(db);
    batch.update(projectRef, { tasks: newTasks });
    await batch.commit();
  }

  return (
    <ProjectContext.Provider value={{ projects, loading, addProject, findProject, updateTaskStatus, addTask }}>
      {children}
    </ProjectContext.Provider>
  );
};

/**
 * 自定義 Hook，用於在組件中訪問項目上下文
 * 必須在 ProjectProvider 內部使用
 * @returns 項目上下文對象，包含所有項目相關的狀態和方法
 * @throws 如果在 ProjectProvider 外部使用會拋出錯誤
 */
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
