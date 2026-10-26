import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    titulo?: string;
    descricao?: string;
    acoes?: ReactNode;
    semPadding?: boolean;  // para tabelas que encostam nas bordas
}

export function Card({ titulo, descricao, acoes, semPadding = false, className = '', children, ...resto }: CardProps) {
    return (
        <section className={`rounded-xl border border-line bg-surface shadow-card ${className}`} {...resto}>
            {(titulo || acoes) && (
                <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-3">
                    <div>
                        {titulo && <h2 className="text-base font-semibold text-ink">{titulo}</h2>}
                        {descricao && <p className="text-sm text-slate mt-0.5">{descricao}</p>}
                    </div>
                    {acoes && <div className="flex items-center gap-2">{acoes}</div>}
                </header>
            )}

            <div className={semPadding ? '' : titulo || acoes ? 'px-5 pb-5' : 'p-5'}>{children}</div>
        </section>
    );
}
