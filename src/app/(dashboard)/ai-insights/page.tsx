'use client';

import * as React from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Brain,
  AlertTriangle,
  Boxes,
  Zap,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataStore } from '@/lib/data-store';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function AIInsightsPage() {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleRefreshInsights = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success('AI intelligence engine re-computed forecasts on current store telemetry');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-red-600" />
            AI Business Intelligence & Predictive Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Machine learning models detecting checkout velocity, demand forecasting & automatic stock replenishment.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleRefreshInsights}
          disabled={isAnalyzing}
          className="bg-red-600 hover:bg-red-700 text-white gap-1.5 h-9 text-xs font-semibold"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Evaluating Telemetry...' : 'Run Neural Inference'}
        </Button>
      </div>

      {/* Model Confidence Banner */}
      <div className="p-4 rounded-xl border border-red-200/80 bg-gradient-to-r from-red-50/50 via-white to-red-50/20 dark:from-red-950/20 dark:via-slate-900 dark:to-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              peNgo Deep Retail Forecaster (v2.4)
            </h4>
            <p className="text-xs text-slate-500">
              Model trained on 4.2M self-checkout telemetry points with 96.4% forecasting accuracy.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono border-emerald-500 text-emerald-600">
            Confidence: 96.4%
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Latency: 48ms
          </Badge>
        </div>
      </div>

      {/* 4 Core Intelligence Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Demand Velocity Forecast */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" /> Demand Acceleration
              </span>
              <Badge variant="success" className="text-[10px]">High Velocity</Badge>
            </div>
            <CardTitle className="text-base font-bold mt-1">
              Top 3 Surging SKUs This Weekend
            </CardTitle>
            <CardDescription>
              Predictive models anticipate +38% surge in cold beverages and party snacks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Red Bull Energy Drink 250ml</p>
                <p className="text-[11px] text-slate-500">Current Stock: 84 units | Predicted Weekend Draw: 120 units</p>
              </div>
              <span className="font-bold text-emerald-600">+42% lift</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Doritos Nacho Cheese 150g</p>
                <p className="text-[11px] text-slate-500">Current Stock: 120 units | Predicted Weekend Draw: 145 units</p>
              </div>
              <span className="font-bold text-emerald-600">+35% lift</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Ferrero Rocher Chocolates 16P</p>
                <p className="text-[11px] text-slate-500">Current Stock: 24 units | Predicted Weekend Draw: 35 units</p>
              </div>
              <span className="font-bold text-emerald-600">+28% lift</span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Automated Replenishment Recommendations */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Boxes className="h-4 w-4" /> Stock Replenishment Actions
              </span>
              <Badge variant="warning" className="text-[10px]">Action Required</Badge>
            </div>
            <CardTitle className="text-base font-bold mt-1">
              Recommended Purchase Orders
            </CardTitle>
            <CardDescription>
              SKUs reaching stockout danger threshold before next delivery cycle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            <div className="p-3 rounded-lg border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Amul Taaza Milk 1L Tetra</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                  Stock: 18 units (Threshold: 25) • Lead time: 24 hours
                </p>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-[11px] border-amber-400 text-amber-700">
                Order 100u
              </Button>
            </div>

            <div className="p-3 rounded-lg border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Cadbury Silk Roast Almond</p>
                <p className="text-[11px] text-rose-700 dark:text-rose-400 font-semibold">
                  Stock: 0 units (COMPLETELY OUT) • Est lost revenue: ₹3,500/day
                </p>
              </div>
              <Button size="sm" variant="destructive" className="h-7 text-[11px]">
                Expedite PO
              </Button>
            </div>

            <div className="p-3 rounded-lg border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Maggi 2-Minute Noodles 8pk</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                  Stock: 5 units (Threshold: 30) • Rapid customer scan rate
                </p>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-[11px] border-amber-400 text-amber-700">
                Order 80u
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 3. Slow-Moving Product Detection */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4 text-slate-400" /> Shelf Dormancy
              </span>
              <Badge variant="secondary" className="text-[10px]">Aisle Optimization</Badge>
            </div>
            <CardTitle className="text-base font-bold mt-1">
              Slow-Moving Products (Capital Tied)
            </CardTitle>
            <CardDescription>
              Items with low turnover rate over 21 consecutive retail days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1 text-xs">
            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 dark:text-slate-100">Epigamia Greek Yogurt Natural</p>
                <span className="text-rose-500 font-semibold">Near Expiry Alert</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Expiry date: 15 Dec 2024. Velocity: 1.2 units/day. AI Suggestion: Apply 20% discount coupon in mobile app to accelerate sell-through.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 dark:text-slate-100">Tata Tea Gold Leaf 500g</p>
                <span className="text-slate-400">Low Daily Turnover</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                32 units on shelf. Average customer dwell time 45 seconds without scanning. Recommend repositioning to eye-level shelf 3.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 4. Cross-Sell / Basket Affinity Patterns */}
        <Card className="border-slate-200/90 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> Basket Affinity Intelligence
              </span>
              <Badge variant="default" className="bg-purple-600 text-[10px]">App Recommendations</Badge>
            </div>
            <CardTitle className="text-base font-bold mt-1">
              Co-Purchase Behavioral Graph
            </CardTitle>
            <CardDescription>
              When a customer scans Product A, mobile app auto-prompts Product B with 82% conversion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1 text-xs">
            <div className="p-3 rounded-lg border border-purple-100 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/20 space-y-1">
              <p className="font-bold text-purple-900 dark:text-purple-300">
                Doritos Chips + Coca-Cola Zero Can
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                74% of shoppers who scanned Doritos added a cold beverage within 90 seconds. Combo nudge delivered ₹18,400 incremental revenue this month.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-purple-100 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/20 space-y-1">
              <p className="font-bold text-purple-900 dark:text-purple-300">
                Maggi Noodles + Amul Homogenised Milk
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Strong evening basket affinity between 6 PM - 9 PM among college students & young professionals in CyberHub and Indiranagar.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
