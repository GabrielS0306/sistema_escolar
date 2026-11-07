import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAlunosPorTurma } from '../../hooks/useAlunosPorTurma';
import { BarraFerramentas, Carregando, EstadoErro, EstadoVazio } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { CampoBusca } from '../../components/ui/Campo';
import { Avatar } from '../../components/ui/Avatar';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td } from '../../components/ui/Tabela';

export function AbaAlunos() {
    const { turmaId } = useParams<{ turmaId: string }>();
    const { alunos, carregando, erro } = useAlunosPorTurma(turmaId);
    const [busca, setBusca] = useState('');

    if (carregando) return <Carregando />;
    if (erro) return <EstadoErro mensagem={erro} />;

    const termo = busca.toLowerCase();
    const filtrados = alunos.filter((a) => `${a.nomeAluno} ${a.matricula}`.toLowerCase().includes(termo));

    return (
        <Card semPadding>
            <div className="p-4">
                <BarraFerramentas>
                    <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar aluno..." />
                    <span className="text-sm text-slate">{alunos.length} alunos matriculados</span>
                </BarraFerramentas>
            </div>

            {filtrados.length === 0 ? (
                <EstadoVazio
                    icone={busca ? 'busca' : 'alunos'}
                    titulo={busca ? 'Nenhum aluno encontrado' : 'Nenhum aluno matriculado nessa turma'}
                />
            ) : (
                <Tabela>
                    <TabelaCabecalho>
                        <Th>Aluno</Th>
                        <Th>Matrícula</Th>
                    </TabelaCabecalho>
                    <TabelaCorpo>
                        {filtrados.map((a) => (
                            <Tr key={a.alunoId}>
                                <Td>
                                    <div className="flex items-center gap-3">
                                        <Avatar nome={a.nomeAluno} />
                                        <span className="font-medium">{a.nomeAluno}</span>
                                    </div>
                                </Td>
                                <Td className="text-slate tabular-nums">{a.matricula}</Td>
                            </Tr>
                        ))}
                    </TabelaCorpo>
                </Tabela>
            )}
        </Card>
    );
}
