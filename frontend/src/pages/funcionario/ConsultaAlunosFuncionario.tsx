import { useState } from 'react';
import { useAlunos } from '../../hooks/useAlunos';
import { useToast } from '../../hooks/useToast';
import { NovaOcorrenciaModal } from '../../components/NovaOcorrenciaModal';
import { Pagina, PageHeader, BarraFerramentas, Carregando, EstadoErro, EstadoVazio } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CampoBusca } from '../../components/ui/Campo';
import { Avatar } from '../../components/ui/Avatar';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td } from '../../components/ui/Tabela';

export function ConsultaAlunosFuncionario() {
    const toast = useToast();
    const { alunos, carregando, erro } = useAlunos();

    const [busca, setBusca] = useState('');
    const [alunoOcorrencia, setAlunoOcorrencia] = useState<string | null>(null);

    const termo = busca.toLowerCase();
    const filtrados = alunos.filter((a) =>
        a.nomeUsuario.toLowerCase().includes(termo) || a.matricula.toLowerCase().includes(termo)
    );

    return (
        <Pagina>
            <PageHeader eyebrow="Secretaria" titulo="Alunos" descricao={carregando ? undefined : `${alunos.length} alunos cadastrados.`} />

            <Card semPadding>
                <div className="p-4">
                    <BarraFerramentas>
                        <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou matrícula..." autoFocus />
                    </BarraFerramentas>
                </div>

                {carregando && <Carregando />}
                {erro && <div className="px-4 pb-4"><EstadoErro mensagem={erro} /></div>}

                {!carregando && !erro && (
                    filtrados.length === 0 ? (
                        <EstadoVazio icone="busca" titulo="Nenhum aluno encontrado" descricao={busca ? 'Tente outro nome ou matrícula.' : undefined} />
                    ) : (
                        <Tabela>
                            <TabelaCabecalho>
                                <Th>Aluno</Th>
                                <Th>Matrícula</Th>
                                <Th className="text-right">Ação</Th>
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
                                        <Td className="text-right">
                                            <Button tamanho="sm" variante="secundario" icone="ocorrencias" onClick={() => setAlunoOcorrencia(a.id)}>
                                                Registrar ocorrência
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </TabelaCorpo>
                        </Tabela>
                    )
                )}
            </Card>

            <NovaOcorrenciaModal
                aberto={alunoOcorrencia !== null}
                onFechar={() => setAlunoOcorrencia(null)}
                onRegistrada={() => { setAlunoOcorrencia(null); toast.sucesso('Ocorrência registrada.'); }}
                alunos={alunos}
                alunoInicialId={alunoOcorrencia ?? undefined}
            />
        </Pagina>
    );
}
