import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
      case 'loading':
        return <Loader className="w-5 h-5 text-primary animate-spin flex-shrink-0" />;
      default:
        return <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success': return 'border-green-500/20';
      case 'error': return 'border-red-500/20';
      case 'loading': return 'border-primary/20';
      default: return 'border-secondary/20';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast: addToast, removeToast }}>
      {children}
      {/* Toast Render Node */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-lg border glass shadow-2xl shadow-black/80 ${getBorderColor(toast.type)}`}
            >
              {getIcon(toast.type)}
              <p className="text-sm font-medium text-white">{toast.message}</p>
              {toast.type !== 'loading' && (
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-auto text-white/40 hover:text-white/80 transition-colors text-xs font-semibold px-1"
                >
                  ✕
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
