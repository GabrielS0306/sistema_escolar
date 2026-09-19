import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAlunosPorTurma } from '../../hooks/useAlunosPorTurma';
import { registrarChamada } from '../../services/frequenciaProfessorService';
import { criarAvaliacao } from '../../services/avaliacaoService';
import { lancarNotas } from '../../services/notaProfessorService';

const TIPOS_AVALIACAO = [
    { value: 0, label: 'Comportamento' },
    { value: 1, label: 'Atividade' },
    { value: 2, label: 'Prova Bimestral' },
];

export function TurmaDetalhe() {
    const { turmaId } = useParams<{ turmaId: string }>();
    const [searchParams] = useSearchParams();
    const vinculoId = searchParams.get('vinculo');
    const navigate = useNavigate();
    const { alunos, carregando, erro } = useAlunosPorTurma(turmaId);

    // --- Chamada ---
    const [presencas, setPresencas] = useState<Record<string, boolean>>({});
    const [salvandoChamada, setSalvandoChamada] = useState(false);
    const [sucessoChamada, setSucessoChamada] = useState(false);
    const [erroChamada, setErroChamada] = useState<string | null>(null);

    function togglePresenca(alunoId: string) {
        setPresencas((prev) => ({ ...prev, [alunoId]: !(prev[alunoId] ?? true) }));
    }

    async function handleRegistrarChamada() {
        if (!vinculoId) return;

        setSalvandoChamada(true);
        setSucessoChamada(false);

        setErroChamada(null);
        try {
            await registrarChamada({
                professorTurmaDisciplinaId: vinculoId,
                data: new Date().toISOString(),
                presencas: alunos.map((a) => ({
                alunoId: a.alunoId,
                presente: presencas[a.alunoId] ?? true,
                })),
            });

            setSucessoChamada(true);
        } catch {
            setErroChamada('Não foi possível registrar a chamada.');
        } finally {
            setSalvandoChamada(false);
        }
    }

    // --- Notas ---
    const [bimestre, setBimestre] = useState(1);
    const [tipoAvaliacao, setTipoAvaliacao] = useState(0);
    const [nomeAvaliacao, setNomeAvaliacao] = useState('');
    const [dataAvaliacao, setDataAvaliacao] = useState(new Date().toISOString().slice(0, 10));
    const [notas, setNotas] = useState<Record<string, string>>({});
    const [salvandoNotas, setSalvandoNotas] = useState(false);
    const [sucessoNotas, setSucessoNotas] = useState(false);
    const [erroNotas, setErroNotas] = useState<string | null>(null);

    function alterarNota(alunoId: string, valor: string) {
        setNotas((prev) => ({ ...prev, [alunoId]: valor }));
    }

    async function handleLancarNotas() {
        if (!vinculoId || !nomeAvaliacao) return;

        setSalvandoNotas(true);
        setSucessoNotas(false);
        setErroNotas(null);

        try {
            const avaliacao = await criarAvaliacao({
                professorTurmaDisciplinaId: vinculoId,
                bimestre,
                tipo: tipoAvaliacao,
                nome: nomeAvaliacao,
                data: new Date(dataAvaliacao).toISOString(),
            });

            const notasPreenchidas = alunos
                .filter((a) => notas[a.alunoId] !== undefined && notas[a.alunoId] !== '')
                .map((a) => ({ alunoId: a.alunoId, valor: Number(notas[a.alunoId]) }));

            if (notasPreenchidas.length === 0) {
                setErroNotas('Preencha a nota de pelo menos um aluno.');
                return;
            }

            await lancarNotas({ avaliacaoId: avaliacao.id, notas: notasPreenchidas });
            setSucessoNotas(true);
            setNotas({});
            setNomeAvaliacao('');
        } catch {
            setErroNotas('Não foi possível lançar as notas.');
        } finally {
            setSalvandoNotas(false);
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

            {!carregando && !erro && alunos.length === 0 && (
                <p className="text-sm text-slate mt-10">Nenhum aluno matriculado nessa turma.</p>
            )}

            {!carregando && !erro && alunos.length > 0 && (
                <>
                    {/* Chamada */}
                    <div className="mt-10">
                        <p className="text-sm text-slate mb-4">Chamada de hoje</p>
                        {erroChamada && (
                            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{erroChamada}</p>
                        )}
                        {sucessoChamada && (
                            <p className="text-sm text-ink bg-gold/10 border border-gold/30 rounded px-3 py-2 mb-4">
                                Chamada registrada com sucesso.
                            </p>
                        )}

                        <table className="w-full border-t border-ink/10">
                            <thead>
                                <tr className="border-b border-ink/10 text-left">
                                    <th className="py-3 text-sm font-normal text-slate">Nome</th>
                                    <th className="py-3 text-sm font-normal text-slate">Matrícula</th>
                                    <th className="py-3 text-sm font-normal text-slate">Presente</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alunos.map((a) => (
                                    <tr key={a.alunoId} className="border-b border-ink/10">
                                        <td className="py-3 text-ink">{a.nomeAluno}</td>
                                        <td className="py-3 text-slate">{a.matricula}</td>
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
                            disabled={salvandoChamada || !vinculoId}
                            className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50 mt-4"
                        >
                            {salvandoChamada ? 'Registrando...' : 'Registrar chamada de hoje'}
                        </button>
                    </div>

                    {/* Notas */}
                    <div className="mt-14">
                        <p className="text-sm text-slate mb-4">Lançar notas</p>
                        {erroNotas && (
                            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{erroNotas}</p>
                        )}
                        {sucessoNotas && (
                            <p className="text-sm text-ink bg-gold/10 border border-gold/30 rounded px-3 py-2 mb-4">
                                Notas lançadas com sucesso.
                            </p>
                        )}

                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="block text-sm text-slate mb-1">Bimestre</label>
                                <select
                                    value={bimestre}
                                    onChange={(e) => setBimestre(Number(e.target.value))}
                                    className="w-full h-11 border border-ink/20 rounded px-3 focus:outline-none focus:border-gold"
                                >
                                    {[1, 2, 3, 4].map((b) => <option key={b} value={b}>{b}º</option>)}
                                </select>
                            </div>
                        <div>
                            <label className="block text-sm text-slate mb-1">Tipo</label>
                            <select
                                value={tipoAvaliacao}
                                onChange={(e) => setTipoAvaliacao(Number(e.target.value))}
                                className="w-full h-11 border border-ink/20 rounded px-3 focus:outline-none focus:border-gold"
                            >
                                {TIPOS_AVALIACAO.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate mb-1">Nome da avaliação</label>
                            <input
                                value={nomeAvaliacao}
                                onChange={(e) => setNomeAvaliacao(e.target.value)}
                                placeholder="ex: AV1"
                                className="w-full h-11 border border-ink/20 rounded px-3 focus:outline-none focus:border-gold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate mb-1">Data</label>
                            <input
                                type="date"
                                value={dataAvaliacao}
                                onChange={(e) => setDataAvaliacao(e.target.value)}
                                className="w-full h-11 border border-ink/20 rounded px-3 focus:outline-none focus:border-gold"
                            />
                        </div>
                        </div>

                        <table className="w-full border-t border-ink/10">
                            <thead>
                                <tr className="border-b border-ink/10 text-left">
                                    <th className="py-3 text-sm font-normal text-slate">Nome</th>
                                    <th className="py-3 text-sm font-normal text-slate">Nota</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alunos.map((a) => (
                                    <tr key={a.alunoId} className="border-b border-ink/10">
                                        <td className="py-3 text-ink">{a.nomeAluno}</td>
                                        <td className="py-3">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                value={notas[a.alunoId] ?? ''}
                                                onChange={(e) => alterarNota(a.alunoId, e.target.value)}
                                                className="w-20 h-9 border border-ink/20 rounded px-2 focus:outline-none focus:border-gold"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button
                            onClick={handleLancarNotas}
                            disabled={salvandoNotas || !vinculoId || !nomeAvaliacao}
                            className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50 mt-4"
                        >
                            {salvandoNotas ? 'Lançando...' : 'Lançar notas'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}