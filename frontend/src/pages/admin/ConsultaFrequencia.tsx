import { useState } from 'react';
import { useAlunos } from '../../hooks/useAlunos';
import { useFrequencia } from '../../hooks/useFrequencia';
import { Pagina, PageHeader, Carregando, EstadoErro, EstadoVazio, StatCard } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { CampoSelecaoBusca } from '../../components/ui/CampoSelecaoBusca';
import { Badge } from '../../components/ui/Badge';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td } from '../../components/ui/Tabela';
import { dataCurta } from '../../utils/datas';

// Abaixo disso o aluno corre risco de reprovação por falta (referência da LDB: 75%).
const FREQUENCIA_MINIMA = 75;

export function ConsultaFrequencia() {
    const { alunos, carregando: carregandoAlunos } = useAlunos();
    const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null);
    const { frequencias, carregando, erro } = useFrequencia(alunoSelecionado);

    const presencas = frequencias.filter((f) => f.presente).length;
    const faltas = frequencias.length - presencas;
    const percentual = frequencias.length > 0 ? Math.round((presencas / frequencias.length) * 100) : null;
    const recentes = [...frequencias].sort((a, b) => b.data.localeCompare(a.data));

    return (
        <Pagina>
            <PageHeader eyebrow="Acadêmico" titulo="Frequência" descricao="Consulte a presença registrada para um aluno." />

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
                <Card><EstadoVazio icone="frequencia" titulo="Escolha um aluno" descricao="O histórico de presenças e faltas aparece aqui." /></Card>
            )}

            {alunoSelecionado && carregando && <Carregando />}
            {alunoSelecionado && erro && <EstadoErro mensagem={erro} />}

            {alunoSelecionado && !carregando && !erro && (
                <>
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 mb-6">
                        <StatCard
                            valor={percentual !== null ? `${percentual}%` : '—'}
                            rotulo="Frequência"
                            icone="frequencia"
                            tom={percentual === null ? 'neutro' : percentual >= FREQUENCIA_MINIMA ? 'sucesso' : 'perigo'}
                            detalhe={percentual !== null && percentual < FREQUENCIA_MINIMA ? `Abaixo do mínimo de ${FREQUENCIA_MINIMA}%` : undefined}
                        />
                        <StatCard valor={presencas} rotulo="Presenças" icone="check" />
                        <StatCard valor={faltas} rotulo="Faltas" icone="fechar" tom={faltas > 0 ? 'alerta' : 'neutro'} />
                    </div>

                    <Card semPadding>
                        {frequencias.length === 0 ? (
                            <EstadoVazio icone="frequencia" titulo="Nenhuma chamada registrada ainda" />
                        ) : (
                            <Tabela>
                                <TabelaCabecalho>
                                    <Th>Data</Th>
                                    <Th>Presença</Th>
                                </TabelaCabecalho>
                                <TabelaCorpo>
                                    {recentes.map((f) => (
                                        <Tr key={f.id}>
                                            <Td className="tabular-nums">{dataCurta(f.data)}</Td>
                                            <Td>
                                                {f.presente
                                                    ? <Badge tom="sucesso" comPonto>Presente</Badge>
                                                    : <Badge tom="perigo" comPonto>Falta</Badge>}
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
