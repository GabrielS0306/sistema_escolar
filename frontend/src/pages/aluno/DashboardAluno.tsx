import { useMeuResumo } from '../../hooks/useMeuResumo';

const STATUS_LABEL = ['Em andamento', 'Aprovado', 'Em recuperação', 'Reprovado'];
const STATUS_COR = ['text-slate', 'text-emerald-700', 'text-amber-700', 'text-red-700'];

export function DashboardAluno() {
    const { resumo, carregando, erro } = useMeuResumo();

    if (carregando) return <p className="text-slate px-12 py-10">Carregando...</p>;
    if (erro) return <p className="text-red-600 px-12 py-10">Erro: {erro}</p>;
    if (!resumo) return null;

    const totalPresencas = resumo.frequencias.filter((f) => f.presente).length;
    const percentualFrequencia = resumo.frequencias.length > 0
        ? Math.round((totalPresencas / resumo.frequencias.length) * 100)
        : null;

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Portal do aluno</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Olá, {resumo.nomeAluno.split(' ')[0]}.</h1>
            <p className="text-sm text-slate mt-1">Matrícula {resumo.matricula}</p>

            <div className="grid grid-cols-2 mt-10 border-y border-ink/10">
                <div className="py-6 px-6 border-r border-ink/10">
                    <p className="font-serif text-4xl text-ink">
                        {percentualFrequencia !== null ? `${percentualFrequencia}%` : '—'}
                    </p>
                    <p className="text-sm text-slate mt-1">Frequência registrada</p>
                </div>

                <div className="py-6 px-6">
                    <p className="font-serif text-4xl text-ink">{resumo.ocorrencias.length}</p>
                    <p className="text-sm text-slate mt-1">Ocorrências</p>
                </div>
            </div>

            <div className="mt-12">
                <p className="text-sm text-slate mb-4">Situação por disciplina</p>
                {resumo.situacoesDisciplina.length === 0 ? (
                    <p className="text-sm text-slate">Nenhuma situação registrada ainda.</p>
                ) : (
                    <table className="w-full border-t border-ink/10">
                        <thead>
                            <tr className="border-b border-ink/10 text-left">
                                <th className="py-3 text-sm font-normal text-slate">Disciplina</th>
                                <th className="py-3 text-sm font-normal text-slate">Turma</th>
                                <th className="py-3 text-sm font-normal text-slate">Média</th>
                                <th className="py-3 text-sm font-normal text-slate">Situação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resumo.situacoesDisciplina.map((s) => (
                                <tr key={s.id} className="border-b border-ink/10">
                                    <td className="py-3 text-ink">{s.disciplina}</td>
                                    <td className="py-3 text-slate">{s.turma}</td>
                                    <td className="py-3 text-slate">{s.mediaFinal?.toFixed(1) ?? '—'}</td>
                                    <td className={`py-3 text-sm ${STATUS_COR[s.status]}`}>{STATUS_LABEL[s.status]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="mt-12">
                <p className="text-sm text-slate mb-4">Últimas notas</p>
                    {resumo.notas.length === 0 ? (
                <p className="text-sm text-slate">Nenhuma nota lançada ainda.</p>
                ) : (
                    <table className="w-full border-t border-ink/10">
                        <thead>
                            <tr className="border-b border-ink/10 text-left">
                                <th className="py-3 text-sm font-normal text-slate">Bimestre</th>
                                <th className="py-3 text-sm font-normal text-slate">Avaliação</th>
                                <th className="py-3 text-sm font-normal text-slate">Nota</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resumo.notas.map((n) => (
                                <tr key={n.id} className="border-b border-ink/10">
                                    <td className="py-3 text-slate">{n.bimestre}º</td>
                                    <td className="py-3 text-ink">{n.nomeAvaliacao}</td>
                                    <td className="py-3 text-ink font-medium">{n.valor.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}