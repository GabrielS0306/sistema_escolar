import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Icone, type NomeIcone } from './ui/Icone';

const ABAS: { path: string; label: string; icone: NomeIcone }[] = [
    { path: 'alunos', label: 'Alunos', icone: 'alunos' },
    { path: 'frequencia', label: 'Frequência', icone: 'frequencia' },
    { path: 'notas', label: 'Notas', icone: 'notas' },
    { path: 'observacoes', label: 'Observações', icone: 'ocorrencias' },
];

export function TabsTurma() {
    const { turmaId } = useParams<{ turmaId: string }>();
    const [searchParams] = useSearchParams();
    const vinculo = searchParams.get('vinculo');
    const location = useLocation();

    return (
        // No celular as abas rolam na horizontal em vez de quebrar linha.
        <nav className="flex gap-1 overflow-x-auto border-b border-line mb-6 -mx-4 px-4 sm:mx-0 sm:px-0" aria-label="Seções da turma">
            {ABAS.map((aba) => {
                // O ?vinculo= precisa ir junto em toda aba (as telas dependem dele).
                const to = `/dashboard/professor/turma/${turmaId}/${aba.path}?vinculo=${vinculo}`;
                const ativo = location.pathname.endsWith(`/${aba.path}`);

                return (
                    <Link
                        key={aba.path}
                        to={to}
                        aria-current={ativo ? 'page' : undefined}
                        className={`flex items-center gap-2 px-3 pb-3 pt-1 text-sm border-b-2 -mb-px whitespace-nowrap transition-colors ${
                            ativo ? 'border-gold text-ink font-medium' : 'border-transparent text-slate hover:text-ink'
                        }`}
                    >
                        <Icone nome={aba.icone} tamanho={16} className={ativo ? 'text-gold' : ''} />
                        {aba.label}
                    </Link>
                );
            })}
        </nav>
    );
}
