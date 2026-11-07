import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlunos } from '../../hooks/useAlunos';
import { Pagina, PageHeader, BarraFerramentas, Carregando, EstadoErro, EstadoVazio } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CampoBusca } from '../../components/ui/Campo';
import { Avatar } from '../../components/ui/Avatar';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td } from '../../components/ui/Tabela';

export function ListaAlunos() {
    const navigate = useNavigate();
    const { alunos, carregando, erro } = useAlunos();
    const [busca, setBusca] = useState('');

    const termo = busca.toLowerCase();
    const filtrados = alunos.filter((a) => `${a.nomeUsuario} ${a.matricula}`.toLowerCase().includes(termo));

    return (
        <Pagina>
            <PageHeader
                eyebrow="Pessoas"
                titulo="Alunos"
                descricao={carregando ? undefined : `${alunos.length} alunos cadastrados.`}
                // Relativo à área: vira /admin/usuarios/novo ou /coordenador/usuarios/novo.
                acoes={<Button icone="novoUsuario" onClick={() => navigate('../usuarios/novo', { relative: 'path' })}>Novo aluno</Button>}
            />

            <Card semPadding>
                <div className="p-4">
                    <BarraFerramentas>
                        <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou matrícula..." />
                    </BarraFerramentas>
                </div>

                {carregando && <Carregando />}
                {erro && <div className="px-4 pb-4"><EstadoErro mensagem={erro} /></div>}

                {!carregando && !erro && (
                    filtrados.length === 0 ? (
                        <EstadoVazio
                            icone={busca ? 'busca' : 'alunos'}
                            titulo={busca ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
                            descricao={busca ? 'Tente outro nome ou matrícula.' : 'Cadastre o primeiro aluno pelo botão "Novo aluno".'}
                        />
                    ) : (
                        <Tabela>
                            <TabelaCabecalho>
                                <Th>Aluno</Th>
                                <Th>Matrícula</Th>
                            </TabelaCabecalho>
                            <TabelaCorpo>
                                {filtrados.map((a) => (
                                    <Tr key={a.id}>
                                        <Td>
                                            <div className="flex items-center gap-3">
                                                <Avatar nome={a.nomeUsuario} />
                                                <span className="font-medium">{a.nomeUsuario}</span>
                                            </div>
                                        </Td>
                                        <Td className="text-slate tabular-nums">{a.matricula}</Td>
                                    </Tr>
                                ))}
                            </TabelaCorpo>
                        </Tabela>
                    )
                )}
            </Card>
        </Pagina>
    );
}
