import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { WalletView } from './components/WalletView';
import { SettingsModal } from './components/SettingsModal';
import { AddWalletModal } from './components/AddWalletModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { Wallet, Transaction, View, WALLET_COLORS, CurrencyCode, ThemeMode } from './types';

const STORAGE_KEY_WALLETS = 'finance-manager-wallets';
const STORAGE_KEY_TRANSACTIONS = 'finance-manager-transactions';
const STORAGE_KEY_CURRENCY = 'finance-manager-currency';
const STORAGE_KEY_THEME = 'finance-manager-theme';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function App() {
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WALLETS);
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [activeWalletId, setActiveWalletId] = useState<string | null>(null);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENCY);
    return (saved as CurrencyCode) || 'USD';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return (saved as ThemeMode) || 'dark';
  });

  // Persist wallets to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WALLETS, JSON.stringify(wallets));
  }, [wallets]);

  // Persist transactions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  // Persist currency to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CURRENCY, currency);
  }, [currency]);

  // Persist theme to localStorage and apply to document
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
  }, [theme]);

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    setActiveWalletId(null);
  };

  const openSettings = () => {
    setShowSettingsModal(true);
  };

  const navigateToWallet = (walletId: string) => {
    setCurrentView('wallet');
    setActiveWalletId(walletId);
  };

  const handleAddWallet = (name: string, icon: string) => {
    // Get the next color based on current number of wallets
    const colorIndex = wallets.length % WALLET_COLORS.length;
    const newWallet: Wallet = {
      id: generateId(),
      name,
      icon,
      balance: 0,
      color: WALLET_COLORS[colorIndex],
    };
    setWallets([...wallets, newWallet]);
    setShowAddWalletModal(false);
  };

  const handleDeleteWallet = (walletId: string) => {
    setWallets(wallets.filter((w) => w.id !== walletId));
    setTransactions(transactions.filter((t) => t.walletId !== walletId));
    navigateToDashboard();
  };

  const handleAddTransaction = (amount: number, description: string) => {
    if (!activeWalletId) return;

    const newTransaction: Transaction = {
      id: generateId(),
      walletId: activeWalletId,
      amount,
      description,
      date: new Date().toISOString(),
    };

    setTransactions([...transactions, newTransaction]);

    // Update wallet balance
    setWallets(
      wallets.map((w) =>
        w.id === activeWalletId ? { ...w, balance: w.balance + amount } : w
      )
    );

    setShowAddTransactionModal(false);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) return;

    // Remove the transaction
    setTransactions(transactions.filter((t) => t.id !== transactionId));

    // Reverse its effect on the wallet balance
    setWallets(
      wallets.map((w) => (w.id === tx.walletId ? { ...w, balance: w.balance - tx.amount } : w))
    );
  };

  const activeWallet = wallets.find((w) => w.id === activeWalletId);

  const handleExportData = () => {
    const data = { wallets, transactions, currency };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.wallets && data.transactions) {
          setWallets(data.wallets);
          setTransactions(data.transactions);
          if (data.currency) setCurrency(data.currency as CurrencyCode);
          alert('Data imported successfully!');
        } else {
          alert('Invalid JSON file format.');
        }
      } catch {
        alert('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearHistory = () => {
    const ok = confirm('This will remove all wallets and transactions from this device. Continue?');
    if (!ok) return;
    setWallets([]);
    setTransactions([]);
    navigateToDashboard();
  };

  const isLight = theme === 'light';

  return (
    <div className={"h-screen overflow-hidden flex " + (isLight ? 'bg-[#f5f5f5]' : 'bg-black')}>
      <Sidebar
        wallets={wallets}
        activeView={currentView}
        activeWalletId={activeWalletId}
        theme={theme}
        onNavigateDashboard={navigateToDashboard}
        onNavigateWallet={navigateToWallet}
        onOpenSettings={openSettings}
        onAddWallet={() => setShowAddWalletModal(true)}
      />

      <main
        className={
          'flex-1 ml-16 h-screen overflow-y-auto custom-scrollbar ' +
          (isLight ? 'bg-[#f5f5f5]' : 'bg-black')
        }
      >
        {currentView === 'dashboard' ? (
          <Dashboard
            wallets={wallets}
            transactions={transactions}
            onNavigateWallet={navigateToWallet}
            onDeleteTransaction={handleDeleteTransaction}
            currency={currency}
            theme={theme}
          />
        ) : currentView === 'wallet' && activeWallet ? (
          <WalletView
            wallet={activeWallet}
            transactions={transactions}
            onAddTransaction={() => setShowAddTransactionModal(true)}
            onDeleteWallet={() => handleDeleteWallet(activeWallet.id)}
            onDeleteTransaction={handleDeleteTransaction}
            currency={currency}
            theme={theme}
          />
        ) : null}
      </main>

      {showAddWalletModal && (
        <AddWalletModal
          theme={theme}
          onClose={() => setShowAddWalletModal(false)}
          onAdd={handleAddWallet}
        />
      )}

      {showAddTransactionModal && activeWallet && (
        <AddTransactionModal
          theme={theme}
          walletName={activeWallet.name}
          walletBalance={activeWallet.balance}
          currency={currency}
          onClose={() => setShowAddTransactionModal(false)}
          onAdd={handleAddTransaction}
        />
      )}

      <SettingsModal
        open={showSettingsModal}
        theme={theme}
        currency={currency}
        onClose={() => setShowSettingsModal(false)}
        onChangeTheme={setTheme}
        onChangeCurrency={setCurrency}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
