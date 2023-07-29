import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toastMessage, setToastMessage] = useState('');
  const [id, setId] = useState(new Date().getTime());

  const showToast = (message) => {
    setToastMessage(message);
    setId(new Date().getTime())
  };

  const hideToast = () => {
    setToastMessage('');
  };

  const toastContextValue = {
    showToast,
    hideToast,
    toastMessage,
    id,
  };

  return (
    <ToastContext.Provider value={toastContextValue}>
      {children}
    </ToastContext.Provider>
  );
}
