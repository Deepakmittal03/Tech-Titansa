'use client';

import * as React from 'react';
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  Zap,
  QrCode,
  Copy,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  CreditCard,
  DoorOpen,
  Activity,
  ChevronRight,
  BarChart3,
  PieChart,
  Clock,
  Store,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { RevenueChart } from '@/components/charts/revenue-chart';
import { SalesBarChart } from '@/components/charts/sales-bar-chart';
import { CategoryPieChart } from '@/components/charts/category-pie-chart';
import { OrdersTrendChart } from '@/components/charts/orders-trend-chart';
import { PaymentDistributionChart } from '@/components/charts/payment-distribution-chart';
import { PeakHoursChart } from '@/components/charts/peak-hours-chart';
import { TopProductsChart } from '@/components/charts/top-products-chart';
import { StorePerformanceChart } from '@/components/charts/store-performance-chart';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { DataStore } from '@/lib/data-store';
import { useAppStore } from '@/store';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { currentStore } = useAppStore();
  const [timeRange, setTimeRange] = React.useState<'today' | 'week' | 'month'>('today');
  const [chartView, setChartView] = React.useState<'revenue' | 'products' | 'store'>('revenue');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [simulationResult, setSimulationResult] = React.useState<any>(null);
  const [isSimulating, setIsSimulating] = React.useState(false);

  // Compute metrics live from DataStore
  const [data, setData] = React.useState(() => DataStore.getDashboardMetrics(currentStore));

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  const handleSimulateCheckout = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = DataStore.simulateCustomerCheckout(currentStore === 'all' ? 'store-1' : currentStore);
      if (res) {
        setData(DataStore.getDashboardMetrics(currentStore));
        setSimulationResult(res);
        playChime();
        toast.success(`⚡ Self-Checkout Order ${res.order.order_number} simulated!`, {
          description: `₹${res.order.total} collected via Razorpay UPI. Exit Pass ready!`,
        });
      }
      setIsSimulating(false);
    }, 450);
  };

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData(DataStore.getDashboardMetrics(currentStore));
      setIsRefreshing(false);
      toast.success('Dashboard telemetry synchronized with retail engine');
    }, 400);
  };

  React.useEffect(() => {
    setData(DataStore.getDashboardMetrics(currentStore));
  }, [currentStore]);

  // Derived Trend Data
  const revenueTrendData = [
    { date: '10:00 AM', revenue: 4200, orders: 12 },
    { date: '12:00 PM', revenue: 9800, orders: 28 },
    { date: '02:00 PM', revenue: 14200, orders: 42 },
    { date: '04:00 PM', revenue: 18900, orders: 55 },
    { date: '06:00 PM', revenue: 27400, orders: 81 },
    { date: '08:00 PM', revenue: 34950, orders: 104 },
  ];

  const salesPerformanceData = [
    { label: 'Mon', sales: 42000 },
    { label: 'Tue', sales: 48500 },
    { label: 'Wed', sales: 52100 },
    { label: 'Thu', sales: 49800 },
    { label: 'Fri', sales: 68400 },
    { label: 'Sat', sales: 89500 },
    { label: 'Sun', sales: 94200 },
  ];

  const ordersTrendData = [
    { date: 'Mon', orders: 110, completed: 108 },
    { date: 'Tue', orders: 128, completed: 125 },
    { date: 'Wed', orders: 145, completed: 143 },
    { date: 'Thu', orders: 132, completed: 130 },
    { date: 'Fri', orders: 195, completed: 192 },
    { date: 'Sat', orders: 248, completed: 245 },
    { date: 'Sun', orders: 265, completed: 261 },
  ];

  const peakHoursData = [
    { hour: '10 AM', customers: 24 },
    { hour: '12 PM', customers: 58 },
    { hour: '2 PM', customers: 45 },
    { hour: '4 PM', customers: 68 },
    { hour: '6 PM', customers: 112 },
    { hour: '8 PM', customers: 145 },
    { hour: '10 PM', customers: 42 },
  ];

  const storePerformanceData = [
    { store: 'Connaught Pl', revenue: 124500, orders: 342 },
    { store: 'CyberHub', revenue: 98400, orders: 265 },
    { store: 'Indiranagar', revenue: 112000, orders: 298 },
    { store: 'Powai', revenue: 86500, orders: 215 },
  ];

  return (
    <div className="space-y-6">
      {/* 🚀 Hero Command Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
        {/* Subtle Ambient Red Glow */}
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-500/10 dark:bg-red-500/15 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-950/80 px-2.5 py-0.5 text-xs font-bold text-red-700 dark:text-red-400">
                <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                peNgo Retail Cloud 2.0
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                Turnstiles 100% Operational
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Autonomous Store Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Centralized self-checkout infrastructure, instant digital payments, and cryptographic QR exit verification gate operations.
            </p>
          </div>

          {/* Quick Action Dock */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <Button
              onClick={handleSimulateCheckout}
              disabled={isSimulating}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs gap-1.5 shadow-md shadow-red-600/25 h-9 px-3.5"
            >
              <Zap className={`h-3.5 w-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? 'Simulating...' : 'Simulate Customer Checkout'}
            </Button>

            <Link href="/exit-verification">
              <Button variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs gap-1.5 h-9">
                <QrCode className="h-3.5 w-3.5 text-red-600" />
                Exit Gate Scanner
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              disabled={isRefreshing}
              className="h-9 px-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              title="Sync Data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Live Operational Telemetry Bar */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-slate-500">Avg Checkout Speed:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">14.2s (4.8x faster)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-slate-500">Gate Scan Latency:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">0.38s</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <span className="text-slate-500">Exit Clearance:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">99.8%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-slate-500">Walkout Fraud:</span>
            <span className="font-bold text-emerald-600">0 Reported</span>
          </div>
        </div>
      </div>

      {/* 📱 The 4-Stage peNgo Self-Checkout Architecture Pipeline */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-red-600" />
            How peNgo Works: Customer Journey & Turnstile Architecture
          </span>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Frictionless Cashierless Retail Lifecycle
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Step 1 */}
          <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 space-y-1 relative group hover:border-red-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 font-bold text-xs">
                1
              </span>
              <Smartphone className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors" />
            </div>
            <p className="font-bold text-xs text-slate-900 dark:text-slate-100 pt-1">
              Scan Barcode / QR
            </p>
            <p className="text-[11px] text-slate-500 leading-tight">
              Customer scans items directly from shelves using the peNgo mobile app.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 space-y-1 relative group hover:border-emerald-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 font-bold text-xs">
                2
              </span>
              <CreditCard className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="font-bold text-xs text-slate-900 dark:text-slate-100 pt-1">
              One-Tap Digital Pay
            </p>
            <p className="text-[11px] text-slate-500 leading-tight">
              Instant UPI / Card via Razorpay. Stock decrements atomically on payment.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 space-y-1 relative group hover:border-purple-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 font-bold text-xs">
                3
              </span>
              <QrCode className="h-4 w-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
            </div>
            <p className="font-bold text-xs text-slate-900 dark:text-slate-100 pt-1">
              Dynamic Exit Pass
            </p>
            <p className="text-[11px] text-slate-500 leading-tight">
              A cryptographic single-use QR pass is minted with a 60-minute hard expiry.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 space-y-1 relative group hover:border-blue-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold text-xs">
                4
              </span>
              <DoorOpen className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <p className="font-bold text-xs text-slate-900 dark:text-slate-100 pt-1">
              Turnstile Gate Exit
            </p>
            <p className="text-[11px] text-slate-500 leading-tight">
              Gate scanner validates & burns token server-side in 0.38s. Turnstile unlocks.
            </p>
          </div>
        </div>
      </div>

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Revenue */}
        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 relative overflow-hidden bg-gradient-to-br from-white to-red-50/40 dark:from-slate-900 dark:to-red-950/10 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Revenue
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/80 dark:text-red-400 shadow-xs">
                <IndianRupee className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {formatCurrency(data.kpi.totalRevenue)}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+14.8% vs last week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Today's Sales */}
        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Today&apos;s Sales
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 shadow-xs">
                <ShoppingCart className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {formatCurrency(data.kpi.todaySales)}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">
                Live across 4 store counters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Total Orders */}
        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Orders
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950/80 dark:text-sky-400 shadow-xs">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {data.kpi.totalOrders}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">
                {data.kpi.successfulTransactions} gate clearances
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 4. Active Customers */}
        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Shoppers
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 shadow-xs">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {data.kpi.activeCustomers}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">
                Registered retail loyalty profiles
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 5. Average Order Value */}
        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Avg Order Value
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400 shadow-xs">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {formatCurrency(data.kpi.avgOrderValue)}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">
                Per customer basket
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 6. Total SKUs */}
        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Catalog SKUs
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 shadow-xs">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {data.kpi.totalProducts}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">
                Active shelf inventory
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 7. Low Stock Products */}
        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Stock Attention
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 shadow-xs">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                {data.kpi.lowStockProducts + data.kpi.outOfStockProducts} SKUs
              </div>
              <p className="mt-1 text-[11px] text-slate-500 font-medium">
                {data.kpi.lowStockProducts} Low • {data.kpi.outOfStockProducts} Out of Stock
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 8. Successful Transactions */}
        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Gate Clearances
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 shadow-xs">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {data.kpi.successfulTransactions}
              </div>
              <p className="mt-1 text-[11px] text-emerald-600 font-semibold">
                100% Verified Server-Side
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 📊 Interactive Analytics Hub */}
      <div className="space-y-4">
        {/* View Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Retail Intelligence & Operations
            </span>
            <Badge variant="outline" className="text-[10px] text-red-600 border-red-200">
              Real Database Telemetry
            </Badge>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-xs dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <button
              onClick={() => setChartView('revenue')}
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                chartView === 'revenue'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              Revenue & Orders
            </button>
            <button
              onClick={() => setChartView('products')}
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                chartView === 'products'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              Categories & SKUs
            </button>
            <button
              onClick={() => setChartView('store')}
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                chartView === 'store'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              Footfall & Branches
            </button>
          </div>
        </div>

        {/* View 1: Revenue & Orders */}
        {chartView === 'revenue' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-200">
            <Card className="lg:col-span-2 rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-base font-bold">Hourly Revenue & Checkout Velocity</CardTitle>
                  <CardDescription>Live customer basket checkouts across stores</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                  Live Stream
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                <RevenueChart data={revenueTrendData} height={280} />
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Weekly Sales Trend</CardTitle>
                <CardDescription>7-day rolling performance</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <SalesBarChart data={salesPerformanceData} height={280} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* View 2: Categories & SKUs */}
        {chartView === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in-50 duration-200">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Category-wise Sales Contribution</CardTitle>
                <CardDescription>Revenue share by supermarket aisle</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <CategoryPieChart data={data.categoryDistribution} height={280} />
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Top Selling Products by Velocity</CardTitle>
                <CardDescription>Highest unit turnover items</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <TopProductsChart data={data.topProducts} height={280} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* View 3: Footfall & Stores */}
        {chartView === 'store' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in-50 duration-200">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Peak In-Store Shopping Hours</CardTitle>
                <CardDescription>Turnstile traffic distribution throughout the day</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <PeakHoursChart data={peakHoursData} height={280} />
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Multi-Outlet Revenue Comparison</CardTitle>
                <CardDescription>Branch breakdown across Delhi-NCR & Mumbai</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <StorePerformanceChart data={storePerformanceData} height={280} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Section: Recent Self-Checkout Orders & Security Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 cols) */}
        <Card className="lg:col-span-2 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold">Recent Self-Checkout Transactions</CardTitle>
              <CardDescription>Orders completed via mobile app & scanned at turnstile</CardDescription>
            </div>
            <Link href="/orders">
              <Button variant="ghost" size="sm" className="text-xs text-red-600 gap-1 font-semibold">
                View All
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Order ID</TableHead>
                  <TableHead className="text-xs">Customer</TableHead>
                  <TableHead className="text-xs">Items</TableHead>
                  <TableHead className="text-xs text-right">Total</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <TableCell className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {order.order_number}
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {order.customer?.name || 'Walk-in Shopper'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {order.items?.length || 1} items
                    </TableCell>
                    <TableCell className="text-xs font-mono font-bold text-right">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={order.status === 'completed' ? 'success' : order.status === 'paid' ? 'info' : 'warning'}
                        className="text-[10px] uppercase font-bold"
                      >
                        {order.status === 'completed' ? 'Gate Cleared' : order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 text-right font-mono">
                      {formatDateTime(order.created_at).slice(11, 19)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Security Watchlist (1 col) */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-600" />
              <div>
                <CardTitle className="text-base font-bold">Security Watchlist</CardTitle>
                <CardDescription>Gate & cart anomalies</CardDescription>
              </div>
            </div>
            <Link href="/fraud-detection">
              <Button variant="ghost" size="sm" className="text-xs text-red-600 gap-1 font-semibold">
                Details
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {data.alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant={alert.risk_level === 'high' ? 'destructive' : alert.risk_level === 'medium' ? 'warning' : 'info'}
                    className="text-[10px] uppercase font-bold"
                  >
                    {alert.risk_level} Risk
                  </Badge>
                  <span className="text-[10px] text-slate-400">
                    {formatDateTime(alert.created_at)}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {alert.title}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {alert.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Simulation Result Modal */}
      {simulationResult && (
        <Dialog open={!!simulationResult} onOpenChange={() => setSimulationResult(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold">Transaction Simulated</DialogTitle>
                  <DialogDescription className="text-xs">
                    Customer completed mobile self-checkout
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/30 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Order Number</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{simulationResult.order.order_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Customer</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{simulationResult.customer.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Total Paid</span>
                  <span className="font-bold text-emerald-600 text-sm">{formatCurrency(simulationResult.order.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Payment Gateway</span>
                  <Badge variant="success" className="text-[10px]">Razorpay UPI • Captured</Badge>
                </div>
              </div>

              {/* QR Token box */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <QrCode className="h-3.5 w-3.5 text-red-600" />
                    Generated Exit Pass Token
                  </span>
                  <Badge variant="outline" className="text-[10px] text-red-600 border-red-200 dark:border-red-900">Single-Use</Badge>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 break-all select-all flex items-center justify-between">
                  <span>{simulationResult.token}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(simulationResult.token);
                      toast.success('Pass token copied to clipboard!');
                    }}
                    className="h-6 w-6 p-0 shrink-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Stock decremented atomically in background. This token is ready to be validated at the Exit Gate turnstile.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Link href={`/exit-verification?token=${simulationResult.token}`} className="flex-1">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    Verify at Exit Gate Now
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setSimulationResult(null)}
                  className="text-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
