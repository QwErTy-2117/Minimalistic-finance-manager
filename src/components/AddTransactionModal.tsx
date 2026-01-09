import { useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { getCurrencySymbol } from '../utils/money';

interface AddTransactionModalProps {
  theme?: 'dark' | 'light';
  walletName: string;
  walletBalance: number;
  currency: string;
  onClose: () => void;
  onAdd: (amount: number, description: string) => void;
}

export function AddTransactionModal({
  theme = 'dark',
  walletName,
  walletBalance,
  currency,
  onClose,
  onAdd,
}: AddTransactionModalProps) {
  const [type, setType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isLight = theme === 'light';

  const parsedAmount = Number.parseFloat(amount);
  const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const wouldOverdraw = type === 'withdrawal' && isAmountValid && parsedAmount > walletBalance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAmountValid) return;

    if (type === 'withdrawal' && parsedAmount > walletBalance) {
      setError('Insufficient balance. Cannot withdraw more than available.');
      return;
    }

    const finalAmount = type === 'deposit' ? parsedAmount : -parsedAmount;
    onAdd(finalAmount, description.trim());
  };

  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center z-50 p-4',
        isLight ? 'bg-black/40' : 'bg-black/80'
      )}
    >
      <div
        className={cn(
          'border rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200 shadow-2xl',
          isLight ? 'bg-white border-zinc-200 text-black shadow-black/10' : 'bg-black border-zinc-800 text-white shadow-black/50'
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={cn('text-xl font-bold', isLight ? 'text-black' : 'text-white')}>Add Transaction</h2>
            <p className={cn('text-sm', isLight ? 'text-zinc-500' : 'text-gray-400')}>{walletName}</p>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
              isLight ? 'text-zinc-500 hover:text-black hover:bg-zinc-100' : 'text-gray-400 hover:text-white hover:bg-zinc-800'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Transaction Type */}
          <div className="mb-6">
            <label className={cn('block text-sm font-bold mb-2', isLight ? 'text-black' : 'text-gray-300')}>
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setType('deposit'); setError(null); }}
                className={cn(
                  'px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all border',
                  type === 'deposit'
                    ? (isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white')
                    : isLight
                      ? 'bg-transparent text-zinc-600 border-zinc-300 hover:bg-zinc-100 hover:text-black hover:border-black'
                      : 'bg-transparent text-gray-400 border-zinc-800 hover:bg-white hover:text-black hover:border-white'
                )}
              >
                <ArrowDownLeft className="w-4 h-4" />
                Deposit
              </button>
              <button
                type="button"
                onClick={() => { setType('withdrawal'); setError(null); }}
                className={cn(
                  'px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all border',
                  type === 'withdrawal'
                    ? (isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white')
                    : isLight
                      ? 'bg-transparent text-zinc-600 border-zinc-300 hover:bg-zinc-100 hover:text-black hover:border-black'
                      : 'bg-transparent text-gray-400 border-zinc-800 hover:bg-white hover:text-black hover:border-white'
                )}
              >
                <ArrowUpRight className="w-4 h-4" />
                Withdrawal
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label className={cn('block text-sm font-bold mb-2', isLight ? 'text-black' : 'text-gray-300')}>
              Amount
            </label>
            <div className="relative">
              <span
                className={cn(
                  'absolute left-4 top-1/2 -translate-y-1/2 font-bold',
                  isLight ? 'text-black' : 'text-gray-400'
                )}
              >
                {getCurrencySymbol(currency)}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(null); }}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className={cn(
                  'w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-colors font-medium',
                  isLight
                    ? 'bg-white border-zinc-300 text-black placeholder:text-zinc-400 focus:border-black focus:ring-2 focus:ring-black/5'
                    : 'bg-black/40 border-zinc-800 text-white placeholder:text-gray-600 focus:border-white/40 focus:ring-2 focus:ring-white/10'
                )}
                autoFocus
              />
            </div>
            {type === 'withdrawal' && (
              <p className={cn('text-xs mt-2 font-medium', isLight ? 'text-zinc-600' : 'text-gray-500')}>
                Available: {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(walletBalance)}
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 font-bold text-sm">
              {error}
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <label className={cn('block text-sm font-bold mb-2', isLight ? 'text-black' : 'text-gray-300')}>
              Description{' '}
              <span className={cn('font-normal', isLight ? 'text-zinc-500' : 'text-gray-500')}>(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Monthly salary"
              className={cn(
                'w-full px-4 py-3 rounded-xl border outline-none transition-colors font-medium',
                isLight
                  ? 'bg-white border-zinc-300 text-black placeholder:text-zinc-400 focus:border-black focus:ring-2 focus:ring-black/5'
                  : 'bg-black/40 border-zinc-800 text-white placeholder:text-gray-600 focus:border-white/40 focus:ring-2 focus:ring-white/10'
              )}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'flex-1 px-4 py-3 rounded-xl bg-transparent border font-medium',
                isLight ? 'border-zinc-200 text-zinc-700' : 'border-zinc-700 text-gray-300'
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isAmountValid || wouldOverdraw}
              className={cn(
                'flex-1 px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed border',
                isLight ? 'bg-black border-black text-white' : 'bg-white border-white text-black'
              )}
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
