import { useState, createContext, useContext } from 'react';

export type ToastType = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
};

type ToastContextType = {
  toasts: ToastType[];
  addToast: (toast: Omit<ToastType, 'id'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, toast: Partial<ToastType>) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = (toast: Omit<ToastType, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, duration: 5000, variant: 'default', ...toast }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const updateToast = (id: string, toast: Partial<ToastType>) => {
    setToasts((prev) => 
      prev.map((t) => (t.id === id ? { ...t, ...toast } : t))
    );
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return {
    toasts: context.toasts,
    toast: (props: Omit<ToastType, 'id'>) => context.addToast(props),
    dismiss: (id: string) => context.removeToast(id),
    update: (id: string, props: Partial<ToastType>) => context.updateToast(id, props),
    success: (props: Omit<ToastType, 'id' | 'variant'>) => 
      context.addToast({ ...props, variant: 'success' }),
    error: (props: Omit<ToastType, 'id' | 'variant'>) => 
      context.addToast({ ...props, variant: 'destructive' }),
    warning: (props: Omit<ToastType, 'id' | 'variant'>) => 
      context.addToast({ ...props, variant: 'warning' }),
    info: (props: Omit<ToastType, 'id' | 'variant'>) => 
      context.addToast({ ...props, variant: 'info' })
  };
}
