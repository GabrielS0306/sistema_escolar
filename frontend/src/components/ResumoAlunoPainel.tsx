import { useState } from 'react';
import type { ResumoAluno } from '../types/resumoAluno';
import { TIPO_OCORRENCIA_LABEL } from '../types/ocorrencia';
import { NOTA_MINIMA } from '../utils/notas';
import { dataCurta } from '../utils/datas';
import { Card } from './ui/Card';
import { Badge, type TomBadge } from './ui/Badge';
import { StatCard, EstadoVazio } from './ui/Estrutura';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td } from './ui/Tabela';

const STATUS_LABEL = ['Em andamento', 'Aprovado', 'Em recuperação', 'Reprovado'];
const STATUS_TOM: TomBadge[] = ['neutro', 'sucesso', 'alerta', 'perigo'];
// Disciplinar, Saúde, Atraso, Elogio, Outro
const TOM_OCORRENCIA: TomBadge[] = ['perigo', 'info', 'alerta', 'sucesso', 'neutro'];
const FREQUENCIA_MINIMA = 75;

interface ResumoAlunoPainelProps {
    resumo: ResumoAluno;
}

// Frequência, situação, notas e ocorrências de um aluno — usado pelo portal do aluno e do responsável.
export function ResumoAlunoPainel({ resumo }: ResumoAlunoPainelProps) {
    const [bimestre, setBimestre] = useState(0);  // 0 = todos

    const totalPresencas = resumo.frequencias.filter((f) => f.presente).length;
    const percentualFrequencia = resumo.frequencias.length > 0
        ? Math.round((totalPresencas / resumo.frequencias.length) * 100)
        : null;

    const media = resumo.notas.length > 0
        ? resumo.notas.reduce((soma, n) => soma + n.valor, 0) / resumo.notas.length
        : null;

    const emAtencao = resumo.situacoesDisciplina.filter((s) => s.status === 2 || s.status === 3).length;

    const notas = resumo.notas
        .filter((n) => bimestre === 0 || n.bimestre === bimestre)
        .sort((a, b) => a.bimestre - b.bimestre || a.disciplina.localeCompare(b.disciplina));

    return (
        <div className="grid gap-6">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StatCard
                    valor={percentualFrequencia !== null ? `${percentualFrequencia}%` : '—'}
                    rotulo="Frequência"
                    icone="frequencia"
                    tom={percentualFrequencia === null ? 'neutro' : percentualFrequencia >= FREQUENCIA_MINIMA ? 'sucesso' : 'perigo'}
                    detalhe={resumo.frequencias.length > 0 ? `${resumo.frequencias.length - totalPresencas} faltas registradas` : 'Sem chamadas ainda'}
                />
                <StatCard
                    valor={media !== null ? media.toFixed(1) : '—'}
                    rotulo="Média das notas"
                    icone="notas"
                    tom={media === null ? 'neutro' : media >= NOTA_MINIMA ? 'sucesso' : 'alerta'}
                />
                <StatCard
                    valor={emAtencao}
                    rotulo="Disciplinas em atenção"
                    icone="alerta"
                    tom={emAtencao > 0 ? 'alerta' : 'neutro'}
                    detalhe="Em recuperação ou reprovadas"
                />
                <StatCard valor={resumo.ocorrencias.length} rotulo="Ocorrências" icone="ocorrencias" />
            </div>

            <Card titulo="Situação por disciplina" descricao="A média final sai quando os 4 bimestres estão completos.">
                {resumo.situacoesDisciplina.length === 0 ? (
                    <EstadoVazio icone="livro" titulo="Nenhuma disciplina fechada ainda" />
                ) : (
                    <ul className="divide-y divide-line">
                        {resumo.situacoesDisciplina.map((s) => (
                            <li key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                                <div className="flex-1 min-w-40">
                                    <p className="font-medium text-ink">{s.disciplina}</p>
                                    <p className="text-xs text-slate">Turma {s.turma}</p>
                                </div>

                                {/* Barra da média (0 a 10), com a marca do mínimo */}
                                <div className="flex items-center gap-3 w-full sm:w-56">
                                    <div className="relative flex-1 h-2 rounded-full bg-surface-muted overflow-hidden" aria-hidden="true">
                                        {s.mediaFinal !== null && (
                                            <span
                                                className={`absolute inset-y-0 left-0 rounded-full ${s.mediaFinal >= NOTA_MINIMA ? 'bg-success' : 'bg-warning'}`}
                                                style={{ width: `${Math.min(s.mediaFinal, 10) * 10}%` }}
                                            />
                                        )}
                                        <span className="absolute inset-y-0 w-px bg-ink/30" style={{ left: `${NOTA_MINIMA * 10}%` }} />
                                    </div>
                                    <span className="w-8 text-right text-sm font-semibold tabular-nums">{s.mediaFinal?.toFixed(1) ?? '—'}</span>
                                </div>

                                <Badge tom={STATUS_TOM[s.status]} comPonto>{STATUS_LABEL[s.status]}</Badge>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            <Card
                titulo="Notas"
                semPadding
                acoes={
                    <div className="flex gap-1" role="radiogroup" aria-label="Filtrar por bimestre">
                        {[0, 1, 2, 3, 4].map((b) => (
                            <button
                                key={b}
                                role="radio"
                                aria-checked={bimestre === b}
                                onClick={() => setBimestre(b)}
                                className={`px-2.5 h-7 rounded-md text-xs font-medium transition-colors ${
                                    bimestre === b ? 'bg-primary text-on-primary' : 'text-slate hover:bg-surface-muted'
                                }`}
                            >
                                {b === 0 ? 'Todos' : `${b}º`}
                            </button>
                        ))}
                    </div>
                }
            >
                {notas.length === 0 ? (
                    <EstadoVazio icone="notas" titulo={bimestre ? `Nenhuma nota no ${bimestre}º bimestre` : 'Nenhuma nota lançada ainda'} />
                ) : (
                    <Tabela>
                        <TabelaCabecalho>
                            <Th>Disciplina</Th>
                            <Th>Bimestre</Th>
                            <Th>Avaliação</Th>
                            <Th className="text-right">Nota</Th>
                        </TabelaCabecalho>
                        <TabelaCorpo>
                            {notas.map((n) => (
                                <Tr key={n.id}>
                                    <Td className="font-medium">{n.disciplina}</Td>
                                    <Td><Badge>{n.bimestre}º</Badge></Td>
                                    <Td className="text-slate">{n.nomeAvaliacao}</Td>
                                    <Td className={`text-right font-semibold tabular-nums ${n.valor < NOTA_MINIMA ? 'text-danger' : ''}`}>
                                        {n.valor.toFixed(1)}
                                    </Td>
                                </Tr>
                            ))}
                        </TabelaCorpo>
                    </Tabela>
                )}
            </Card>

            <Card titulo="Ocorrências">
                {resumo.ocorrencias.length === 0 ? (
                    <EstadoVazio icone="sucesso" titulo="Nenhuma ocorrência registrada" />
                ) : (
                    <ul className="divide-y divide-line">
                        {resumo.ocorrencias.map((o) => (
                            <li key={o.id} className="py-3 first:pt-0 last:pb-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <Badge tom={TOM_OCORRENCIA[o.tipo] ?? 'neutro'}>{TIPO_OCORRENCIA_LABEL[o.tipo]}</Badge>
                                    <span className="text-xs text-slate">{dataCurta(o.data)} · por {o.registradoPor}</span>
                                </div>
                                <p className="text-sm text-ink">{o.descricao}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}
