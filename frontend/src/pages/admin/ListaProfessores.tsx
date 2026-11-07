import { useState } from 'react';
import { useProfessores } from '../../hooks/useProfessores';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Pagina, PageHeader, BarraFerramentas, Carregando, EstadoErro, EstadoVazio } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CampoBusca } from '../../components/ui/Campo';
import { Avatar } from '../../components/ui/Avatar';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td } from '../../components/ui/Tabela';

export function ListaProfessores() {
    const navigate = useNavigate();
    const { sessao } = useAuth();
    const { professores, carregando, erro } = useProfessores();
    const [busca, setBusca] = useState('');

    // Só o Admin cadastra professores (o backend também bloqueia o Coordenador).
    const podeCadastrar = sessao?.papelAtivo === 'Admin';
    const filtrados = professores.filter((p) => p.nomeUsuario.toLowerCase().includes(busca.toLowerCase()));

    return (
        <Pagina>
            <PageHeader
                eyebrow="Pessoas"
                titulo="Professores"
                descricao={carregando ? undefined : `${professores.length} professores no corpo docente.`}
                acoes={podeCadastrar && (
                    <Button icone="novoUsuario" onClick={() => navigate('../usuarios/novo', { relative: 'path' })}>Novo professor</Button>
                )}
            />

            <Card semPadding>
                <div className="p-4">
                    <BarraFerramentas>
                        <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar professor..." />
                    </BarraFerramentas>
                </div>

                {carregando && <Carregando />}
                {erro && <div className="px-4 pb-4"><EstadoErro mensagem={erro} /></div>}

                {!carregando && !erro && (
                    filtrados.length === 0 ? (
                        <EstadoVazio
                            icone={busca ? 'busca' : 'professores'}
                            titulo={busca ? 'Nenhum professor encontrado' : 'Nenhum professor cadastrado'}
                        />
                    ) : (
                        <Tabela>
                            <TabelaCabecalho>
                                <Th>Professor</Th>
                            </TabelaCabecalho>
                            <TabelaCorpo>
                                {filtrados.map((p) => (
                                    <Tr key={p.id}>
                                        <Td>
                                            <div className="flex items-center gap-3">
                                                <Avatar nome={p.nomeUsuario} />
                                                <span className="font-medium">{p.nomeUsuario}</span>
                                            </div>
                                        </Td>
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
