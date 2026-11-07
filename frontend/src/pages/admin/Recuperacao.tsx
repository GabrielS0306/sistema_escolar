import { useState } from 'react';
import { useRecuperacao } from '../../hooks/useRecuperacao';
import { useToast } from '../../hooks/useToast';
import { registrarProvaFinal } from '../../services/recuperacaoService';
import { mensagemDeErro } from '../../services/api';
import { Modal } from '../../components/Modal';
import { Pagina, PageHeader, BarraFerramentas, Carregando, EstadoErro, EstadoVazio, Aviso } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CampoBusca, Input } from '../../components/ui/Campo';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td, CelulaDupla } from '../../components/ui/Tabela';
import { MEDIA_APROVACAO, mediaComProvaFinal, type SituacaoRecuperacao } from '../../types/recuperacao';
import { lerNota } from '../../utils/notas';

export function Recuperacao() {
    const toast = useToast();
    const { situacoes, carregando, erro, recarregarDados } = useRecuperacao();

    const [busca, setBusca] = useState('');
    const [selecionada, setSelecionada] = useState<SituacaoRecuperacao | null>(null);
    const [notaTexto, setNotaTexto] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [erroModal, setErroModal] = useState<string | null>(null);

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

            if (vaiAprovar) {
                toast.sucesso(`${selecionada.nomeAluno} foi aprovado(a) em ${selecionada.disciplina}.`);
            } else {
                toast.info(`${selecionada.nomeAluno} foi reprovado(a) em ${selecionada.disciplina}. Com 3 reprovações no ano, o conselho de classe abre sozinho.`);
            }

            setSelecionada(null);
            recarregarDados();
        } catch (err) {
            setErroModal(mensagemDeErro(err, 'Não foi possível lançar a prova final.'));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Pagina>
            <PageHeader
                eyebrow="Acadêmico"
                titulo="Recuperação"
                descricao={`Disciplinas com média final abaixo de ${MEDIA_APROVACAO} aguardando prova final.`}
            />

            <Card semPadding>
                <div className="p-4">
                    <BarraFerramentas>
                        <CampoBusca
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar por aluno, matrícula ou disciplina..."
                            className="w-full sm:w-96"
                        />
                    </BarraFerramentas>
                </div>

                {carregando && <Carregando />}
                {erro && <div className="px-4 pb-4"><EstadoErro mensagem={erro} /></div>}

                {!carregando && !erro && (
                    filtradas.length === 0 ? (
                        <EstadoVazio
                            icone={busca ? 'busca' : 'sucesso'}
                            titulo={busca ? 'Nada encontrado' : 'Nenhum aluno em recuperação'}
                            descricao={busca ? undefined : 'Quando um aluno fechar o ano com média abaixo do mínimo, ele aparece aqui.'}
                        />
                    ) : (
                        <Tabela>
                            <TabelaCabecalho>
                                <Th>Aluno</Th>
                                <Th>Disciplina</Th>
                                <Th>Turma</Th>
                                <Th>Média final</Th>
                                <Th className="text-right">Ação</Th>
                            </TabelaCabecalho>
                            <TabelaCorpo>
                                {filtradas.map((s) => (
                                    <Tr key={s.id}>
                                        <Td><CelulaDupla principal={s.nomeAluno} secundario={`Matrícula ${s.matricula}`} /></Td>
                                        <Td>{s.disciplina}</Td>
                                        <Td className="text-slate whitespace-nowrap">{s.turma} · {s.anoLetivo}</Td>
                                        <Td><Badge tom="alerta">{s.mediaFinal?.toFixed(1) ?? '—'}</Badge></Td>
                                        <Td className="text-right">
                                            <Button tamanho="sm" onClick={() => abrirModal(s)}>Lançar prova final</Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </TabelaCorpo>
                        </Tabela>
                    )
                )}
            </Card>

            <Modal
                aberto={selecionada !== null}
                onFechar={() => setSelecionada(null)}
                titulo="Lançar prova final"
                descricao={selecionada ? `${selecionada.nomeAluno} · ${selecionada.disciplina} · ${selecionada.turma}` : undefined}
            >
                {selecionada && (
                    <>
                        {erroModal && <div className="mb-4"><EstadoErro mensagem={erroModal} /></div>}

                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="rounded-lg bg-warning-soft p-4">
                                <p className="font-serif text-3xl font-semibold text-warning">{selecionada.mediaFinal?.toFixed(1) ?? '—'}</p>
                                <p className="text-sm text-slate">Média final</p>
                            </div>
                            <div className={`rounded-lg p-4 transition-colors ${
                                mediaResultante === null ? 'bg-surface-muted' : vaiAprovar ? 'bg-success-soft' : 'bg-danger-soft'
                            }`}>
                                <p className={`font-serif text-3xl font-semibold ${
                                    mediaResultante === null ? 'text-slate' : vaiAprovar ? 'text-success' : 'text-danger'
                                }`}>
                                    {mediaResultante?.toFixed(1) ?? '—'}
                                </p>
                                <p className="text-sm text-slate">Com a prova final</p>
                            </div>
                        </div>

                        <Input
                            label="Nota da prova final"
                            value={notaTexto}
                            onChange={(e) => setNotaTexto(e.target.value)}
                            inputMode="decimal"
                            placeholder="Ex.: 7,5"
                            autoFocus
                            className="sm:max-w-48"
                            erro={notaTexto !== '' && nota === null ? 'Digite uma nota de 0 a 10.' : undefined}
                            dica="De 0 a 10. Aceita vírgula."
                        />

                        {mediaResultante !== null && (
                            <div className="flex items-center justify-between rounded-lg border border-line px-4 py-3 mb-4">
                                <span className="text-sm text-slate">Resultado</span>
                                <Badge tom={vaiAprovar ? 'sucesso' : 'perigo'} comPonto>{vaiAprovar ? 'Aprovado' : 'Reprovado'}</Badge>
                            </div>
                        )}

                        <div className="mb-5">
                            <Aviso tom="alerta">Depois de lançada, a prova final não pode ser alterada.</Aviso>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variante="secundario" onClick={() => setSelecionada(null)}>Cancelar</Button>
                            <Button onClick={handleLancar} carregando={salvando} disabled={nota === null}>
                                {salvando ? 'Lançando...' : 'Confirmar lançamento'}
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </Pagina>
    );
}
