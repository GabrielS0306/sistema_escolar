import { useState } from 'react';
import { useConselhos } from '../../hooks/useConselhos';
import { encerrarConselho } from '../../services/conselhoService';
import { TabelaConselhos } from '../../components/TabelaConselhos';
import { Modal } from '../../components/Modal';
import { RESULTADO_COR, RESULTADO_LABEL, type ConselhoClasse } from '../../types/conselho';

// Mesma regra do backend (ConselhosClasseController.Encerrar): empate aprova.
function resultadoPrevisto(c: ConselhoClasse) {
    return c.votosAprovar >= c.votosReprovar ? 1 : 2;
}

export function ConselhosClasse() {
    const { conselhos, carregando, erro, recarregarDados } = useConselhos();

    const [busca, setBusca] = useState('');
    const [conselhoSelecionado, setConselhoSelecionado] = useState<ConselhoClasse | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [erroModal, setErroModal] = useState<string | null>(null);

    const filtrados = conselhos.filter((c) =>
        c.nomeAluno.toLowerCase().includes(busca.toLowerCase())
    );
    const pendentes = filtrados.filter((c) => c.resultado === 0);
    const encerrados = filtrados.filter((c) => c.resultado !== 0);

    function abrirModal(conselho: ConselhoClasse) {
        setErroModal(null);
        setConselhoSelecionado(conselho);
    }

    async function handleEncerrar() {
        if (!conselhoSelecionado) return;

        setSalvando(true);
        setErroModal(null);

        try {
            await encerrarConselho(conselhoSelecionado.id);
            setConselhoSelecionado(null);
            recarregarDados();
        } catch {
            setErroModal('Não foi possível encerrar o conselho.');
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Gestão acadêmica</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Conselho de classe</h1>

            <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por aluno..."
                className="w-72 h-11 border border-ink/20 rounded px-3 mt-8 focus:outline-none focus:border-gold"
            />

            {carregando && <p className="text-slate mt-10">Carregando...</p>}
            {erro && <p className="text-red-600 mt-10">Erro: {erro}</p>}

            {!carregando && !erro && (
                <>
                    <div className="mt-10">
                        <p className="text-sm text-slate mb-4">Aguardando votação</p>
                        <TabelaConselhos
                            conselhos={pendentes}
                            mensagemVazia="Nenhum conselho aguardando votação."
                            renderAcao={(c) =>
                                c.votosAprovar + c.votosReprovar === 0 ? (
                                    <span className="text-slate">Sem votos ainda</span>
                                ) : (
                                    <button
                                        onClick={() => abrirModal(c)}
                                        className="bg-ink text-paper rounded px-4 py-2 text-sm font-medium hover:bg-ink/90"
                                    >
                                        Encerrar
                                    </button>
                                )
                            }
                        />
                    </div>

                    <div className="mt-12">
                        <p className="text-sm text-slate mb-4">Encerrados</p>
                        <TabelaConselhos conselhos={encerrados} mensagemVazia="Nenhum conselho encerrado ainda." />
                    </div>
                </>
            )}

            <Modal
                aberto={conselhoSelecionado !== null}
                onFechar={() => setConselhoSelecionado(null)}
                titulo="Encerrar conselho"
            >
                {conselhoSelecionado && (
                    <>
                        {erroModal && (
                            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{erroModal}</p>
                        )}

                        <p className="font-serif text-xl text-ink">{conselhoSelecionado.nomeAluno}</p>
                        <p className="text-sm text-slate">
                            Matrícula {conselhoSelecionado.matricula} · Ano letivo {conselhoSelecionado.anoLetivo}
                        </p>

                        <div className="grid grid-cols-2 mt-6 border-y border-ink/10">
                            <div className="py-4 px-4 border-r border-ink/10">
                                <p className="font-serif text-3xl text-emerald-700">{conselhoSelecionado.votosAprovar}</p>
                                <p className="text-sm text-slate mt-1">Aprovar</p>
                            </div>
                            <div className="py-4 px-4">
                                <p className="font-serif text-3xl text-red-700">{conselhoSelecionado.votosReprovar}</p>
                                <p className="text-sm text-slate mt-1">Reprovar</p>
                            </div>
                        </div>

                        <p className="text-sm text-slate mt-6">
                            Resultado ao encerrar:{' '}
                            <span className={`font-medium ${RESULTADO_COR[resultadoPrevisto(conselhoSelecionado)]}`}>
                                {RESULTADO_LABEL[resultadoPrevisto(conselhoSelecionado)]}
                            </span>
                        </p>
                        <p className="text-sm text-slate mt-1 mb-6">
                            Depois de encerrado, nenhum professor poderá mais votar.
                        </p>

                        <button
                            onClick={handleEncerrar}
                            disabled={salvando}
                            className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
                        >
                            {salvando ? 'Encerrando...' : 'Confirmar encerramento'}
                        </button>
                    </>
                )}
            </Modal>
        </div>
    );
}
