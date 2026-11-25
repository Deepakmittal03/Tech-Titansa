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

export interface TopProductDataPoint {
  name: string;
  units: number;
}

interface TopProductsChartProps {
  data: TopProductDataPoint[];
  height?: number;
  className?: string;
}

export function TopProductsChart({ data, height = 260, className }: TopProductsChartProps) {
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
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.6} />
          <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={110}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as TopProductDataPoint;
                return (
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs font-medium text-slate-500">{item.name}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.units} units sold
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="units"
            fill="#0F172A"
            radius={[0, 4, 4, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
