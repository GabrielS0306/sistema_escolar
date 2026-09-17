import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAlunosPorTurma } from '../../hooks/useAlunosPorTurma';
import { registrarChamada } from '../../services/frequenciaProfessorService';

export function TurmaDetalhe() {
    const { turmaId } = useParams<{ turmaId: string }>();
    const [searchParams] = useSearchParams();
    const vinculoId = searchParams.get('vinculo');
    const navigate = useNavigate();
    const { alunos, carregando, erro } = useAlunosPorTurma(turmaId);

    const [presencas, setPresencas] = useState<Record<string, boolean>>({});
    const [salvando, setSalvando] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [erroChamada, setErroChamada] = useState<string | null>(null);

    function togglePresenca(alunoId: string) {
        setPresencas((prev) => ({ ...prev, [alunoId]: !(prev[alunoId] ?? true) }));
    }

    async function handleRegistrarChamada() {
        if (!vinculoId) return;

        setSalvando(true);
        setSucesso(false);
        setErroChamada(null);
        
        try {
            await registrarChamada({
                professorTurmaDisciplinaId: vinculoId,
                data: new Date().toISOString(),
                presencas: alunos.map((a) => ({
                alunoId: a.alunoId,
                presente: presencas[a.id] ?? true,
                })),
            });

            setSucesso(true);
        } catch {
            setErroChamada('Não foi possível registrar a chamada.');
        } finally {
            setSalvando(false);
        }
    }

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
                    <>
                        {erroChamada && (
                            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mt-8">{erroChamada}</p>
                        )}
                        {sucesso && (
                            <p className="text-sm text-ink bg-gold/10 border border-gold/30 rounded px-3 py-2 mt-8">
                                Chamada registrada com sucesso.
                            </p>
                        )}

                        <table className="w-full mt-8 border-t border-ink/10">
                            <thead>
                                <tr className="border-b border-ink/10 text-left">
                                    <th className="py-3 text-sm font-normal text-slate">Nome</th>
                                    <th className="py-3 text-sm font-normal text-slate">Matrícula</th>
                                    <th className="py-3 text-sm font-normal text-slate">Presente hoje</th>
                                </tr>
                            </thead>

                            <tbody>
                                {alunos.map((a) => (
                                    <tr key={a.id} className="border-b border-ink/10">
                                        <td className="py-3 text-ink">{a.nomeAluno}</td>
                                        <td className="py-3 text-slate">{a.matricula}</td>
                                        <td className="py-3">
                                            <input
                                                type="checkbox"
                                                checked={presencas[a.id] ?? true}
                                                onChange={() => togglePresenca(a.id)}
                                                className="w-4 h-4 accent-ink"
                                            />
                                        </td>
                                    </tr>
                                ))} 
                            </tbody>
                        </table>

                        <button
                            onClick={handleRegistrarChamada}
                            disabled={salvando || !vinculoId}
                            className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50 mt-6"
                        >
                            {salvando ? 'Registrando...' : 'Registrar chamada de hoje'}
                        </button>
                    </>
                )
            )}
        </div>
    );
}