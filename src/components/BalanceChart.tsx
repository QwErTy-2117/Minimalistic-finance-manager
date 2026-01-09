import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  format,
  subDays,
  subMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfDay,
} from 'date-fns';
import { Transaction } from '../types';

interface BalanceChartProps {
  transactions: Transaction[];
  initialBalance: number;
  color?: string;
  title?: string;
  currency?: string;
  theme?: 'dark' | 'light';
}

type TimeInterval = 'weekly' | 'monthly' | 'yearly';

export function BalanceChart({
  transactions,
  initialBalance,
  color = '#ffffff',
  title = 'Balance Trend',
  currency = 'USD',
  theme = 'dark',
}: BalanceChartProps) {
  const isLight = theme === 'light';
  const [interval, setInterval] = useState<TimeInterval>('weekly');

  const chartData = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let formatStr: string;
    let points: Date[];

    if (interval === 'weekly') {
      startDate = subDays(now, 6);
      points = eachDayOfInterval({ start: startDate, end: now });
      formatStr = 'dd/MM';
    } else if (interval === 'monthly') {
      startDate = subDays(now, 29);
      points = eachDayOfInterval({ start: startDate, end: now });
      formatStr = 'MM/yy'; // Changed to numbers as requested
    } else {
      startDate = subMonths(now, 11);
      points = eachMonthOfInterval({ start: startDate, end: now });
      formatStr = 'MM/yyyy'; // Already numbers
    }

    return points.map((point) => {
      const cutoff = interval === 'yearly' ? endOfMonth(point) : endOfDay(point);

      const delta = transactions
        .filter((tx) => new Date(tx.date).getTime() <= cutoff.getTime())
        .reduce((sum, tx) => sum + tx.amount, 0);

      return {
        date: format(point, formatStr),
        balance: initialBalance + delta,
      };
    });
  }, [transactions, interval, initialBalance]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Theme-aware styles
  const cardBg = isLight ? 'bg-white border-zinc-200/60 shadow-sm' : 'bg-zinc-900 border-zinc-800';
  const titleColor = isLight ? 'text-zinc-900' : 'text-white';
  const switcherBg = isLight ? 'bg-zinc-50 border-zinc-200/60' : 'bg-black/40 border-zinc-800';
  const gridColor = isLight ? '#d4d4d8' : '#27272a';
  const axisColor = isLight ? '#52525b' : '#71717a';
  const tooltipBg = isLight ? '#ffffff' : '#18181b';
  const tooltipBorder = isLight ? '#d4d4d8' : '#3f3f46';
  const tooltipTextColor = isLight ? '#18181b' : '#ffffff';

  return (
    <div className={`border rounded-2xl p-6 ${cardBg}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className={`text-lg font-semibold ${titleColor}`}>{title}</h2>
        <div className={`flex p-1 rounded-xl border ${switcherBg}`}>
          {(['weekly', 'monthly', 'yearly'] as const).map((i) => (
            <button
              key={i}
              onClick={() => setInterval(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                interval === i
                  ? `bg-white text-black ${isLight ? 'shadow-none border border-zinc-200' : 'shadow-none'}`
                  : isLight 
                    ? 'text-zinc-500 hover:bg-zinc-200 hover:text-black'
                    : 'text-gray-500 hover:bg-white hover:text-black'
              }`}
            >
              {i.charAt(0).toUpperCase() + i.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id={`colorBalance-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="date"
              stroke={axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke={axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(Number(value))}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '12px',
                color: tooltipTextColor,
              }}
              itemStyle={{ color: tooltipTextColor }}
              formatter={(value) => [formatCurrency(Number(value)), 'Balance']}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#colorBalance-${title.replace(/\s/g, '')})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
