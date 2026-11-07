import { useState } from 'react';
import { useAlunos } from '../../hooks/useAlunos';
import { useNotas } from '../../hooks/useNotas';
import { Pagina, PageHeader, Carregando, EstadoErro, EstadoVazio, StatCard } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { CampoSelecaoBusca } from '../../components/ui/CampoSelecaoBusca';
import { Badge } from '../../components/ui/Badge';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td } from '../../components/ui/Tabela';

const MEDIA_MINIMA = 6;

export function ConsultaNotas() {
    const { alunos, carregando: carregandoAlunos } = useAlunos();
    const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null);
    const { notas, carregando, erro } = useNotas(alunoSelecionado);

    const notasOrdenadas = [...notas].sort((a, b) => a.bimestre - b.bimestre || a.disciplina.localeCompare(b.disciplina));
    const media = notas.length > 0 ? notas.reduce((soma, n) => soma + n.valor, 0) / notas.length : null;
    const abaixoDaMedia = notas.filter((n) => n.valor < MEDIA_MINIMA).length;

    return (
        <Pagina>
            <PageHeader eyebrow="Acadêmico" titulo="Notas" descricao="Consulte as notas lançadas para um aluno." />

            <Card className="mb-6">
                <div className="sm:max-w-md -mb-4">
                    <CampoSelecaoBusca
                        label="Aluno"
                        opcoes={alunos.map((a) => ({ id: a.id, titulo: a.nomeUsuario, subtitulo: `Matrícula ${a.matricula}` }))}
                        valor={alunoSelecionado ?? ''}
                        onChange={(id) => setAlunoSelecionado(id || null)}
                        placeholder={carregandoAlunos ? 'Carregando alunos...' : 'Digite o nome ou a matrícula...'}
                        desabilitado={carregandoAlunos}
                    />
                </div>
            </Card>

            {!alunoSelecionado && (
                <Card><EstadoVazio icone="notas" titulo="Escolha um aluno" descricao="As notas dele aparecem aqui, organizadas por bimestre." /></Card>
            )}

            {alunoSelecionado && carregando && <Carregando />}
            {alunoSelecionado && erro && <EstadoErro mensagem={erro} />}

            {alunoSelecionado && !carregando && !erro && (
                <>
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 mb-6">
                        <StatCard valor={notas.length} rotulo="Notas lançadas" icone="notas" />
                        <StatCard
                            valor={media !== null ? media.toFixed(1) : '—'}
                            rotulo="Média geral"
                            icone="livro"
                            tom={media === null ? 'neutro' : media >= MEDIA_MINIMA ? 'sucesso' : 'alerta'}
                        />
                        <StatCard valor={abaixoDaMedia} rotulo={`Abaixo de ${MEDIA_MINIMA}`} icone="alerta" tom={abaixoDaMedia > 0 ? 'perigo' : 'neutro'} />
                    </div>

                    <Card semPadding>
                        {notas.length === 0 ? (
                            <EstadoVazio icone="notas" titulo="Nenhuma nota lançada ainda" />
                        ) : (
                            <Tabela>
                                <TabelaCabecalho>
                                    <Th>Bimestre</Th>
                                    <Th>Disciplina</Th>
                                    <Th>Avaliação</Th>
                                    <Th className="text-right">Nota</Th>
                                </TabelaCabecalho>
                                <TabelaCorpo>
                                    {notasOrdenadas.map((n) => (
                                        <Tr key={n.id}>
                                            <Td><Badge>{n.bimestre}º bimestre</Badge></Td>
                                            <Td className="font-medium">{n.disciplina}</Td>
                                            <Td className="text-slate">{n.nomeAvaliacao}</Td>
                                            <Td className={`text-right font-semibold tabular-nums ${n.valor < MEDIA_MINIMA ? 'text-danger' : 'text-ink'}`}>
                                                {n.valor.toFixed(1)}
                                            </Td>
                                        </Tr>
                                    ))}
                                </TabelaCorpo>
                            </Tabela>
                        )}
                    </Card>
                </>
            )}
        </Pagina>
    );
}
