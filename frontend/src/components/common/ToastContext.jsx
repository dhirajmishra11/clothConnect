import { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from './Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, options = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(currentToasts => [...currentToasts, { id, message, ...options }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearToasts }}>
      {children}
      <div className="fixed z-50 flex flex-col gap-2" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            position={toast.position}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, clearToasts } = context;

  return {
    success: (message, options) => addToast(message, { type: 'success', ...options }),
    error: (message, options) => addToast(message, { type: 'error', ...options }),
    info: (message, options) => addToast(message, { type: 'info', ...options }),
    warning: (message, options) => addToast(message, { type: 'warning', ...options }),
    remove: removeToast,
    clear: clearToasts
  };
};