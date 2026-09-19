import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';

const ABAS = [
  { path: 'alunos', label: 'Alunos' },
  { path: 'frequencia', label: 'Frequência' },
  { path: 'notas', label: 'Notas' },
  { path: 'observacoes', label: 'Observações' },
];

export function TabsTurma() {
    const { turmaId } = useParams<{ turmaId: string }>();
    const [searchParams] = useSearchParams();
    const vinculo = searchParams.get('vinculo');
    const location = useLocation();

    return (
        <div className="flex gap-6 border-b border-ink/10 mb-8">
            {ABAS.map((aba) => {
                const to = `/dashboard/professor/turma/${turmaId}/${aba.path}?vinculo=${vinculo}`;
                const ativo = location.pathname.endsWith(`/${aba.path}`);

                return (
                    <Link
                        key={aba.path}
                        to={to}
                        className={`pb-3 text-sm border-b-2 -mb-px transition-colors ${
                        ativo
                            ? 'border-gold text-ink font-medium'
                            : 'border-transparent text-slate hover:text-ink'
                        }`}
                    >
                        {aba.label}
                    </Link>
                );
            })}
        </div>
    );
}