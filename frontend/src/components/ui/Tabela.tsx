import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';

// Tabela padrão: rola na horizontal em telas pequenas em vez de estourar o layout.
export function Tabela({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full text-sm">{children}</table>
        </div>
    );
}

export function TabelaCabecalho({ children }: { children: ReactNode }) {
    return (
        <thead className="bg-surface-muted/60">
            <tr className="border-y border-line text-left">{children}</tr>
        </thead>
    );
}

export function Th({ className = '', ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
    return <th className={`px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-slate whitespace-nowrap ${className}`} {...props} />;
}

export function TabelaCorpo({ children }: { children: ReactNode }) {
    return <tbody className="divide-y divide-line">{children}</tbody>;
}

export function Tr({ className = '', ...props }: HTMLAttributes<HTMLTableRowElement>) {
    return <tr className={`hover:bg-surface-muted/50 transition-colors ${className}`} {...props} />;
}

export function Td({ className = '', ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
    return <td className={`px-4 py-3 text-ink align-middle ${className}`} {...props} />;
}

// Célula com texto principal + linha secundária (ex.: nome do aluno + matrícula).
export function CelulaDupla({ principal, secundario }: { principal: ReactNode; secundario?: ReactNode }) {
    return (
        <div className="min-w-0">
            <p className="text-ink font-medium truncate">{principal}</p>
            {secundario && <p className="text-xs text-slate truncate">{secundario}</p>}
        </div>
    );
}
