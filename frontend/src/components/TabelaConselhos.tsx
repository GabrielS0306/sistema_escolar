import type { ReactNode } from 'react';
import { RESULTADO_LABEL, RESULTADO_TOM, type ConselhoClasse } from '../types/conselho';
import { Badge } from './ui/Badge';
import { EstadoVazio } from './ui/Estrutura';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td, CelulaDupla } from './ui/Tabela';

interface TabelaConselhosProps {
    conselhos: ConselhoClasse[];
    mensagemVazia: string;
    // Conteúdo da última coluna (botão de ação ou situação). Sem ela, mostra o resultado.
    renderAcao?: (conselho: ConselhoClasse) => ReactNode;
}

// Tabela de conselhos compartilhada pela tela do professor (votar) e da gestão (encerrar).
export function TabelaConselhos({ conselhos, mensagemVazia, renderAcao }: TabelaConselhosProps) {
    if (conselhos.length === 0) return <EstadoVazio icone="conselho" titulo={mensagemVazia} />;

    return (
        <Tabela>
            <TabelaCabecalho>
                <Th>Aluno</Th>
                <Th>Ano</Th>
                <Th>Disciplinas reprovadas</Th>
                <Th>Votos</Th>
                <Th className="text-right">{renderAcao ? '' : 'Resultado'}</Th>
            </TabelaCabecalho>

            <TabelaCorpo>
                {conselhos.map((c) => (
                    <Tr key={c.id}>
                        <Td><CelulaDupla principal={c.nomeAluno} secundario={`Matrícula ${c.matricula}`} /></Td>
                        <Td className="text-slate tabular-nums">{c.anoLetivo}</Td>
                        <Td>
                            <div className="flex flex-wrap gap-1">
                                {c.disciplinasReprovadas.length === 0
                                    ? <span className="text-slate">—</span>
                                    : c.disciplinasReprovadas.map((d) => <Badge key={d} tom="perigo">{d}</Badge>)}
                            </div>
                        </Td>
                        <Td className="whitespace-nowrap">
                            <PlacarVotos aprovar={c.votosAprovar} reprovar={c.votosReprovar} />
                        </Td>
                        <Td className="text-right whitespace-nowrap">
                            {renderAcao
                                ? renderAcao(c)
                                : <Badge tom={RESULTADO_TOM[c.resultado]} comPonto>{RESULTADO_LABEL[c.resultado]}</Badge>}
                        </Td>
                    </Tr>
                ))}
            </TabelaCorpo>
        </Tabela>
    );
}

// Barra proporcional aprovar × reprovar, com os números ao lado.
function PlacarVotos({ aprovar, reprovar }: { aprovar: number; reprovar: number }) {
    const total = aprovar + reprovar;

    return (
        <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-surface-muted overflow-hidden flex" aria-hidden="true">
                {total > 0 && (
                    <>
                        <span className="bg-success h-full" style={{ width: `${(aprovar / total) * 100}%` }} />
                        <span className="bg-danger h-full" style={{ width: `${(reprovar / total) * 100}%` }} />
                    </>
                )}
            </div>
            <span className="text-xs text-slate tabular-nums">
                <span className="text-success font-medium">{aprovar}</span> × <span className="text-danger font-medium">{reprovar}</span>
            </span>
        </div>
    );
}
