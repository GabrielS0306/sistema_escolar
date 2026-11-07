import { Link } from 'react-router-dom';
import { useMinhasTurmas } from '../../hooks/useMinhasTurmas';
import { useAuth } from '../../hooks/useAuth';
import { Pagina, PageHeader, Carregando, EstadoErro, EstadoVazio } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Icone } from '../../components/ui/Icone';
import { ComunicadosRecentes } from '../../components/ComunicadosRecentes';
import { saudacao } from '../../utils/datas';

const ATALHOS_TURMA = [
    { aba: 'frequencia', label: 'Chamada', icone: 'frequencia' as const },
    { aba: 'notas', label: 'Notas', icone: 'notas' as const },
    { aba: 'observacoes', label: 'Observações', icone: 'ocorrencias' as const },
];

export function DashboardProfessor() {
    const { sessao } = useAuth();
    const { vinculos, carregando, erro } = useMinhasTurmas();

    return (
        <Pagina>
            <PageHeader
                eyebrow="Diário de classe"
                titulo={`${saudacao()}, ${sessao?.nome?.split(' ')[0] ?? ''}.`}
                descricao="Escolha uma turma para fazer a chamada, lançar notas ou registrar observações."
            />

            {carregando && <Carregando />}
            {erro && <EstadoErro mensagem={erro} />}

            {!carregando && !erro && (
                vinculos.length === 0 ? (
                    <Card>
                        <EstadoVazio
                            icone="turmas"
                            titulo="Nenhuma turma vinculada ainda"
                            descricao="Quando a coordenação vincular você a uma turma e disciplina, ela aparece aqui."
                        />
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {vinculos.map((v) => {
                            const base = `/dashboard/professor/turma/${v.turmaId}`;
                            const query = `?vinculo=${v.id}`;

                            return (
                                <div key={v.id} className="rounded-xl border border-line bg-surface shadow-card overflow-hidden flex flex-col">
                                    <Link to={`${base}/alunos${query}`} className="group p-5 flex-1 hover:bg-surface-muted/40 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="w-10 h-10 rounded-lg bg-gold-soft text-gold flex items-center justify-center">
                                                <Icone nome="livro" />
                                            </span>
                                            <Icone nome="setaDireita" className="text-slate group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                                        </div>
                                        <p className="text-lg font-semibold text-ink mt-4">{v.disciplina}</p>
                                        <p className="text-sm text-slate">Turma {v.turma}</p>
                                    </Link>

                                    {/* Atalhos diretos para as tarefas do dia a dia */}
                                    <div className="grid grid-cols-3 border-t border-line divide-x divide-line">
                                        {ATALHOS_TURMA.map((a) => (
                                            <Link
                                                key={a.aba}
                                                to={`${base}/${a.aba}${query}`}
                                                className="flex flex-col items-center gap-1 py-2.5 text-xs text-slate hover:text-gold hover:bg-surface-muted/40 transition-colors"
                                            >
                                                <Icone nome={a.icone} tamanho={16} />
                                                {a.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}

            <ComunicadosRecentes />
        </Pagina>
    );
}
