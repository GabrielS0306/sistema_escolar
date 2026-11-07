import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuarios } from '../../hooks/useUsuarios';
import { EditarUsuarioModal } from '../../components/EditarUsuarioModal';
import { DocumentosUsuarioModal } from '../../components/DocumentosUsuarioModal';
import { Pagina, PageHeader, BarraFerramentas, Carregando, EstadoErro, EstadoVazio } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CampoBusca } from '../../components/ui/Campo';
import { Avatar } from '../../components/ui/Avatar';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td, CelulaDupla } from '../../components/ui/Tabela';

export function ListaUsuarios() {
    const navigate = useNavigate();
    const { usuarios, carregando, erro } = useUsuarios();
    const [busca, setBusca] = useState('');
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<string | null>(null);
    const [usuarioDocumentos, setUsuarioDocumentos] = useState<{ id: string; nome: string } | null>(null);

    const termo = busca.toLowerCase();
    const filtrados = usuarios.filter((u) => `${u.nome} ${u.email}`.toLowerCase().includes(termo));

    return (
        <Pagina>
            <PageHeader
                eyebrow="Pessoas"
                titulo="Usuários"
                descricao={carregando ? undefined : `${usuarios.length} usuários cadastrados. Edite dados, redefina senhas e guarde documentos.`}
                acoes={<Button icone="novoUsuario" onClick={() => navigate('novo')}>Novo usuário</Button>}
            />

            <Card semPadding>
                <div className="p-4">
                    <BarraFerramentas>
                        <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou e-mail..." />
                    </BarraFerramentas>
                </div>

                {carregando && <Carregando />}
                {erro && <div className="px-4 pb-4"><EstadoErro mensagem={erro} /></div>}

                {!carregando && !erro && (
                    filtrados.length === 0 ? (
                        <EstadoVazio icone="busca" titulo="Nenhum usuário encontrado" descricao={busca ? 'Tente outro nome ou e-mail.' : undefined} />
                    ) : (
                        <Tabela>
                            <TabelaCabecalho>
                                <Th>Usuário</Th>
                                <Th className="text-right">Ações</Th>
                            </TabelaCabecalho>
                            <TabelaCorpo>
                                {filtrados.map((u) => (
                                    <Tr key={u.id}>
                                        <Td>
                                            <div className="flex items-center gap-3">
                                                <Avatar nome={u.nome} />
                                                <CelulaDupla principal={u.nome} secundario={u.email} />
                                            </div>
                                        </Td>
                                        <Td className="text-right whitespace-nowrap">
                                            <Button tamanho="sm" variante="fantasma" icone="usuario" onClick={() => setUsuarioSelecionado(u.id)}>
                                                Editar
                                            </Button>
                                            <Button tamanho="sm" variante="fantasma" icone="documentos" onClick={() => setUsuarioDocumentos({ id: u.id, nome: u.nome })}>
                                                Documentos
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </TabelaCorpo>
                        </Tabela>
                    )
                )}
            </Card>

            <EditarUsuarioModal usuarioId={usuarioSelecionado} onFechar={() => setUsuarioSelecionado(null)} />
            <DocumentosUsuarioModal usuario={usuarioDocumentos} onFechar={() => setUsuarioDocumentos(null)} />
        </Pagina>
    );
}
