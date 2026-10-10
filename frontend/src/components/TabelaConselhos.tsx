import type { ReactNode } from 'react';
import { RESULTADO_COR, RESULTADO_LABEL, type ConselhoClasse } from '../types/conselho';

interface TabelaConselhosProps {
    conselhos: ConselhoClasse[];
    mensagemVazia: string;
    // Conteúdo da última coluna (botão de ação ou situação). Sem ela, mostra o resultado.
    renderAcao?: (conselho: ConselhoClasse) => ReactNode;
}

// Tabela de conselhos compartilhada pela tela do professor (votar) e da gestão (encerrar).
export function TabelaConselhos({ conselhos, mensagemVazia, renderAcao }: TabelaConselhosProps) {
    if (conselhos.length === 0) return <p className="text-sm text-slate">{mensagemVazia}</p>;

    return (
        <table className="w-full border-t border-ink/10">
            <thead>
                <tr className="border-b border-ink/10 text-left">
                    <th className="py-3 text-sm font-normal text-slate">Aluno</th>
                    <th className="py-3 text-sm font-normal text-slate">Ano</th>
                    <th className="py-3 text-sm font-normal text-slate">Disciplinas reprovadas</th>
                    <th className="py-3 text-sm font-normal text-slate">Votos</th>
                    <th className="py-3 text-sm font-normal text-slate text-right">
                        {renderAcao ? '' : 'Resultado'}
                    </th>
                </tr>
            </thead>

            <tbody>
                {conselhos.map((c) => (
                    <tr key={c.id} className="border-b border-ink/10 align-top">
                        <td className="py-3">
                            <p className="text-ink">{c.nomeAluno}</p>
                            <p className="text-xs text-slate">Matrícula {c.matricula}</p>
                        </td>
                        <td className="py-3 text-slate">{c.anoLetivo}</td>
                        <td className="py-3 text-slate text-sm">{c.disciplinasReprovadas.join(', ') || '—'}</td>
                        <td className="py-3 text-sm text-slate whitespace-nowrap">
                            <span className="text-emerald-700">{c.votosAprovar} aprovar</span>
                            {' · '}
                            <span className="text-red-700">{c.votosReprovar} reprovar</span>
                        </td>
                        <td className="py-3 text-sm text-right">
                            {renderAcao
                                ? renderAcao(c)
                                : <span className={RESULTADO_COR[c.resultado]}>{RESULTADO_LABEL[c.resultado]}</span>}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
