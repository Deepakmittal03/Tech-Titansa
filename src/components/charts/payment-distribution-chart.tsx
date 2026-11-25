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

export interface PaymentDataPoint {
  method: string;
  count: number;
  percentage: number;
}

interface PaymentDistributionChartProps {
  data: PaymentDataPoint[];
  height?: number;
  className?: string;
}

const PAYMENT_COLORS: Record<string, string> = {
  UPI: '#8B5CF6',
  Card: '#3B82F6',
  Wallet: '#10B981',
  Cash: '#F59E0B',
};

export function PaymentDistributionChart({ data, height = 260, className }: PaymentDistributionChartProps) {
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell
                key={`payment-cell-${index}`}
                fill={PAYMENT_COLORS[entry.method] || '#DC2626'}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as PaymentDataPoint;
                return (
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-xs font-medium text-slate-500">{item.method}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.count} orders ({item.percentage}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={30}
            iconType="circle"
            formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
