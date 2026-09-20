import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAlunosPorTurma } from '../../hooks/useAlunosPorTurma';
import { useOcorrenciasTurma } from '../../hooks/useOcorrenciasTurma';
import { criarOcorrencia } from '../../services/ocorrenciaTurmaService';
import { getMe } from '../../services/authService';
import { Modal } from '../../components/Modal';

const TIPOS_OCORRENCIA = [
    { value: 0, label: 'Disciplinar' },
    { value: 1, label: 'Saúde' },
    { value: 2, label: 'Atraso' },
    { value: 3, label: 'Elogio' },
    { value: 4, label: 'Outro' },
];

export function AbaObservacoes() {
    const { turmaId } = useParams<{ turmaId: string }>();
    const { alunos } = useAlunosPorTurma(turmaId);
    const { ocorrencias, carregando, erro, recarregarDados } = useOcorrenciasTurma(turmaId);

    const [meuUsuarioId, setMeuUsuarioId] = useState<string | null>(null);
    useEffect(() => {
        getMe().then((u) => setMeuUsuarioId(u.id)).catch(() => {});
    }, []);

    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState('');
    const [tipo, setTipo] = useState(0);
    const [descricao, setDescricao] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [erroModal, setErroModal] = useState<string | null>(null);

    const ocorrenciasFiltradas = ocorrencias.filter((o) =>
        o.nomeAluno.toLowerCase().includes(busca.toLowerCase())
    );

    async function handleRegistrar() {
        if (!alunoSelecionado || !descricao || !meuUsuarioId) return;

        setSalvando(true);
        setErroModal(null);

        try {
            await criarOcorrencia({
                alunoId: alunoSelecionado,
                registradoPorUsuarioId: meuUsuarioId,
                tipo,
                descricao,
            });

            setModalAberto(false);
            setAlunoSelecionado('');
            setDescricao('');
            setTipo(0);
            recarregarDados();
        } catch {
            setErroModal('Não foi possível registrar a observação.');
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
                    Registrar observação
                </button>
            </div>

            {carregando && <p className="text-slate">Carregando...</p>}
            {erro && <p className="text-red-600">Erro: {erro}</p>}

            {!carregando && !erro && (
                ocorrenciasFiltradas.length === 0 ? (
                    <p className="text-sm text-slate">Nenhuma observação registrada ainda.</p>
                ) : (
                    <table className="w-full border-t border-ink/10">
                        <thead>
                            <tr className="border-b border-ink/10 text-left">
                                <th className="py-3 text-sm font-normal text-slate">Aluno</th>
                                <th className="py-3 text-sm font-normal text-slate">Tipo</th>
                                <th className="py-3 text-sm font-normal text-slate">Descrição</th>
                                <th className="py-3 text-sm font-normal text-slate">Data</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ocorrenciasFiltradas.map((o) => (
                                <tr key={o.id} className="border-b border-ink/10">
                                <td className="py-3 text-ink">{o.nomeAluno}</td>
                                <td className="py-3 text-slate">{TIPOS_OCORRENCIA[o.tipo]?.label}</td>
                                <td className="py-3 text-slate">{o.descricao}</td>
                                <td className="py-3 text-slate">{new Date(o.data).toLocaleDateString('pt-BR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}

            <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Registrar observação">
                {erroModal && (
                    <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{erroModal}</p>
                )}

                <label className="block text-sm text-slate mb-1">Aluno</label>
                <select
                    value={alunoSelecionado}
                    onChange={(e) => setAlunoSelecionado(e.target.value)}
                    className="w-full h-11 border border-ink/20 rounded px-3 mb-4 focus:outline-none focus:border-gold"
                >
                    <option value="">Selecione um aluno</option>
                    {alunos.map((a) => (
                        <option key={a.alunoId} value={a.alunoId}>{a.nomeAluno}</option>
                    ))}
                </select>

                <label className="block text-sm text-slate mb-1">Tipo</label>
                <select
                    value={tipo}
                    onChange={(e) => setTipo(Number(e.target.value))}
                    className="w-full h-11 border border-ink/20 rounded px-3 mb-4 focus:outline-none focus:border-gold"
                >
                    {TIPOS_OCORRENCIA.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>

                <label className="block text-sm text-slate mb-1">Descrição</label>
                <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                    className="w-full border border-ink/20 rounded px-3 py-2 mb-6 focus:outline-none focus:border-gold"
                />

                <button
                    onClick={handleRegistrar}
                    disabled={salvando || !alunoSelecionado || !descricao}
                    className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
                >
                    {salvando ? 'Registrando...' : 'Confirmar registro'}
                </button>
            </Modal>
        </div>
    );
}