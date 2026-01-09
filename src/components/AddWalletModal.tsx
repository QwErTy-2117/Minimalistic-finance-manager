import { useState } from 'react';
import { X, Wallet, CreditCard, PiggyBank, Banknote, Landmark } from 'lucide-react';
import { cn } from '../utils/cn';

interface AddWalletModalProps {
  theme?: 'dark' | 'light';
  onClose: () => void;
  onAdd: (name: string, icon: string) => void;
}

const iconOptions = [
  { id: 'wallet', icon: Wallet, label: 'Wallet' },
  { id: 'card', icon: CreditCard, label: 'Credit Card' },
  { id: 'piggy', icon: PiggyBank, label: 'Savings' },
  { id: 'cash', icon: Banknote, label: 'Cash' },
  { id: 'bank', icon: Landmark, label: 'Bank' },
];

export function AddWalletModal({ theme = 'dark', onClose, onAdd }: AddWalletModalProps) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('wallet');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), selectedIcon);
    }
  };

  const isLight = theme === 'light';

  return (
    <div className={cn('fixed inset-0 flex items-center justify-center z-50 p-4', isLight ? 'bg-black/40' : 'bg-black/80')}>
      <div
        className={cn(
          'border rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200 shadow-2xl',
          isLight ? 'bg-white border-zinc-200 text-black shadow-black/10' : 'bg-black border-zinc-800 text-white shadow-black/50'
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={cn('text-xl font-bold', isLight ? 'text-black' : 'text-white')}>Add New Wallet</h2>
          <button
            onClick={onClose}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
              isLight ? 'text-zinc-500 hover:text-black hover:bg-zinc-100' : 'text-gray-400 hover:text-white hover:bg-zinc-800'
            )}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className={cn('block text-sm font-bold mb-2', isLight ? 'text-black' : 'text-gray-300')}>
              Wallet Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Savings Account"
              className={cn(
                'w-full px-4 py-3 rounded-xl border outline-none transition-colors font-medium',
                isLight
                  ? 'bg-white border-zinc-300 text-black placeholder:text-zinc-400 focus:border-black focus:ring-2 focus:ring-black/5'
                  : 'bg-black/40 border-zinc-700 text-white placeholder:text-gray-500 focus:border-white/60 focus:ring-2 focus:ring-white/10'
              )}
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className={cn('block text-sm font-bold mb-2', isLight ? 'text-black' : 'text-gray-300')}>
              Choose Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedIcon(option.id)}
                  className={cn(
                    'aspect-square rounded-xl flex items-center justify-center transition-all border',
                    selectedIcon === option.id
                      ? (isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white')
                      : isLight
                        ? 'bg-transparent text-zinc-500 border-zinc-200 hover:bg-zinc-100 hover:text-black hover:border-zinc-300'
                        : 'bg-transparent text-gray-400 border-zinc-800 hover:bg-white hover:text-black hover:border-white'
                  )}
                  aria-label={option.label}
                  title={option.label}
                >
                  <option.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'flex-1 px-4 py-3 rounded-xl bg-transparent border font-medium',
                isLight ? 'border-zinc-200 text-zinc-600' : 'border-zinc-700 text-gray-300'
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className={cn(
                'flex-1 px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed',
                isLight ? 'bg-black border border-black text-white' : 'bg-white border border-white text-black'
              )}
            >
              Add Wallet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
