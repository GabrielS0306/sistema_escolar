import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea, CampoBusca } from '../../components/ui/Campo';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Icone } from '../../components/ui/Icone';
import { SeletorTema } from '../../components/ui/SeletorTema';
import { Pagina, PageHeader, BarraFerramentas, StatCard, Carregando, EstadoVazio, EstadoErro, Aviso } from '../../components/ui/Estrutura';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td, CelulaDupla } from '../../components/ui/Tabela';
import { Modal } from '../../components/Modal';
import { useToast } from '../../hooks/useToast';
import { apiGet, mensagemDeErro } from '../../services/api';

// Vitrine do kit visual (só existe em desenvolvimento, rota /ui).
export function GaleriaUi() {
    const toast = useToast();
    const [modalAberto, setModalAberto] = useState(false);
    const [carregandoBotao, setCarregandoBotao] = useState(false);

    async function testarErroReal() {
        try {
            // Endpoint protegido chamado sem permissão: mostra a mensagem amigável do api.ts.
            await apiGet('/Usuarios');
            toast.info('A chamada funcionou (você está logado como Admin).');
        } catch (err) {
            toast.erro(mensagemDeErro(err));
        }
    }

    function simularCarregamento() {
        setCarregandoBotao(true);
        window.setTimeout(() => setCarregandoBotao(false), 1500);
    }

    return (
        <div className="min-h-screen bg-paper">
            <Pagina>
                <PageHeader
                    eyebrow="Kit visual"
                    titulo="Galeria de componentes"
                    descricao="Todos os blocos usados nas telas. Troque o tema para conferir o modo escuro."
                    acoes={<SeletorTema />}
                />

                <div className="grid gap-6">
                    <Card titulo="Botões" descricao="Primário para a ação principal da tela; secundário e fantasma para o resto.">
                        <div className="flex flex-wrap gap-3">
                            <Button icone="mais">Primário</Button>
                            <Button variante="secundario">Secundário</Button>
                            <Button variante="fantasma">Fantasma</Button>
                            <Button variante="perigo">Perigo</Button>
                            <Button carregando={carregandoBotao} onClick={simularCarregamento}>Carregando</Button>
                            <Button disabled>Desabilitado</Button>
                            <Button tamanho="sm" variante="secundario" icone="abrir">Pequeno</Button>
                        </div>
                    </Card>

                    <Card titulo="Avisos (toast)" descricao="Aparecem no canto e somem sozinhos.">
                        <div className="flex flex-wrap gap-3">
                            <Button variante="secundario" onClick={() => toast.sucesso('Comunicado enviado.')}>Sucesso</Button>
                            <Button variante="secundario" onClick={() => toast.erro('Você já votou nesse conselho.')}>Erro</Button>
                            <Button variante="secundario" onClick={() => toast.info('Novos comunicados disponíveis.')}>Info</Button>
                            <Button variante="secundario" icone="alerta" onClick={testarErroReal}>Erro real da API</Button>
                        </div>
                    </Card>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard valor={142} rotulo="Alunos" icone="alunos" />
                        <StatCard valor={8} rotulo="Em recuperação" icone="recuperacao" tom="alerta" detalhe="3 disciplinas" />
                        <StatCard valor={2} rotulo="Conselhos em votação" icone="conselho" tom="destaque" />
                        <StatCard valor="94%" rotulo="Frequência" icone="frequencia" tom="sucesso" />
                    </div>

                    <Card titulo="Formulário">
                        <div className="grid gap-x-4 sm:grid-cols-2">
                            <Input label="Título" placeholder="Ex.: Reunião de pais" />
                            <Select label="Público">
                                <option>Escola toda</option>
                                <option>Turma</option>
                            </Select>
                            <Input label="Nota" placeholder="7,5" dica="De 0 a 10. Aceita vírgula." />
                            <Input label="E-mail" defaultValue="email-invalido" erro="Digite um e-mail válido." />
                        </div>
                        <Textarea label="Mensagem" rows={3} placeholder="Escreva o comunicado..." />
                        <div className="flex gap-3">
                            <Button>Salvar</Button>
                            <Button variante="secundario" onClick={() => setModalAberto(true)}>Abrir modal</Button>
                        </div>
                    </Card>

                    <Card titulo="Tabela com status" semPadding>
                        <div className="px-5 pb-4">
                            <BarraFerramentas>
                                <CampoBusca placeholder="Buscar aluno..." />
                                <Button tamanho="sm" icone="mais">Novo</Button>
                            </BarraFerramentas>
                        </div>
                        <Tabela>
                            <TabelaCabecalho>
                                <Th>Aluno</Th>
                                <Th>Disciplina</Th>
                                <Th>Média</Th>
                                <Th>Situação</Th>
                                <Th className="text-right">Ação</Th>
                            </TabelaCabecalho>
                            <TabelaCorpo>
                                <Tr>
                                    <Td><CelulaDupla principal="Ana Souza" secundario="Matrícula 2026001" /></Td>
                                    <Td>Matemática</Td>
                                    <Td>8,2</Td>
                                    <Td><Badge tom="sucesso" comPonto>Aprovado</Badge></Td>
                                    <Td className="text-right"><Button tamanho="sm" variante="fantasma">Ver</Button></Td>
                                </Tr>
                                <Tr>
                                    <Td><CelulaDupla principal="Bruno Lima" secundario="Matrícula 2026002" /></Td>
                                    <Td>História</Td>
                                    <Td>4,5</Td>
                                    <Td><Badge tom="alerta" comPonto>Em recuperação</Badge></Td>
                                    <Td className="text-right"><Button tamanho="sm">Lançar prova</Button></Td>
                                </Tr>
                                <Tr>
                                    <Td><CelulaDupla principal="Carla Dias" secundario="Matrícula 2026003" /></Td>
                                    <Td>Ciências</Td>
                                    <Td>3,1</Td>
                                    <Td><Badge tom="perigo" comPonto>Reprovado</Badge></Td>
                                    <Td className="text-right"><Button tamanho="sm" variante="fantasma">Ver</Button></Td>
                                </Tr>
                            </TabelaCorpo>
                        </Tabela>
                    </Card>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card titulo="Estado vazio">
                            <EstadoVazio
                                icone="comunicados"
                                titulo="Nenhum comunicado ainda"
                                descricao="Quando a escola enviar um comunicado para você, ele aparece aqui."
                                acao={<Button tamanho="sm" icone="mais">Novo comunicado</Button>}
                            />
                        </Card>

                        <Card titulo="Carregando, erro e avisos">
                            <Carregando />
                            <div className="grid gap-3">
                                <EstadoErro mensagem="Não foi possível conectar ao servidor." onTentarNovamente={() => toast.info('Tentando de novo...')} />
                                <Aviso tom="alerta">Depois de lançada, a prova final não pode ser alterada.</Aviso>
                                <Aviso tom="sucesso">Senha redefinida. Informe a nova senha ao usuário.</Aviso>
                            </div>
                        </Card>
                    </div>

                    <Card titulo="Badges e ícones">
                        <div className="flex flex-wrap gap-2 mb-5">
                            <Badge>Neutro</Badge>
                            <Badge tom="sucesso">Aprovado</Badge>
                            <Badge tom="alerta">Pendente</Badge>
                            <Badge tom="perigo">Reprovado</Badge>
                            <Badge tom="info">Turma 9º A</Badge>
                            <Badge tom="destaque">Escola toda</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-slate">
                            {(['painel', 'alunos', 'professores', 'turmas', 'frequencia', 'notas', 'recuperacao', 'conselho', 'comunicados', 'ocorrencias', 'documentos', 'usuarios', 'trocar', 'sair'] as const).map((nome) => (
                                <span key={nome} title={nome} className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center">
                                    <Icone nome={nome} />
                                </span>
                            ))}
                        </div>
                    </Card>
                </div>
            </Pagina>

            <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Lançar prova final" descricao="Bruno Lima · História · 9º A">
                <Input label="Nota da prova final" placeholder="Ex.: 7,5" autoFocus />
                <div className="mb-5">
                    <Aviso tom="alerta">Depois de lançada, a prova final não pode ser alterada.</Aviso>
                </div>
                <div className="flex justify-end gap-3">
                    <Button variante="secundario" onClick={() => setModalAberto(false)}>Cancelar</Button>
                    <Button onClick={() => { setModalAberto(false); toast.sucesso('Prova final lançada.'); }}>Confirmar</Button>
                </div>
            </Modal>
        </div>
    );
}
