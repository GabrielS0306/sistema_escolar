import { useState } from 'react';
import { useConselhos } from '../../hooks/useConselhos';
import { useToast } from '../../hooks/useToast';
import { encerrarConselho } from '../../services/conselhoService';
import { mensagemDeErro } from '../../services/api';
import { TabelaConselhos } from '../../components/TabelaConselhos';
import { Modal } from '../../components/Modal';
import { Pagina, PageHeader, BarraFerramentas, Carregando, EstadoErro, Aviso } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CampoBusca } from '../../components/ui/Campo';
import { RESULTADO_LABEL, RESULTADO_TOM, type ConselhoClasse } from '../../types/conselho';

// Mesma regra do backend (ConselhosClasseController.Encerrar): empate aprova.
function resultadoPrevisto(c: ConselhoClasse) {
    return c.votosAprovar >= c.votosReprovar ? 1 : 2;
}

export function ConselhosClasse() {
    const toast = useToast();
    const { conselhos, carregando, erro, recarregarDados } = useConselhos();

    const [busca, setBusca] = useState('');
    const [conselhoSelecionado, setConselhoSelecionado] = useState<ConselhoClasse | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [erroModal, setErroModal] = useState<string | null>(null);

    const filtrados = conselhos.filter((c) => c.nomeAluno.toLowerCase().includes(busca.toLowerCase()));
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
            const resultado = await encerrarConselho(conselhoSelecionado.id);
            toast.sucesso(`Conselho de ${conselhoSelecionado.nomeAluno} encerrado: ${RESULTADO_LABEL[resultado.resultado].toLowerCase()}.`);
            setConselhoSelecionado(null);
            recarregarDados();
        } catch (err) {
            setErroModal(mensagemDeErro(err, 'Não foi possível encerrar o conselho.'));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Pagina>
            <PageHeader
                eyebrow="Acadêmico"
                titulo="Conselho de classe"
                descricao="Abertos automaticamente para alunos com 3 ou mais reprovações no ano. Encerre depois que os professores votarem."
            />

            <div className="mb-4">
                <BarraFerramentas>
                    <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por aluno..." />
                </BarraFerramentas>
            </div>

            {carregando && <Carregando />}
            {erro && <EstadoErro mensagem={erro} />}

            {!carregando && !erro && (
                <div className="grid gap-6">
                    <Card titulo="Aguardando votação" acoes={pendentes.length > 0 && <Badge tom="alerta">{pendentes.length}</Badge>} semPadding>
                        <TabelaConselhos
                            conselhos={pendentes}
                            mensagemVazia="Nenhum conselho aguardando votação."
                            renderAcao={(c) =>
                                c.votosAprovar + c.votosReprovar === 0 ? (
                                    <span className="text-xs text-slate">Sem votos ainda</span>
                                ) : (
                                    <Button tamanho="sm" onClick={() => abrirModal(c)}>Encerrar</Button>
                                )
                            }
                        />
                    </Card>

                    <Card titulo="Encerrados" semPadding>
                        <TabelaConselhos conselhos={encerrados} mensagemVazia="Nenhum conselho encerrado ainda." />
                    </Card>
                </div>
            )}

            <Modal
                aberto={conselhoSelecionado !== null}
                onFechar={() => setConselhoSelecionado(null)}
                titulo="Encerrar conselho"
                descricao={conselhoSelecionado ? `${conselhoSelecionado.nomeAluno} · Matrícula ${conselhoSelecionado.matricula} · ${conselhoSelecionado.anoLetivo}` : undefined}
            >
                {conselhoSelecionado && (
                    <>
                        {erroModal && <div className="mb-4"><EstadoErro mensagem={erroModal} /></div>}

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg bg-success-soft p-4">
                                <p className="font-serif text-3xl font-semibold text-success">{conselhoSelecionado.votosAprovar}</p>
                                <p className="text-sm text-slate">votos para aprovar</p>
                            </div>
                            <div className="rounded-lg bg-danger-soft p-4">
                                <p className="font-serif text-3xl font-semibold text-danger">{conselhoSelecionado.votosReprovar}</p>
                                <p className="text-sm text-slate">votos para reprovar</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-line px-4 py-3 mt-4">
                            <span className="text-sm text-slate">Resultado ao encerrar</span>
                            <Badge tom={RESULTADO_TOM[resultadoPrevisto(conselhoSelecionado)]} comPonto>
                                {RESULTADO_LABEL[resultadoPrevisto(conselhoSelecionado)]}
                            </Badge>
                        </div>

                        <div className="mt-4 mb-5">
                            <Aviso tom="alerta">
                                Depois de encerrado, nenhum professor poderá mais votar. Em caso de empate, o aluno é aprovado.
                            </Aviso>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variante="secundario" onClick={() => setConselhoSelecionado(null)}>Cancelar</Button>
                            <Button onClick={handleEncerrar} carregando={salvando}>
                                {salvando ? 'Encerrando...' : 'Confirmar encerramento'}
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </Pagina>
    );
}
