'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingCart,
  QrCode,
  Users,
  TicketPercent,
  CreditCard,
  Sparkles,
  ShieldAlert,
  Store as StoreIcon,
  FileSpreadsheet,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useAppStore } from '@/store';
import { Badge } from '@/components/ui/badge';
import { DataStore } from '@/lib/data-store';
import type { Store } from '@/types/database';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: 'default' | 'destructive' | 'warning' | 'info';
  roles?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      {
        title: 'Executive Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'CATALOG & INVENTORY',
    items: [
      {
        title: 'Products',
        href: '/products',
        icon: Package,
      },
      {
        title: 'Categories',
        href: '/categories',
        icon: Layers,
      },
      {
        title: 'Inventory & Stock',
        href: '/inventory',
        icon: Boxes,
        badge: 'Low Stock',
        badgeVariant: 'warning',
      },
    ],
  },
  {
    title: 'CHECKOUT & SALES',
    items: [
      {
        title: 'Orders & Bills',
        href: '/orders',
        icon: ShoppingCart,
      },
      {
        title: 'Exit Verification',
        href: '/exit-verification',
        icon: QrCode,
        badge: 'Live',
        badgeVariant: 'default',
      },
      {
        title: 'Payments & Revenue',
        href: '/payments',
        icon: CreditCard,
      },
      {
        title: 'Coupons & Offers',
        href: '/coupons',
        icon: TicketPercent,
      },
    ],
  },
  {
    title: 'INTELLIGENCE & SECURITY',
    items: [
      {
        title: 'AI Insights & Forecast',
        href: '/ai-insights',
        icon: Sparkles,
        badge: 'AI',
        badgeVariant: 'info',
      },
      {
        title: 'Fraud & Security',
        href: '/fraud-detection',
        icon: ShieldAlert,
        badge: 'Alerts',
        badgeVariant: 'destructive',
      },
      {
        title: 'Customers (CRM)',
        href: '/customers',
        icon: Users,
      },
      {
        title: 'Reports & Exports',
        href: '/reports',
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    title: 'ADMINISTRATION',
    items: [
      {
        title: 'Stores & Outlets',
        href: '/stores',
        icon: StoreIcon,
      },
      {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
      },
      {
        title: 'System Settings',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, currentStore, setCurrentStore } = useAppStore();
  const { user, role, clearAuth } = useAuthStore();
  const [stores, setStores] = React.useState<Store[]>([]);

  React.useEffect(() => {
    setStores(DataStore.getStores());
  }, []);

  const handleLogout = () => {
    clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 h-screen border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 flex flex-col',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-600/20 font-black text-xl tracking-tighter">
            p<span className="text-white font-extrabold">N</span>
          </div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center">
                pe<span className="text-red-600">N</span>go
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Command Center
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Store Quick Switcher (when expanded) */}
      {sidebarOpen && (
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs">
            <StoreIcon className="h-3.5 w-3.5 text-red-600 shrink-0" />
            <select
              value={currentStore}
              onChange={(e) => setCurrentStore(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-medium w-full focus:outline-none cursor-pointer truncate"
            >
              <option value="all">All Stores (National Hub)</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {sidebarOpen && (
              <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 font-semibold border-l-2 border-red-600 pl-2.5 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
                    )}
                    title={!sidebarOpen ? item.title : undefined}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      )}
                    />
                    {sidebarOpen && (
                      <span className="flex-1 truncate">{item.title}</span>
                    )}
                    {sidebarOpen && item.badge && (
                      <Badge
                        variant={item.badgeVariant || 'default'}
                        className="ml-auto text-[10px] px-1.5 py-0"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer Card */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200">
            {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : 'VM'}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                {user?.full_name || 'Vikram Malhotra'}
              </p>
              <p className="truncate text-[10px] text-slate-500 uppercase font-medium">
                {role ? role.replace('_', ' ') : 'Super Admin'}
              </p>
            </div>
          )}
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-red-600 dark:hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
