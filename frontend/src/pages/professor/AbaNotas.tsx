import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAlunosPorTurma } from '../../hooks/useAlunosPorTurma';
import { useNotasTurma } from '../../hooks/useNotasTurma';
import { criarAvaliacao } from '../../services/avaliacaoService';
import { lancarNotas } from '../../services/notaProfessorService';
import { Modal } from '../../components/Modal';

const TIPOS_AVALIACAO = [
    { value: 0, label: 'Comportamento' },
    { value: 1, label: 'Atividade' },
    { value: 2, label: 'Prova Bimestral' },
];

export function AbaNotas() {
    const { turmaId } = useParams<{ turmaId: string }>();
    const [searchParams] = useSearchParams();
    const vinculoId = searchParams.get('vinculo');

    const { alunos } = useAlunosPorTurma(turmaId);
    const { notas, carregando, erro, recarregarDados } = useNotasTurma(vinculoId);

    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);

    const [bimestre, setBimestre] = useState(1);
    const [tipoAvaliacao, setTipoAvaliacao] = useState(0);
    const [nomeAvaliacao, setNomeAvaliacao] = useState('');
    const [dataAvaliacao, setDataAvaliacao] = useState(new Date().toISOString().slice(0, 10));
    const [notasForm, setNotasForm] = useState<Record<string, string>>({});
    const [salvando, setSalvando] = useState(false);
    const [erroModal, setErroModal] = useState<string | null>(null);

    const notasFiltradas = notas.filter((n) =>
        n.nomeAluno.toLowerCase().includes(busca.toLowerCase())
    );

    function alterarNota(alunoId: string, valor: string) {
        setNotasForm((prev) => ({ ...prev, [alunoId]: valor }));
    }

    async function handleLancarNotas() {
        if (!vinculoId || !nomeAvaliacao) return;

        setSalvando(true);
        setErroModal(null);

        try {
            const avaliacao = await criarAvaliacao({
                professorTurmaDisciplinaId: vinculoId,
                bimestre,
                tipo: tipoAvaliacao,
                nome: nomeAvaliacao,
                data: new Date(dataAvaliacao).toISOString(),
            });

            const notasPreenchidas = alunos
                .filter((a) => notasForm[a.alunoId] !== undefined && notasForm[a.alunoId] !== '')
                .map((a) => ({ alunoId: a.alunoId, valor: Number(notasForm[a.alunoId]) }));

            if (notasPreenchidas.length === 0) {
                setErroModal('Preencha a nota de pelo menos um aluno.');
                return;
            }

            await lancarNotas({ avaliacaoId: avaliacao.id, notas: notasPreenchidas });

            setModalAberto(false);
            setNotasForm({});
            setNomeAvaliacao('');
            recarregarDados();
        } catch {
            setErroModal('Não foi possível lançar as notas.');
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
                        Lançar notas
                    </button>
            </div>

            {carregando && <p className="text-slate">Carregando...</p>}
            {erro && <p className="text-red-600">Erro: {erro}</p>}

            {!carregando && !erro && (
                notasFiltradas.length === 0 ? (
                    <p className="text-sm text-slate">Nenhuma nota lançada ainda.</p>
                ) : (
                    <table className="w-full border-t border-ink/10">
                        <thead>
                            <tr className="border-b border-ink/10 text-left">
                                <th className="py-3 text-sm font-normal text-slate">Aluno</th>
                                <th className="py-3 text-sm font-normal text-slate">Bimestre</th>
                                <th className="py-3 text-sm font-normal text-slate">Avaliação</th>
                                <th className="py-3 text-sm font-normal text-slate">Nota</th>
                            </tr>
                        </thead>

                        <tbody>
                            {notasFiltradas.map((n) => (
                                <tr key={n.id} className="border-b border-ink/10">
                                    <td className="py-3 text-ink">{n.nomeAluno}</td>
                                    <td className="py-3 text-slate">{n.bimestre}º</td>
                                    <td className="py-3 text-slate">{n.nomeAvaliacao}</td>
                                    <td className="py-3 text-ink font-medium">{n.valor.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}

            <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Lançar notas">
                {erroModal && (
                    <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{erroModal}</p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
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

                <table className="w-full border-t border-ink/10 mb-6">
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
                                        value={notasForm[a.alunoId] ?? ''}
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
                    disabled={salvando}
                    className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
                >
                    {salvando ? 'Lançando...' : 'Confirmar lançamento'}
                </button>
            </Modal>
        </div>
    );
}