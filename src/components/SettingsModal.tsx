import { useEffect, useMemo, useRef } from 'react';
import { X, Download, Upload, Trash2, Moon, Sun } from 'lucide-react';
import { CurrencyCode, ThemeMode } from '../types';
import { cn } from '../utils/cn';

interface SettingsModalProps {
  open: boolean;
  theme: ThemeMode;
  currency: CurrencyCode;
  onClose: () => void;
  onChangeTheme: (mode: ThemeMode) => void;
  onChangeCurrency: (currency: CurrencyCode) => void;
  onExportData: () => void;
  onImportData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearHistory: () => void;
}

const currencyOptions: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

const currencySymbol: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
};

export function SettingsModal({
  open,
  theme,
  currency,
  onClose,
  onChangeTheme,
  onChangeCurrency,
  onExportData,
  onImportData,
  onClearHistory,
}: SettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const titleId = useMemo(() => `settings-title-${Math.random().toString(36).slice(2)}`, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isLight = theme === 'light';

  return (
    <div className={cn('fixed inset-0 flex items-center justify-center z-50 p-4', isLight ? 'bg-black/40' : 'bg-black/80')}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'border rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200 shadow-2xl',
          isLight ? 'bg-white border-zinc-200 text-black shadow-black/10' : 'bg-black border-zinc-800 text-white shadow-black/50'
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 id={titleId} className={cn('text-xl font-bold', isLight ? 'text-black' : 'text-white')}>
              Settings
            </h2>
            <p className={cn('text-sm', isLight ? 'text-zinc-500' : 'text-gray-500')}>Preferences, backup and reset.</p>
          </div>
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

        {/* Theme */}
        <section className="mb-6">
          <h3 className={cn('text-sm font-bold mb-2', isLight ? 'text-black' : 'text-gray-300')}>Theme</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChangeTheme('dark')}
              className={cn(
                'px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all border',
                theme === 'dark'
                  ? (isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white')
                  : isLight
                    ? 'bg-transparent text-zinc-600 border-zinc-300 hover:bg-zinc-100 hover:text-black hover:border-black'
                    : 'bg-transparent text-gray-400 border-zinc-800 hover:bg-white hover:text-black hover:border-white'
              )}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
            <button
              type="button"
              onClick={() => onChangeTheme('light')}
              className={cn(
                'px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all border',
                theme === 'light'
                  ? (isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white')
                  : isLight
                    ? 'bg-transparent text-zinc-600 border-zinc-300 hover:bg-zinc-100 hover:text-black hover:border-black'
                    : 'bg-transparent text-gray-400 border-zinc-800 hover:bg-white hover:text-black hover:border-white'
              )}
            >
              <Sun className="w-4 h-4" />
              Light
            </button>
          </div>
        </section>

        {/* Currency */}
        <section className="mb-6">
          <h3 className={cn('text-sm font-bold mb-2', isLight ? 'text-black' : 'text-gray-300')}>Currency</h3>
          <div className="grid grid-cols-3 gap-2">
            {currencyOptions.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onChangeCurrency(code)}
                className={cn(
                  'rounded-xl border px-3 py-3 transition-all flex items-center justify-between font-bold',
                  currency === code
                    ? (isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white')
                    : isLight
                      ? 'bg-transparent border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:text-black hover:border-black'
                      : 'bg-transparent border-zinc-800 text-gray-300 hover:bg-white hover:text-black hover:border-white'
                )}
                title={code}
              >
                <span className="text-lg font-bold leading-none">{currencySymbol[code]}</span>
                <span className="text-xs font-bold opacity-80">{code}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Data */}
        <section className="mb-6">
          <h3 className={cn('text-sm font-bold mb-2', isLight ? 'text-black' : 'text-gray-300')}>Data</h3>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImportData}
            accept=".json"
            className="hidden"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'rounded-xl border bg-transparent px-4 py-3 font-bold transition-colors flex items-center justify-center gap-2',
                isLight
                  ? 'border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:text-black hover:border-black'
                  : 'border-zinc-800 text-gray-300 hover:bg-white hover:text-black hover:border-white'
              )}
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <button
              type="button"
              onClick={onExportData}
              className={cn(
                'rounded-xl border bg-transparent px-4 py-3 font-bold transition-colors flex items-center justify-center gap-2',
                isLight
                  ? 'border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:text-black hover:border-black'
                  : 'border-zinc-800 text-gray-300 hover:bg-white hover:text-black hover:border-white'
              )}
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </section>

        {/* History */}
        <section>
          <h3 className={cn('text-sm font-bold mb-2', isLight ? 'text-black' : 'text-gray-300')}>History</h3>
          <button
            type="button"
            onClick={onClearHistory}
            className={cn(
              'w-full rounded-xl border bg-transparent px-4 py-3 font-bold transition-colors flex items-center justify-center gap-2',
              isLight
                ? 'border-zinc-300 text-zinc-700 hover:bg-red-50 hover:text-red-600 hover:border-red-600'
                : 'border-zinc-800 text-gray-300 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500'
            )}
          >
            <Trash2 className="w-4 h-4" />
            Clear history
          </button>
        </section>
      </div>
    </div>
  );
}
