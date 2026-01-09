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
      formatStr = 'dd/MM';
    } else {
      startDate = subMonths(now, 11);
      points = eachMonthOfInterval({ start: startDate, end: now });
      formatStr = 'MMM yy';
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

  // Calculate the maximum width needed for Y-axis labels
  const yAxisWidth = useMemo(() => {
    if (chartData.length === 0) return 80;
    
    const maxValue = Math.max(...chartData.map(d => Math.abs(d.balance)));
    const formattedMax = formatCurrency(maxValue);
    // Estimate width: ~8px per character for the font size used
    const estimatedWidth = formattedMax.length * 8 + 16; // 16px padding
    return Math.max(80, Math.min(estimatedWidth, 120)); // Clamp between 80-120px
  }, [chartData, currency]);

  // Theme-aware styles - improved light mode colors
  const cardBg = isLight ? 'bg-white border-zinc-300' : 'bg-zinc-900 border-zinc-800';
  const titleColor = isLight ? 'text-zinc-800' : 'text-white';
  const switcherBg = isLight ? 'bg-zinc-100 border-zinc-300' : 'bg-black/40 border-zinc-800';
  const gridColor = isLight ? '#e4e4e7' : '#27272a';
  const axisColor = isLight ? '#3f3f46' : '#71717a';
  const tooltipBg = isLight ? '#ffffff' : '#18181b';
  const tooltipBorder = isLight ? '#a1a1aa' : '#3f3f46';
  const tooltipTextColor = isLight ? '#18181b' : '#ffffff';
  
  // Grayscale chart line color based on theme
  const chartColor = isLight ? '#52525b' : '#a1a1aa';

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
                  ? isLight
                    ? 'bg-white text-zinc-900 border border-zinc-300'
                    : 'bg-white text-black'
                  : isLight 
                    ? 'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
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
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id={`colorBalance-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={isLight ? 0.2 : 0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
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
              width={yAxisWidth}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '12px',
                color: tooltipTextColor,
              }}
              itemStyle={{ color: tooltipTextColor }}
              labelStyle={{ color: isLight ? '#52525b' : '#a1a1aa', marginBottom: '4px' }}
              formatter={(value) => [formatCurrency(Number(value)), 'Balance']}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke={chartColor}
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