// Temporarily disabled - next-intl dependency removed
/*
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// 創建國際化導航 API
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
*/

// Placeholder exports to prevent import errors
export const Link = () => null;
export const redirect = () => null;
export const usePathname = () => '';
export const useRouter = () => ({ replace: () => {} });
export const getPathname = () => '';

