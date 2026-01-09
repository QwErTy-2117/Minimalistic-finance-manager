import { ArrowDownLeft, ArrowUpRight, Plus, Trash2, Wallet, CreditCard, PiggyBank, Banknote, Landmark } from 'lucide-react';
import { Wallet as WalletType, Transaction } from '../types';
import { BalanceChart } from './BalanceChart';
import { cn } from '../utils/cn';

interface WalletViewProps {
  wallet: WalletType;
  transactions: Transaction[];
  onAddTransaction: () => void;
  onDeleteWallet: () => void;
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

export function WalletView({
  wallet,
  transactions,
  onAddTransaction,
  onDeleteWallet,
  onDeleteTransaction,
  currency,
  theme = 'dark',
}: WalletViewProps) {
  const isLight = theme === 'light';
  
  const walletTransactions = [...transactions]
    .filter((tx) => tx.walletId === wallet.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const totalDeposits = walletTransactions
    .filter((tx) => tx.amount >= 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdrawals = walletTransactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  // Create a lighter shade of the wallet color for backgrounds
  const colorWithOpacity = `${wallet.color}20`;

  // Theme-aware colors
  const pageBg = isLight ? 'bg-[#f5f5f5]' : 'bg-black';
  const cardBg = isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800';
  const subText = isLight ? 'text-zinc-500' : 'text-gray-500';
  const cardText = isLight ? 'text-black' : 'text-white';
  const mutedText = isLight ? 'text-zinc-600' : 'text-gray-400';
  const borderColor = isLight ? 'border-zinc-200' : 'border-zinc-700';

  return (
    <div className={`p-8 min-h-full ${pageBg}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: colorWithOpacity, color: wallet.color }}
          >
            {getWalletIcon(wallet.icon, 'w-6 h-6')}
          </div>
          <div>
            <h1 
              className="text-3xl font-bold"
              style={{ color: wallet.color }}
            >
              {wallet.name}
            </h1>
            <p className={`${subText} mt-1`}>Wallet overview and transactions</p>
          </div>
        </div>
        <button
          onClick={onDeleteWallet}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isLight 
              ? 'text-zinc-400 hover:text-red-600 hover:bg-red-50' 
              : 'text-gray-500 hover:text-red-500 hover:bg-red-500/20'
          }`}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Balance Card */}
      <div 
        className={`rounded-2xl p-6 mb-8 border ${cardBg}`}
        style={{ borderColor: `${wallet.color}40` }}
      >
        <p className={`text-sm font-medium mb-1 ${mutedText}`}>Current Balance</p>
        <p className={`text-4xl font-bold ${cardText}`}>{formatCurrency(wallet.balance)}</p>
        <div className={`grid grid-cols-2 gap-4 mt-6 pt-4 border-t ${borderColor}`}>
          <div>
            <p className={`text-sm ${mutedText}`}>Total Deposits</p>
            <p className={`text-lg font-semibold ${cardText}`}>+{formatCurrency(totalDeposits)}</p>
          </div>
          <div>
            <p className={`text-sm ${mutedText}`}>Total Withdrawals</p>
            <p className={`text-lg font-semibold ${mutedText}`}>-{formatCurrency(totalWithdrawals)}</p>
          </div>
        </div>
      </div>

      {/* Wallet Trend Chart */}
      <div className="mb-8">
        <BalanceChart 
          transactions={walletTransactions} 
          initialBalance={0} 
          color={wallet.color}
          title={`${wallet.name} Balance Trend`}
          currency={currency}
          theme={theme}
        />
      </div>

      {/* Add Transaction Button */}
      <button
        onClick={onAddTransaction}
        className={`w-full rounded-2xl p-4 mb-8 flex items-center justify-center gap-2 transition-all duration-200 border-2 border-dashed ${
          isLight 
            ? 'border-zinc-300 text-zinc-500 hover:bg-black hover:text-white hover:border-solid hover:border-black' 
            : 'border-zinc-800 text-zinc-500 hover:bg-white hover:text-black hover:border-solid hover:border-white'
        }`}
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Transaction</span>
      </button>

      {/* Transactions List */}
      <div>
        <h2 className={`text-lg font-semibold mb-4 ${cardText}`}>Transaction History</h2>
        {walletTransactions.length > 0 ? (
          <div className={`border rounded-2xl overflow-hidden ${cardBg}`}>
            {walletTransactions.map((tx, index) => (
              <div
                key={tx.id}
                className={`group flex items-center justify-between p-4 ${
                  index !== walletTransactions.length - 1 ? `border-b ${isLight ? 'border-zinc-200' : 'border-zinc-800'}` : ''
                }`}
              >
                <div className="flex items-center gap-4">
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
                    <p className={`text-sm ${subText}`}>{formatDate(tx.date)}</p>
                  </div>
                </div>
                <div className="flex items-center relative pr-8">
                  <p
                    className={`font-semibold text-lg ${
                      tx.amount >= 0 ? cardText : subText
                    }`}
                  >
                    {tx.amount >= 0 ? '+' : ''}
                    {formatCurrency(tx.amount)}
                  </p>
                  <button
                    type="button"
                    onClick={() => onDeleteTransaction(tx.id)}
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
          <div 
            className={`rounded-2xl p-8 text-center border border-dashed ${
              isLight ? 'bg-white border-zinc-300' : 'bg-zinc-900 border-zinc-700'
            }`}
            style={{ borderColor: `${wallet.color}40` }}
          >
            <p className={subText}>No transactions yet. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
