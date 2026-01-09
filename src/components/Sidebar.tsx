import {
  Home,
  Plus,
  Wallet,
  CreditCard,
  PiggyBank,
  Banknote,
  Landmark,
  Settings,
} from 'lucide-react';
import { Wallet as WalletType, View } from '../types';
import { cn } from '../utils/cn';

interface SidebarProps {
  wallets: WalletType[];
  activeView: View;
  activeWalletId: string | null;
  theme?: 'dark' | 'light';
  onNavigateDashboard: () => void;
  onNavigateWallet: (walletId: string) => void;
  onOpenSettings: () => void;
  onAddWallet: () => void;
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

export function Sidebar({
  wallets,
  activeView,
  activeWalletId,
  theme = 'dark',
  onNavigateDashboard,
  onNavigateWallet,
  onOpenSettings,
  onAddWallet,
}: SidebarProps) {
  const isLight = theme === 'light';

  // Theme-aware sidebar
  const sidebarBg = isLight ? 'bg-white' : 'bg-black';
  const sidebarBorder = isLight ? 'border-zinc-200' : 'border-zinc-800';

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-6 z-50 border-r',
        sidebarBg,
        sidebarBorder
      )}
    >
      {/* Home */}
      <button
        onClick={onNavigateDashboard}
        className={cn(
          'group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
          activeView === 'dashboard'
            ? (isLight ? 'bg-black text-white' : 'bg-white text-black shadow-lg shadow-white/10')
            : isLight
              ? 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
        )}
      >
        <Home className="w-5 h-5" />
        <span
          className={cn(
            'absolute left-14 text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none z-50 border',
            isLight ? 'bg-white text-black border-zinc-200 shadow-black/5' : 'bg-zinc-900 text-white border-zinc-800'
          )}
        >
          Dashboard
        </span>
      </button>

      {/* Wallet Icons */}
      <div className="flex-1 flex flex-col items-center gap-2 overflow-y-auto no-scrollbar py-4 mt-4">
        {wallets.map((wallet) => {
          const isActive = activeView === 'wallet' && activeWalletId === wallet.id;
          // Active wallet icon turns white in light mode, black in dark mode
          const activeIconColor = isLight ? '#ffffff' : '#000000';

          return (
            <button
              key={wallet.id}
              onClick={() => onNavigateWallet(wallet.id)}
              className={cn(
                'group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                isActive ? '' : (isLight ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800')
              )}
              style={
                isActive
                  ? {
                      backgroundColor: wallet.color,
                      color: activeIconColor,
                    }
                  : {
                      color: wallet.color,
                    }
              }
            >
              {getWalletIcon(wallet.icon, 'w-5 h-5')}
              <span
                className={cn(
                  'absolute left-14 text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none z-50 border',
                  isLight ? 'text-black border-zinc-200 shadow-black/5' : 'text-white border-black/20'
                )}
                style={{ backgroundColor: wallet.color }}
              >
                {wallet.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onOpenSettings}
          className={cn(
            'group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
            isLight ? 'text-zinc-500 hover:text-black hover:bg-zinc-100' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          )}
        >
          <Settings className="w-5 h-5" />
          <span
            className={cn(
              'absolute left-14 text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none z-50 border',
              isLight ? 'bg-white text-black border-zinc-200 shadow-black/5' : 'bg-zinc-900 text-white border-zinc-800'
            )}
          >
            Settings
          </span>
        </button>

        <button
          onClick={onAddWallet}
          className={cn(
            'group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg',
            isLight 
              ? 'bg-black text-white hover:bg-zinc-800' 
              : 'bg-white text-black hover:bg-zinc-100 shadow-white/5'
          )}
        >
          <Plus className="w-5 h-5" />
          <span
            className={cn(
              'absolute left-14 text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none z-50 border',
              isLight ? 'bg-white text-black border-zinc-200 shadow-black/5' : 'bg-zinc-900 text-white border-zinc-800'
            )}
          >
            Add Wallet
          </span>
        </button>
      </div>
    </aside>
  );
}
