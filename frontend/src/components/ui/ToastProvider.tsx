import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { ToastContext, type Toast, type TipoToast } from '../../hooks/useToast';
import { Icone } from './Icone';

const DURACAO_MS: Record<TipoToast, number> = { sucesso: 3500, info: 4500, erro: 6500 };

const ESTILO: Record<TipoToast, { icone: 'sucesso' | 'erro' | 'info'; cor: string }> = {
    sucesso: { icone: 'sucesso', cor: 'text-success' },
    erro: { icone: 'erro', cor: 'text-danger' },
    info: { icone: 'info', cor: 'text-info' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const proximoId = useRef(1);

    const remover = useCallback((id: number) => {
        setToasts((atuais) => atuais.filter((t) => t.id !== id));
    }, []);

    const mostrar = useCallback((tipo: TipoToast, mensagem: string) => {
        const id = proximoId.current++;

        // No máximo 4 na tela: o mais antigo sai.
        setToasts((atuais) => [...atuais.slice(-3), { id, tipo, mensagem }]);
        window.setTimeout(() => remover(id), DURACAO_MS[tipo]);
    }, [remover]);

    const api = useMemo(() => ({
        sucesso: (mensagem: string) => mostrar('sucesso', mensagem),
        erro: (mensagem: string) => mostrar('erro', mensagem),
        info: (mensagem: string) => mostrar('info', mensagem),
    }), [mostrar]);

    return (
        <ToastContext.Provider value={api}>
            {children}

            <div
                className="fixed z-[60] bottom-4 right-4 left-4 sm:left-auto sm:w-96 flex flex-col gap-2 pointer-events-none"
                role="status"
                aria-live="polite"
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className="pointer-events-auto flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3 shadow-pop animate-subir"
                    >
                        <Icone nome={ESTILO[t.tipo].icone} className={`mt-0.5 ${ESTILO[t.tipo].cor}`} />
                        <p className="flex-1 text-sm text-ink">{t.mensagem}</p>
                        <button
                            onClick={() => remover(t.id)}
                            className="text-slate hover:text-ink transition-colors"
                            aria-label="Fechar aviso"
                        >
                            <Icone nome="fechar" tamanho={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
