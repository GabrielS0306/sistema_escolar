import { useEffect } from 'react';
import { Icone } from './ui/Icone';

interface ModalProps {
    aberto: boolean;
    onFechar: () => void;
    titulo: string;
    descricao?: string;
    tamanho?: 'md' | 'lg';
    children: React.ReactNode;
}

export function Modal({ aberto, onFechar, titulo, descricao, tamanho = 'md', children }: ModalProps) {
    useEffect(() => {
        if (!aberto) return;

        function handleEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') onFechar();
        }

        // Trava a rolagem da página atrás do modal.
        const overflowAnterior = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = overflowAnterior;
            document.removeEventListener('keydown', handleEsc);
        };
    }, [aberto, onFechar]);

    if (!aberto) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-[2px] sm:px-4 animate-entrar"
            onClick={onFechar}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={titulo}
                className={`w-full ${tamanho === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-lg'} max-h-[92vh] overflow-y-auto
                    bg-surface border border-line shadow-pop rounded-t-2xl sm:rounded-2xl animate-subir`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 pt-5 pb-4 bg-surface border-b border-line">
                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-ink">{titulo}</h2>
                        {descricao && <p className="text-sm text-slate mt-0.5">{descricao}</p>}
                    </div>

                    <button
                        onClick={onFechar}
                        className="w-8 h-8 -mr-2 rounded-lg flex items-center justify-center text-slate hover:text-ink hover:bg-surface-muted transition-colors"
                        aria-label="Fechar"
                    >
                        <Icone nome="fechar" tamanho={18} />
                    </button>
                </div>

                <div className="px-6 py-5">{children}</div>
            </div>
        </div>
    );
}
