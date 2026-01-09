import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Trash2, Wallet, CreditCard, PiggyBank, Banknote, Landmark } from 'lucide-react';
import { Wallet as WalletType, Transaction } from '../types';
import { BalanceChart } from './BalanceChart';
import { cn } from '../utils/cn';

interface DashboardProps {
  wallets: WalletType[];
  transactions: Transaction[];
  onNavigateWallet: (walletId: string) => void;
  onDeleteTransaction: (transactionId: string) => void;
  currency: string;
  theme?: 'dark' | 'light';
}

const getWalletIcon = (icon: string, className: string) => {
  const icons: Record<string, React.ReactNode> = {
    wallet: <Wallet className={className} />,
    card: <CreditCard className={className} />,
    piggy: <PiggyBank className={className} />,
    cash: <Banknote className={className} />,
    bank: <Landmark className={className} />,
  };
  return icons[icon] || <Wallet className={className} />;
};

export function Dashboard({ wallets, transactions, onNavigateWallet, onDeleteTransaction, currency, theme = 'dark' }: DashboardProps) {
  const isLight = theme === 'light';
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const pieData = wallets
    .filter((w) => w.balance > 0)
    .map((w) => ({
      name: w.name,
      value: w.balance,
      color: w.color,
    }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getWalletName = (walletId: string) => {
    return wallets.find((w) => w.id === walletId)?.name || 'Unknown';
  };

  const getWalletColor = (walletId: string) => {
    return wallets.find((w) => w.id === walletId)?.color || '#ffffff';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Theme-aware colors
  const pageBg = isLight ? 'bg-[#f5f5f5]' : 'bg-black';
  const cardBg = isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800';
  const headerText = isLight ? 'text-black' : 'text-white';
  const subText = isLight ? 'text-zinc-500' : 'text-gray-500';
  const cardText = isLight ? 'text-black' : 'text-white';
  const mutedText = isLight ? 'text-zinc-600' : 'text-gray-400';
  const hoverBg = isLight ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800';
  const borderColor = isLight ? 'border-zinc-200' : 'border-zinc-700';

  return (
    <div className={`p-8 min-h-full ${pageBg}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${headerText}`}>Dashboard</h1>
        <p className={`${subText} mt-1`}>Your financial overview</p>
      </div>

      {/* Total Balance Card */}
      <div className={`rounded-2xl p-6 mb-8 border ${cardBg}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium mb-1 ${mutedText}`}>Total Balance</p>
            <p className={`text-4xl font-bold ${cardText}`}>{formatCurrency(totalBalance)}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLight ? 'bg-zinc-100' : 'bg-white/10'}`}>
            <TrendingUp className={`w-6 h-6 ${cardText}`} />
          </div>
        </div>
        <div className={`mt-4 pt-4 border-t ${borderColor}`}>
          <p className={`text-sm ${mutedText}`}>
            {wallets.length} wallet{wallets.length !== 1 ? 's' : ''} connected
          </p>
        </div>
      </div>

      {/* Balance Trend Chart */}
      <div className="mb-8">
        <BalanceChart 
          transactions={transactions} 
          initialBalance={0} 
          title="Net Worth Trend"
          currency={currency}
          theme={theme}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className={`border rounded-2xl p-6 ${cardBg}`}>
          <h2 className={`text-lg font-semibold mb-4 ${cardText}`}>Wallet Distribution</h2>
          {pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      backgroundColor: isLight ? '#ffffff' : '#18181b',
                      border: `1px solid ${isLight ? '#e4e4e7' : '#3f3f46'}`,
                      borderRadius: '8px',
                      color: isLight ? '#000000' : '#fff',
                    }}
                    itemStyle={{ color: isLight ? '#000000' : '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={`h-64 flex items-center justify-center ${subText}`}>
              No wallet data to display
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className={`text-sm ${mutedText}`}>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className={`border rounded-2xl p-6 ${cardBg}`}>
          <h2 className={`text-lg font-semibold mb-4 ${cardText}`}>Recent Transactions</h2>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className={`group flex items-center justify-between p-3 rounded-xl ${hoverBg} transition-colors cursor-pointer`}
                  onClick={() => onNavigateWallet(tx.walletId)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.amount >= 0 
                          ? (isLight ? 'bg-zinc-200' : 'bg-zinc-800') 
                          : (isLight ? 'bg-black' : 'bg-white')
                      }`}
                    >
                      {tx.amount >= 0 ? (
                        <ArrowDownLeft className={`w-5 h-5 ${isLight ? 'text-black' : 'text-white'}`} />
                      ) : (
                        <ArrowUpRight className={`w-5 h-5 ${isLight ? 'text-white' : 'text-black'}`} />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${cardText}`}>
                        {tx.description || (tx.amount >= 0 ? 'Deposit' : 'Withdrawal')}
                      </p>
                      <p className={`text-sm ${subText}`}>
                        <span style={{ color: getWalletColor(tx.walletId) }}>{getWalletName(tx.walletId)}</span> • {formatDate(tx.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center relative pr-8">
                    <p
                      className={`font-semibold ${
                        tx.amount >= 0 ? cardText : subText
                      }`}
                    >
                      {tx.amount >= 0 ? '+' : ''}
                      {formatCurrency(tx.amount)}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTransaction(tx.id);
                      }}
                      className={cn(
                        "absolute right-0 w-8 h-8 rounded-lg flex items-center justify-center text-red-500 transition-all duration-200",
                        isLight ? "hover:bg-red-100/50" : "hover:bg-red-500/20"
                      )}
                      aria-label="Delete transaction"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`h-48 flex items-center justify-center ${subText}`}>
              No transactions yet
            </div>
          )}
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="mt-8">
        <h2 className={`text-lg font-semibold mb-4 ${cardText}`}>Your Wallets</h2>
        {wallets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => onNavigateWallet(wallet.id)}
                className={`border rounded-2xl p-5 text-left transition-all group ${cardBg} ${
                  isLight 
                    ? 'hover:bg-black hover:border-black' 
                    : 'hover:bg-white hover:border-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isLight 
                          ? 'group-hover:bg-zinc-800 group-hover:text-white' 
                          : 'group-hover:bg-zinc-100 group-hover:text-black'
                      }`}
                      style={{ backgroundColor: `${wallet.color}20`, color: wallet.color }}
                    >
                      {getWalletIcon(wallet.icon, 'w-4 h-4')}
                    </div>
                    <p 
                      className={`font-medium transition-colors ${
                        isLight 
                          ? 'group-hover:text-white' 
                          : 'group-hover:text-black'
                      }`}
                      style={{ color: wallet.color }}
                    >
                      {wallet.name}
                    </p>
                  </div>
                </div>
                <p className={`text-2xl font-bold transition-colors ${
                  isLight 
                    ? 'text-black group-hover:text-white' 
                    : 'text-white group-hover:text-black'
                }`}>{formatCurrency(wallet.balance)}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className={`border border-dashed rounded-2xl p-8 text-center ${isLight ? 'border-zinc-300 bg-white' : 'border-zinc-700 bg-zinc-900'}`}>
            <p className={subText}>No wallets yet. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
