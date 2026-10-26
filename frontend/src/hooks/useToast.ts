import { createContext, useContext } from 'react';

export type TipoToast = 'sucesso' | 'erro' | 'info';

export interface Toast {
    id: number;
    tipo: TipoToast;
    mensagem: string;
}

export interface ToastApi {
    sucesso: (mensagem: string) => void;
    erro: (mensagem: string) => void;
    info: (mensagem: string) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);

// Uso: const toast = useToast(); toast.sucesso('Comunicado enviado.');
export function useToast(): ToastApi {
    const contexto = useContext(ToastContext);
    if (!contexto) throw new Error('useToast precisa estar dentro de <ToastProvider>.');
    return contexto;
}
