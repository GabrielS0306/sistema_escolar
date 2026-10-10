import { useState } from 'react';
import { useConselhos } from '../../hooks/useConselhos';
import { votarConselho } from '../../services/conselhoService';
import { TabelaConselhos } from '../../components/TabelaConselhos';
import { Modal } from '../../components/Modal';
import type { ConselhoClasse } from '../../types/conselho';

const VOTO_LABEL = ['Aprovar', 'Reprovar'];

export function ConselhosProfessor() {
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

    async function handleVotar(voto: number) {
        if (!conselhoSelecionado) return;

        setSalvando(true);
        setErroModal(null);

        try {
            await votarConselho(conselhoSelecionado.id, voto);
            setConselhoSelecionado(null);
            recarregarDados();
        } catch {
            setErroModal('Não foi possível registrar o voto.');
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Diário de classe</p>
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
                                c.meuVoto === null ? (
                                    <button
                                        onClick={() => abrirModal(c)}
                                        className="bg-ink text-paper rounded px-4 py-2 text-sm font-medium hover:bg-ink/90"
                                    >
                                        Votar
                                    </button>
                                ) : (
                                    <span className="text-slate">Seu voto: {VOTO_LABEL[c.meuVoto]}</span>
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
                titulo="Votar no conselho"
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

                        <p className="text-sm text-slate mt-6 mb-2">Disciplinas reprovadas</p>
                        <ul className="border-t border-ink/10 mb-6">
                            {conselhoSelecionado.disciplinasReprovadas.map((d) => (
                                <li key={d} className="py-2 border-b border-ink/10 text-ink">{d}</li>
                            ))}
                        </ul>

                        <p className="text-sm text-slate mb-4">O voto não pode ser alterado depois de registrado.</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleVotar(0)}
                                disabled={salvando}
                                className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
                            >
                                Aprovar aluno
                            </button>
                            <button
                                onClick={() => handleVotar(1)}
                                disabled={salvando}
                                className="border border-red-700 text-red-700 rounded px-5 py-2.5 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                            >
                                Reprovar aluno
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}
