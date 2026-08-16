// ============================================================
// SIGNAVERSE — Toast Notification System
// ============================================================

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'border-success text-success',
  error: 'border-error text-error',
  warning: 'border-warning text-warning',
  info: 'border-aqua text-aqua',
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({
  toast,
  onRemove,
}: {
  toast: { id: string; type: 'success' | 'error' | 'info' | 'warning'; title: string; message?: string };
  onRemove: (id: string) => void;
}) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="pointer-events-auto"
    >
      <div
        className={`
          flex items-start gap-3 p-4 rounded-2xl min-w-[280px] max-w-[360px]
          border-l-4 ${colors[toast.type]}
          card-glass
        `}
      >
        <Icon size={20} className="mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-display font-700 text-sm text-text">{toast.title}</p>
          {toast.message && (
            <p className="text-xs text-muted mt-0.5 leading-relaxed">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-subtle hover:text-text transition-colors flex-shrink-0"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}
