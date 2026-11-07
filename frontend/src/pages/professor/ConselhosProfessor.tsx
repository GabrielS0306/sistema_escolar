import { useState } from 'react';
import { useConselhos } from '../../hooks/useConselhos';
import { useToast } from '../../hooks/useToast';
import { votarConselho } from '../../services/conselhoService';
import { mensagemDeErro } from '../../services/api';
import { TabelaConselhos } from '../../components/TabelaConselhos';
import { Modal } from '../../components/Modal';
import { Pagina, PageHeader, BarraFerramentas, Carregando, EstadoErro, Aviso } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CampoBusca } from '../../components/ui/Campo';
import type { ConselhoClasse } from '../../types/conselho';

const VOTO_LABEL = ['Aprovar', 'Reprovar'];

export function ConselhosProfessor() {
    const toast = useToast();
    const { conselhos, carregando, erro, recarregarDados } = useConselhos();

    const [busca, setBusca] = useState('');
    const [conselhoSelecionado, setConselhoSelecionado] = useState<ConselhoClasse | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [erroModal, setErroModal] = useState<string | null>(null);

    const filtrados = conselhos.filter((c) => c.nomeAluno.toLowerCase().includes(busca.toLowerCase()));
    const pendentes = filtrados.filter((c) => c.resultado === 0);
    const encerrados = filtrados.filter((c) => c.resultado !== 0);
    const aguardandoMeuVoto = pendentes.filter((c) => c.meuVoto === null).length;

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
            toast.sucesso(`Voto registrado: ${VOTO_LABEL[voto].toLowerCase()} ${conselhoSelecionado.nomeAluno}.`);
            setConselhoSelecionado(null);
            recarregarDados();
        } catch (err) {
            setErroModal(mensagemDeErro(err, 'Não foi possível registrar o voto.'));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Pagina>
            <PageHeader
                eyebrow="Diário de classe"
                titulo="Conselho de classe"
                descricao="Vote nos alunos que fecharam o ano com 3 ou mais reprovações. Cada professor vota uma vez."
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
                    <Card
                        titulo="Aguardando votação"
                        acoes={aguardandoMeuVoto > 0 && <Badge tom="alerta">{aguardandoMeuVoto} sem o seu voto</Badge>}
                        semPadding
                    >
                        <TabelaConselhos
                            conselhos={pendentes}
                            mensagemVazia="Nenhum conselho aguardando votação."
                            renderAcao={(c) =>
                                c.meuVoto === null ? (
                                    <Button tamanho="sm" onClick={() => abrirModal(c)}>Votar</Button>
                                ) : (
                                    <Badge tom={c.meuVoto === 0 ? 'sucesso' : 'perigo'}>Seu voto: {VOTO_LABEL[c.meuVoto]}</Badge>
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
                titulo="Votar no conselho"
                descricao={conselhoSelecionado ? `${conselhoSelecionado.nomeAluno} · Matrícula ${conselhoSelecionado.matricula} · ${conselhoSelecionado.anoLetivo}` : undefined}
            >
                {conselhoSelecionado && (
                    <>
                        {erroModal && <div className="mb-4"><EstadoErro mensagem={erroModal} /></div>}

                        <p className="text-sm font-medium text-ink mb-2">Disciplinas reprovadas</p>
                        <div className="flex flex-wrap gap-2 mb-5">
                            {conselhoSelecionado.disciplinasReprovadas.map((d) => <Badge key={d} tom="perigo">{d}</Badge>)}
                        </div>

                        <div className="mb-5">
                            <Aviso tom="alerta">O voto não pode ser alterado depois de registrado.</Aviso>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variante="perigo" onClick={() => handleVotar(1)} disabled={salvando} className="h-12">
                                Reprovar aluno
                            </Button>
                            <Button onClick={() => handleVotar(0)} carregando={salvando} className="h-12" icone="check">
                                Aprovar aluno
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </Pagina>
    );
}
