import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const typeStyles = {
    info: {
      bg: '#1E293B',
      border: '#334155',
      textColor: '#F8FAFC',
      iconColor: '#94A3B8',
      Icon: Info,
    },
    success: {
      bg: '#ECFDF5',
      border: '#22C55E',
      textColor: '#166534',
      iconColor: '#16A34A',
      Icon: Info,
    },
    warning: {
      bg: '#FEF2F2',
      border: '#EF4444',
      textColor: '#991B1B',
      iconColor: '#DC2626',
      Icon: Info,
    },
  };

  const config = typeStyles[toast.type] || typeStyles.info;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg pointer-events-auto transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
        minWidth: '280px',
        maxWidth: '400px',
      }}
    >
      <config.Icon className="w-5 h-5 flex-shrink-0" style={{ color: config.iconColor }} />
      <p className="text-sm font-medium flex-1" style={{ color: config.textColor }}>
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 rounded-lg transition-colors"
        style={{ color: config.iconColor }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}