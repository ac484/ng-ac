import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;






export type ContractStatus = "Active" | "Completed" | "On Hold" | "Terminated";

export interface Payment {
  id: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  requestDate: Date;
  paidDate?: Date;
}

export interface ChangeOrder {
  id: string;
  title: string;
  description: string;
  status: "Approved" | "Pending" | "Rejected";
  date: Date;
  impact: {
    cost: number;
    scheduleDays: number;
  };
}

export interface ContractVersion {
  version: number;
  date: Date;
  changeSummary: string;
}

export interface Contract {
  id: string;
  name: string;
  contractor: string;
  client: string;
  startDate: Date;
  endDate: Date;
  totalValue: number;
  status: ContractStatus;
  scope: string;
  payments: Payment[];
  changeOrders: ChangeOrder[];
  versions: ContractVersion[];
}

// Product type definition
export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};
