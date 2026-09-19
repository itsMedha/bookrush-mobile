import { create } from 'zustand';

export interface Toast {
  id: number;
  message: string;
  tone: 'default' | 'success' | 'error';
  action?: { label: string; onPress: () => void };
}

interface ToastState {
  toast: Toast | null;
  show: (message: string, options?: Partial<Pick<Toast, 'tone' | 'action'>>) => void;
  hide: () => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  show: (message, options = {}) =>
    set({
      toast: { id: nextId++, message, tone: options.tone ?? 'default', action: options.action },
    }),
  hide: () => set({ toast: null }),
}));

/** Imperative helper for use outside React (mutation callbacks, handlers). */
export const toast = {
  show: (message: string, options?: Partial<Pick<Toast, 'tone' | 'action'>>) =>
    useToastStore.getState().show(message, options),
  success: (message: string, action?: Toast['action']) =>
    useToastStore.getState().show(message, { tone: 'success', action }),
  error: (message: string) => useToastStore.getState().show(message, { tone: 'error' }),
};
