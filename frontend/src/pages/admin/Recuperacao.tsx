import { useState } from 'react';
import { useRecuperacao } from '../../hooks/useRecuperacao';
import { registrarProvaFinal } from '../../services/recuperacaoService';
import { Modal } from '../../components/Modal';
import { MEDIA_APROVACAO, mediaComProvaFinal, type SituacaoRecuperacao } from '../../types/recuperacao';

// Aceita "7,5" e "7.5"; devolve null se não for uma nota válida de 0 a 10.
function lerNota(texto: string): number | null {
    if (texto.trim() === '') return null;

    const valor = Number(texto.replace(',', '.'));

    return Number.isFinite(valor) && valor >= 0 && valor <= 10 ? valor : null;
}

export function Recuperacao() {
    const { situacoes, carregando, erro, recarregarDados } = useRecuperacao();

    const [busca, setBusca] = useState('');
    const [selecionada, setSelecionada] = useState<SituacaoRecuperacao | null>(null);
    const [notaTexto, setNotaTexto] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [erroModal, setErroModal] = useState<string | null>(null);
    const [aviso, setAviso] = useState<string | null>(null);

    const filtradas = situacoes.filter((s) =>
        `${s.nomeAluno} ${s.matricula} ${s.disciplina}`.toLowerCase().includes(busca.toLowerCase())
    );

    const nota = lerNota(notaTexto);
    const mediaResultante = selecionada?.mediaFinal != null && nota !== null
        ? mediaComProvaFinal(selecionada.mediaFinal, nota)
        : null;
    const vaiAprovar = mediaResultante !== null && mediaResultante >= MEDIA_APROVACAO;

    function abrirModal(situacao: SituacaoRecuperacao) {
        setNotaTexto('');
        setErroModal(null);
        setSelecionada(situacao);
    }

    async function handleLancar() {
        if (!selecionada || nota === null) return;

        setSalvando(true);
        setErroModal(null);

        try {
            await registrarProvaFinal(selecionada.id, nota);

            setAviso(
                `${selecionada.nomeAluno} — ${selecionada.disciplina}: ${vaiAprovar ? 'aprovado' : 'reprovado'} na prova final.`
            );
            setSelecionada(null);
            recarregarDados();
        } catch {
            setErroModal('Não foi possível lançar a prova final.');
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Gestão acadêmica</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Recuperação</h1>
            <p className="text-sm text-slate mt-1">
                Disciplinas com média final abaixo de {MEDIA_APROVACAO} aguardando prova final.
            </p>

            <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por aluno, matrícula ou disciplina..."
                className="w-96 h-11 border border-ink/20 rounded px-3 mt-8 mb-8 focus:outline-none focus:border-gold"
            />

            {aviso && (
                <div className="flex items-start justify-between gap-4 border-l-2 border-gold bg-gold/10 px-4 py-3 mb-8">
                    <div>
                        <p className="text-sm text-ink">{aviso}</p>
                        <p className="text-xs text-slate mt-1">
                            Se o aluno chegar a 3 reprovações no ano, o conselho de classe é aberto automaticamente.
                        </p>
                    </div>
                    <button onClick={() => setAviso(null)} className="text-slate hover:text-ink leading-none">×</button>
                </div>
            )}

            {carregando && <p className="text-slate">Carregando...</p>}
            {erro && <p className="text-red-600">Erro: {erro}</p>}

            {!carregando && !erro && (
                filtradas.length === 0 ? (
                    <p className="text-sm text-slate">Nenhum aluno em recuperação.</p>
                ) : (
                    <table className="w-full border-t border-ink/10">
                        <thead>
                            <tr className="border-b border-ink/10 text-left">
                                <th className="py-3 text-sm font-normal text-slate">Aluno</th>
                                <th className="py-3 text-sm font-normal text-slate">Disciplina</th>
                                <th className="py-3 text-sm font-normal text-slate">Turma</th>
                                <th className="py-3 text-sm font-normal text-slate">Média final</th>
                                <th className="py-3"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtradas.map((s) => (
                                <tr key={s.id} className="border-b border-ink/10">
                                    <td className="py-3">
                                        <p className="text-ink">{s.nomeAluno}</p>
                                        <p className="text-xs text-slate">Matrícula {s.matricula}</p>
                                    </td>
                                    <td className="py-3 text-ink">{s.disciplina}</td>
                                    <td className="py-3 text-slate">{s.turma} · {s.anoLetivo}</td>
                                    <td className="py-3 text-amber-700">{s.mediaFinal?.toFixed(1) ?? '—'}</td>
                                    <td className="py-3 text-right">
                                        <button
                                            onClick={() => abrirModal(s)}
                                            className="bg-ink text-paper rounded px-4 py-2 text-sm font-medium hover:bg-ink/90"
                                        >
                                            Lançar prova final
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}

            <Modal aberto={selecionada !== null} onFechar={() => setSelecionada(null)} titulo="Lançar prova final">
                {selecionada && (
                    <>
                        {erroModal && (
                            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{erroModal}</p>
                        )}

                        <p className="font-serif text-xl text-ink">{selecionada.nomeAluno}</p>
                        <p className="text-sm text-slate">
                            {selecionada.disciplina} · {selecionada.turma} · {selecionada.anoLetivo}
                        </p>

                        <div className="grid grid-cols-2 mt-6 border-y border-ink/10">
                            <div className="py-4 px-4 border-r border-ink/10">
                                <p className="font-serif text-3xl text-amber-700">{selecionada.mediaFinal?.toFixed(1) ?? '—'}</p>
                                <p className="text-sm text-slate mt-1">Média final</p>
                            </div>
                            <div className="py-4 px-4">
                                <p className={`font-serif text-3xl ${mediaResultante === null ? 'text-slate' : vaiAprovar ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {mediaResultante?.toFixed(1) ?? '—'}
                                </p>
                                <p className="text-sm text-slate mt-1">Média com a prova final</p>
                            </div>
                        </div>

                        <label className="block text-sm text-slate mt-6 mb-1">Nota da prova final (0 a 10)</label>
                        <input
                            value={notaTexto}
                            onChange={(e) => setNotaTexto(e.target.value)}
                            inputMode="decimal"
                            placeholder="Ex.: 7,5"
                            autoFocus
                            className="w-40 h-11 border border-ink/20 rounded px-3 focus:outline-none focus:border-gold"
                        />
                        {notaTexto !== '' && nota === null && (
                            <p className="text-sm text-red-700 mt-2">Digite uma nota de 0 a 10.</p>
                        )}

                        {mediaResultante !== null && (
                            <p className="text-sm text-slate mt-4">
                                Resultado:{' '}
                                <span className={`font-medium ${vaiAprovar ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {vaiAprovar ? 'Aprovado' : 'Reprovado'}
                                </span>
                            </p>
                        )}
                        <p className="text-sm text-slate mt-1 mb-6">Depois de lançada, a prova final não pode ser alterada.</p>

                        <button
                            onClick={handleLancar}
                            disabled={salvando || nota === null}
                            className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
                        >
                            {salvando ? 'Lançando...' : 'Confirmar lançamento'}
                        </button>
                    </>
                )}
            </Modal>
        </div>
    );
}
