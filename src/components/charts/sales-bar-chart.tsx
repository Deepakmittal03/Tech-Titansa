'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

export interface SalesBarDataPoint {
  label: string;
  sales: number;
}

interface SalesBarChartProps {
  data: SalesBarDataPoint[];
  height?: number;
  className?: string;
}

export function SalesBarChart({ data, height = 300, className }: SalesBarChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height }} className="w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg" />;
  }

  return (
    <div style={{ height }} className={className || 'w-full'}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
          <XAxis
            dataKey="label"
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(Number(payload[0].value))}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="sales"
            fill="#DC2626"
            radius={[6, 6, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
