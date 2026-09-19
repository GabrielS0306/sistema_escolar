import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAlunosPorTurma } from '../../hooks/useAlunosPorTurma';
import { useFrequenciaTurma } from '../../hooks/useFrequenciaTurma';
import { registrarChamada } from '../../services/frequenciaProfessorService';
import { Modal } from '../../components/Modal';

export function AbaFrequencia() {
    const { turmaId } = useParams<{ turmaId: string }>();
    const [searchParams] = useSearchParams();
    const vinculoId = searchParams.get('vinculo');

    const { alunos } = useAlunosPorTurma(turmaId);
    const { frequencias, carregando, erro, recarregarDados } = useFrequenciaTurma(vinculoId);

    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [presencas, setPresencas] = useState<Record<string, boolean>>({});
    const [salvando, setSalvando] = useState(false);
    const [erroModal, setErroModal] = useState<string | null>(null);

    const frequenciasFiltradas = frequencias.filter((f) =>
        f.nomeAluno.toLowerCase().includes(busca.toLowerCase())
    );

    function togglePresenca(alunoId: string) {
        setPresencas((prev) => ({ ...prev, [alunoId]: !(prev[alunoId] ?? true) }));
    }

    async function handleRegistrarChamada() {
        if (!vinculoId) return;

        setSalvando(true);
        setErroModal(null);

        try {
            await registrarChamada({
                professorTurmaDisciplinaId: vinculoId,
                data: new Date().toISOString(),
                presencas: alunos.map((a) => ({
                alunoId: a.alunoId,
                presente: presencas[a.alunoId] ?? true,
                })),
            });

            setModalAberto(false);
            setPresencas({});
            recarregarDados();
        } catch {
            setErroModal('Não foi possível registrar a chamada.');
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por aluno..."
                    className="w-72 h-11 border border-ink/20 rounded px-3 focus:outline-none focus:border-gold"
                />

                <button
                    onClick={() => setModalAberto(true)}
                    className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90"
                >
                    Registrar chamada
                </button>
            </div>

            {carregando && <p className="text-slate">Carregando...</p>}
            {erro && <p className="text-red-600">Erro: {erro}</p>}

            {!carregando && !erro && (
                frequenciasFiltradas.length === 0 ? (
                    <p className="text-sm text-slate">Nenhum registro de frequência encontrado.</p>
                ) : (
                    <table className="w-full border-t border-ink/10">
                        <thead>
                            <tr className="border-b border-ink/10 text-left">
                                <th className="py-3 text-sm font-normal text-slate">Aluno</th>
                                <th className="py-3 text-sm font-normal text-slate">Data</th>
                                <th className="py-3 text-sm font-normal text-slate">Presença</th>
                            </tr>
                        </thead>

                        <tbody>
                            {frequenciasFiltradas.map((f) => (
                                <tr key={f.id} className="border-b border-ink/10">
                                    <td className="py-3 text-ink">{f.nomeAluno}</td>
                                    <td className="py-3 text-slate">{new Date(f.data).toLocaleDateString('pt-BR')}</td>
                                    <td className="py-3">
                                        {f.presente ? (
                                            <span className="text-sm text-emerald-700">Presente</span>
                                        ) : (
                                            <span className="text-sm text-red-700">Falta</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}

            <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Registrar chamada de hoje">
                {erroModal && (
                    <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{erroModal}</p>
                )}

                <table className="w-full border-t border-ink/10 mb-6">
                    <thead>
                        <tr className="border-b border-ink/10 text-left">
                            <th className="py-3 text-sm font-normal text-slate">Nome</th>
                            <th className="py-3 text-sm font-normal text-slate">Presente</th>
                        </tr>
                    </thead>

                    <tbody>
                        {alunos.map((a) => (
                            <tr key={a.alunoId} className="border-b border-ink/10">
                                <td className="py-3 text-ink">{a.nomeAluno}</td>
                                <td className="py-3">
                                    <input
                                        type="checkbox"
                                        checked={presencas[a.alunoId] ?? true}
                                        onChange={() => togglePresenca(a.alunoId)}
                                        className="w-4 h-4 accent-ink"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                        
                <button
                    onClick={handleRegistrarChamada}
                    disabled={salvando}
                    className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
                >
                    {salvando ? 'Registrando...' : 'Confirmar chamada'}
                </button>
            </Modal>
        </div>
    );
}