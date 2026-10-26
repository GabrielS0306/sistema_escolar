import type { ReactNode } from 'react';

export type TomBadge = 'neutro' | 'sucesso' | 'alerta' | 'perigo' | 'info' | 'destaque';

const TONS: Record<TomBadge, string> = {
    neutro: 'bg-surface-muted text-slate',
    sucesso: 'bg-success-soft text-success',
    alerta: 'bg-warning-soft text-warning',
    perigo: 'bg-danger-soft text-danger',
    info: 'bg-info-soft text-info',
    destaque: 'bg-gold-soft text-gold',
};

interface BadgeProps {
    tom?: TomBadge;
    comPonto?: boolean;
    children: ReactNode;
}

// Rótulo de status (Aprovado, Pendente, Atraso...). O ponto ajuda quem não distingue bem as cores.
export function Badge({ tom = 'neutro', comPonto = false, children }: BadgeProps) {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${TONS[tom]}`}>
            {comPonto && <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />}
            {children}
        </span>
    );
}
