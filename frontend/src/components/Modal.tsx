import { useEffect } from 'react';

interface ModalProps {
    aberto: boolean;
    onFechar: () => void;
    titulo: string;
    children: React.ReactNode;
}

export function Modal({ aberto, onFechar, titulo, children }: ModalProps) {
    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') onFechar();
        }

        if (aberto) document.addEventListener('keydown', handleEsc);

        return () => document.removeEventListener('keydown', handleEsc);
    }, [aberto, onFechar]);

    if (!aberto) return null;

    return (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 px-4" onClick={onFechar}>
            <div
                className="bg-paper rounded shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-ink/10">
                    <h2 className="font-serif text-xl text-ink">{titulo}</h2>

                    <button onClick={onFechar} className="text-slate hover:text-ink text-xl leading-none">×</button>
                </div>

                <div className="px-6 py-6">{children}</div>
            </div>
        </div>
    );
}