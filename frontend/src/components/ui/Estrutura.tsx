import type { ReactNode } from 'react';
import { Icone, type NomeIcone } from './Icone';

// ---------- Cabeçalho de página ----------

interface PageHeaderProps {
    titulo: string;
    eyebrow?: string;      // texto pequeno acima do título (ex.: "Gestão acadêmica")
    descricao?: string;
    acoes?: ReactNode;
}

export function PageHeader({ titulo, eyebrow, descricao, acoes }: PageHeaderProps) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div className="min-w-0">
                {eyebrow && <p className="text-xs font-medium uppercase tracking-wider text-gold mb-1">{eyebrow}</p>}
                <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight">{titulo}</h1>
                {descricao && <p className="text-sm text-slate mt-1 max-w-2xl">{descricao}</p>}
            </div>
            {acoes && <div className="flex flex-wrap items-center gap-2">{acoes}</div>}
        </div>
    );
}

// Container padrão do conteúdo de uma página (largura e respiro iguais em todas as telas).
export function Pagina({ children, estreita = false }: { children: ReactNode; estreita?: boolean }) {
    return (
        <div className={`mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 ${estreita ? 'max-w-4xl' : 'max-w-7xl'}`}>
            {children}
        </div>
    );
}

// Barra entre o cabeçalho e o conteúdo: busca/filtros à esquerda, ações à direita.
export function BarraFerramentas({ children }: { children: ReactNode }) {
    return <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">{children}</div>;
}

// ---------- Números de destaque ----------

type TomStat = 'neutro' | 'sucesso' | 'alerta' | 'perigo' | 'destaque';

const TOM_STAT: Record<TomStat, { valor: string; icone: string }> = {
    neutro: { valor: 'text-ink', icone: 'bg-surface-muted text-slate' },
    sucesso: { valor: 'text-success', icone: 'bg-success-soft text-success' },
    alerta: { valor: 'text-warning', icone: 'bg-warning-soft text-warning' },
    perigo: { valor: 'text-danger', icone: 'bg-danger-soft text-danger' },
    destaque: { valor: 'text-gold', icone: 'bg-gold-soft text-gold' },
};

interface StatCardProps {
    valor: ReactNode;
    rotulo: string;
    icone?: NomeIcone;
    tom?: TomStat;
    detalhe?: string;
}

export function StatCard({ valor, rotulo, icone, tom = 'neutro', detalhe }: StatCardProps) {
    return (
        <div className="rounded-xl border border-line bg-surface shadow-card p-5">
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-slate">{rotulo}</p>
                {icone && (
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${TOM_STAT[tom].icone}`}>
                        <Icone nome={icone} tamanho={18} />
                    </span>
                )}
            </div>
            <p className={`font-serif text-4xl font-semibold mt-2 ${TOM_STAT[tom].valor}`}>{valor}</p>
            {detalhe && <p className="text-xs text-slate mt-1">{detalhe}</p>}
        </div>
    );
}

// ---------- Estados de carregamento, erro e vazio ----------

export function Carregando({ texto = 'Carregando...' }: { texto?: string }) {
    return (
        <div className="flex items-center gap-3 py-10 justify-center text-slate" role="status">
            <span className="w-5 h-5 rounded-full border-2 border-gold border-t-transparent animate-spin" aria-hidden="true" />
            <span className="text-sm">{texto}</span>
        </div>
    );
}

interface EstadoProps {
    icone?: NomeIcone;
    titulo: string;
    descricao?: string;
    acao?: ReactNode;
}

// Tela/área vazia que orienta o próximo passo (em vez de só "Nenhum item").
export function EstadoVazio({ icone = 'vazio', titulo, descricao, acao }: EstadoProps) {
    return (
        <div className="flex flex-col items-center text-center py-12 px-4">
            <span className="w-12 h-12 rounded-full bg-surface-muted text-slate flex items-center justify-center mb-3">
                <Icone nome={icone} tamanho={22} />
            </span>
            <p className="font-medium text-ink">{titulo}</p>
            {descricao && <p className="text-sm text-slate mt-1 max-w-sm">{descricao}</p>}
            {acao && <div className="mt-4">{acao}</div>}
        </div>
    );
}

export function EstadoErro({ mensagem, onTentarNovamente }: { mensagem: string; onTentarNovamente?: () => void }) {
    return (
        <div className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3" role="alert">
            <Icone nome="erro" className="text-danger mt-0.5" />
            <div className="flex-1">
                <p className="text-sm text-danger">{mensagem}</p>
                {onTentarNovamente && (
                    <button onClick={onTentarNovamente} className="text-sm font-medium text-danger underline mt-1">
                        Tentar novamente
                    </button>
                )}
            </div>
        </div>
    );
}

// Aviso dentro de um formulário/modal (ex.: "A prova final não pode ser alterada").
export function Aviso({ tom = 'info', children }: { tom?: 'info' | 'alerta' | 'perigo' | 'sucesso'; children: ReactNode }) {
    const estilos = {
        info: { caixa: 'bg-info-soft border-info/25', icone: 'info' as const, cor: 'text-info' },
        alerta: { caixa: 'bg-warning-soft border-warning/25', icone: 'alerta' as const, cor: 'text-warning' },
        perigo: { caixa: 'bg-danger-soft border-danger/25', icone: 'erro' as const, cor: 'text-danger' },
        sucesso: { caixa: 'bg-success-soft border-success/25', icone: 'sucesso' as const, cor: 'text-success' },
    }[tom];

    return (
        <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${estilos.caixa}`}>
            <Icone nome={estilos.icone} className={`mt-0.5 ${estilos.cor}`} />
            <div className="text-sm text-ink">{children}</div>
        </div>
    );
}
