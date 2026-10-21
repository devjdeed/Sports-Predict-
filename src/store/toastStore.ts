import { create } from 'zustand';

export interface Toast {
  id: number;
  message: string;
  tone: 'yes' | 'no' | 'info';
}

interface ToastState {
  toasts: Toast[];
  show: (message: string, tone?: Toast['tone']) => void;
  dismiss: (id: number) => void;
}

let next = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message, tone = 'info') => {
    const id = next++;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, tone }] }));
    setTimeout(() => get().dismiss(id), 2600);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = (message: string, tone?: Toast['tone']) => useToastStore.getState().show(message, tone);
