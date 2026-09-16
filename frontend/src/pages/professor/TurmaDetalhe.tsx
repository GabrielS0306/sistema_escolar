import { useParams, useNavigate } from 'react-router-dom';
import { useAlunosPorTurma } from '../../hooks/useAlunosPorTurma';

export function TurmaDetalhe() {
    const { turmaId } = useParams<{ turmaId: string }>();
    const navigate = useNavigate();
    const { alunos, carregando, erro } = useAlunosPorTurma(turmaId);

    return (
        <div className="px-12 py-10">
            <button onClick={() => navigate(-1)} className="text-sm text-slate hover:text-ink mb-6">
                ← Voltar
            </button>

            <p className="text-sm text-slate">Diário de classe</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Alunos matriculados</h1>

            {carregando && <p className="text-slate mt-10">Carregando...</p>}
            {erro && <p className="text-red-600 mt-10">Erro: {erro}</p>}

            {!carregando && !erro && (
                alunos.length === 0 ? (
                    <p className="text-sm text-slate mt-10">Nenhum aluno matriculado nessa turma.</p>
                ) : (
                    <table className="w-full mt-10 border-t border-ink/10">
                        <thead>
                            <tr className="border-b border-ink/10 text-left">
                                <th className="py-3 text-sm font-normal text-slate">Nome</th>
                                <th className="py-3 text-sm font-normal text-slate">Matrícula</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alunos.map((a) => (
                                <tr key={a.id} className="border-b border-ink/10 hover:bg-ink/5 transition-colors">
                                    <td className="py-3 text-ink">{a.nomeAluno}</td>
                                    <td className="py-3 text-slate">{a.matricula}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}
        </div>
    );
}