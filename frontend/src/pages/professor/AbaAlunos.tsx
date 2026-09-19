import { useParams } from 'react-router-dom';
import { useAlunosPorTurma } from '../../hooks/useAlunosPorTurma';

export function AbaAlunos() {
    const { turmaId } = useParams<{ turmaId: string }>();
    const { alunos, carregando, erro } = useAlunosPorTurma(turmaId);

    if (carregando) return <p className="text-slate">Carregando...</p>;
    if (erro) return <p className="text-red-600">Erro: {erro}</p>;

    return alunos.length === 0 ? (
        <p className="text-sm text-slate">Nenhum aluno matriculado nessa turma.</p>
    ) : (
        <table className="w-full border-t border-ink/10">
            <thead>
                <tr className="border-b border-ink/10 text-left">
                    <th className="py-3 text-sm font-normal text-slate">Nome</th>
                    <th className="py-3 text-sm font-normal text-slate">Matrícula</th>
                </tr>
            </thead>

            <tbody>
                {alunos.map((a) => (
                    <tr key={a.alunoId} className="border-b border-ink/10">
                        <td className="py-3 text-ink">{a.nomeAluno}</td>
                        <td className="py-3 text-slate">{a.matricula}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}