'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAppStore, useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const ROUTE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Executive Overview', subtitle: 'Live multi-store sales, revenue metrics & checkout traffic' },
  '/products': { title: 'Product Catalog', subtitle: 'Manage SKUs, barcodes, pricing and category allocations' },
  '/categories': { title: 'Category Management', subtitle: 'Structure department aisles and tax classes' },
  '/inventory': { title: 'Inventory & Stock Hub', subtitle: 'Real-time stock levels, batch numbers, alerts & transfers' },
  '/orders': { title: 'Orders & Digital Bills', subtitle: 'Real-time self-checkout transactions and digital receipts' },
  '/exit-verification': { title: 'Smart Exit Verification', subtitle: 'Server-side QR code validation & single-use gate clearance' },
  '/payments': { title: 'Financial & Gateway Reconciliation', subtitle: 'UPI, Card & Razorpay settlements, daily GST summaries' },
  '/coupons': { title: 'Coupons & Promotional Campaigns', subtitle: 'Manage dynamic discounts, cart thresholds and usage limits' },
  '/ai-insights': { title: 'AI Business Intelligence', subtitle: 'Machine learning demand forecasts, replenishment & anomaly detection' },
  '/fraud-detection': { title: 'Fraud & Security Operations', subtitle: 'Duplicate pass detection, cart tampering & risk categorization' },
  '/customers': { title: 'Customer Relationship Management', subtitle: 'Shopper profiles, loyalty points and purchase history' },
  '/stores': { title: 'Store Network Operations', subtitle: 'Multi-outlet management, branch performance and inventory transfers' },
  '/reports': { title: 'Analytics & Financial Exports', subtitle: 'Generate PDF, CSV audits and operational reports' },
  '/notifications': { title: 'System Notification Center', subtitle: 'Real-time operational alerts, stock triggers and security logs' },
  '/settings': { title: 'System Settings', subtitle: 'Store parameters, tax rules and role permissions' },
};

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { user, role, clearAuth } = useAuthStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentInfo = ROUTE_TITLES[pathname] || {
    title: 'peNgo Command Center',
    subtitle: 'Smart Retail Enterprise Management',
  };

  const handleLogout = () => {
    clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-all">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 sm:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {currentInfo.title}
          </h1>
          <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Tools, Search & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Simulator CTA */}
        <Link
          href="/exit-verification"
          className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 text-xs font-semibold hover:bg-red-100 transition-colors border border-red-200/60 dark:border-red-800/60"
        >
          <ShieldCheck className="h-4 w-4 text-red-600" />
          <span>Exit Pass Scanner</span>
          <Badge variant="destructive" className="ml-1 text-[10px] px-1 py-0 h-4">
            LIVE
          </Badge>
        </Link>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block w-48 md:w-64">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU, order, QR... (⌘K)"
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-slate-700 dark:bg-slate-800/60 dark:focus:bg-slate-800 transition-all"
          />
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          title="Toggle Theme"
        >
          {mounted ? (
            theme === 'dark' ? (
              <Moon className="h-4 w-4 transition-all text-slate-200" />
            ) : (
              <Sun className="h-4 w-4 transition-all text-slate-700" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-slate-900" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="right" className="w-80 p-2">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Live Alerts</span>
              <Badge variant="warning" className="text-[10px]">3 New</Badge>
            </div>
            <div className="py-1 space-y-1">
              <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 text-xs text-amber-900 dark:text-amber-200">
                <p className="font-semibold">Low Stock Alert: Amul Milk 1L</p>
                <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">18 units left (Threshold: 25)</p>
              </div>
              <div className="p-2 rounded-lg bg-rose-50/70 dark:bg-rose-950/40 text-xs text-rose-900 dark:text-rose-200">
                <p className="font-semibold">Security: Duplicate QR Scan</p>
                <p className="text-[10px] text-rose-700 dark:text-rose-400 mt-0.5">Gate 2 reported reuse attempt of Exit Pass 9841</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <Link href="/notifications" className="block text-center text-xs font-medium text-red-600 hover:underline py-1">
              View All Notifications
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 font-bold text-xs text-white shadow-sm">
                {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : 'VM'}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="right" className="w-56 p-1.5">
            <div className="px-2 py-1.5">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {user?.full_name || 'Vikram Malhotra'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user?.email || 'admin@pengo.retail'}
              </p>
              <Badge variant="secondary" className="mt-1 text-[10px] uppercase font-semibold">
                {role ? role.replace('_', ' ') : 'Super Admin'}
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/settings" className="w-full cursor-pointer">
                Settings & Store Parameters
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/exit-verification" className="w-full cursor-pointer">
                Switch to Gate Verification Mode
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 dark:text-red-400 cursor-pointer font-semibold"
            >
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
