import { useState, useCallback } from 'react';

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'text' | 'outlined' | 'contained';
}

export interface ConfirmationState {
  isOpen: boolean;
  options: ConfirmationOptions | null;
  resolve: ((value: boolean) => void) | null;
}

export const useConfirmation = () => {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    options: null,
    resolve: null,
  });

  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        options: {
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          variant: 'contained',
          ...options,
        },
        resolve,
      });
    });
  }, []);

  const { resolve } = state;

  const handleConfirm = useCallback(() => {
    if (resolve) {
      resolve(true);
    }
    setState({ isOpen: false, options: null, resolve: null });
  }, [resolve]);

  const handleCancel = useCallback(() => {
    if (resolve) {
      resolve(false);
    }
    setState({ isOpen: false, options: null, resolve: null });
  }, [resolve]);

  return {
    confirm,
    confirmationState: state,
    handleConfirm,
    handleCancel,
  };
}; 