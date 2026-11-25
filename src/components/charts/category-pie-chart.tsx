'use client';

import * as React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

export interface CategoryDataPoint {
  name: string;
  value: number;
}

interface CategoryPieChartProps {
  data: CategoryDataPoint[];
  height?: number;
  className?: string;
}

const COLORS = ['#DC2626', '#EA580C', '#F59E0B', '#10B981', '#06B6D4', '#6366F1', '#8B5CF6'];

export function CategoryPieChart({ data, height = 300, className }: CategoryPieChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height }} className="w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg" />;
  }

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div style={{ height }} className={className || 'w-full'}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0];
                const pct = total > 0 ? ((Number(item.value) / total) * 100).toFixed(1) : 0;
                return (
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs font-medium text-slate-500 mb-1">{item.name}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(Number(item.value))} ({pct}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
