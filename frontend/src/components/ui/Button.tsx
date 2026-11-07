import type { ButtonHTMLAttributes } from 'react';
import { Icone, type NomeIcone } from './Icone';

type Variante = 'primario' | 'secundario' | 'fantasma' | 'perigo';
type Tamanho = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variante?: Variante;
    tamanho?: Tamanho;
    icone?: NomeIcone;
    carregando?: boolean;
}

const VARIANTES: Record<Variante, string> = {
    primario: 'bg-primary text-on-primary hover:opacity-90 shadow-card',
    secundario: 'bg-surface text-ink border border-line-strong hover:bg-surface-muted',
    fantasma: 'text-slate hover:text-ink hover:bg-surface-muted',
    perigo: 'bg-danger-soft text-danger border border-danger/30 hover:bg-danger/15',
};

const TAMANHOS: Record<Tamanho, string> = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
};

export function Button({
    variante = 'primario',
    tamanho = 'md',
    icone,
    carregando = false,
    disabled,
    className = '',
    children,
    type = 'button',
    ...resto
}: ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || carregando}
            className={`inline-flex items-center justify-center rounded-lg font-medium transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                disabled:opacity-50 disabled:pointer-events-none
                ${VARIANTES[variante]} ${TAMANHOS[tamanho]} ${className}`}
            {...resto}
        >
            {carregando ? (
                <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
            ) : (
                icone && <Icone nome={icone} tamanho={16} />
            )}
            {children}
        </button>
    );
}
