import type { OcorrenciaRegistro } from '../services/ocorrenciaTurmaService';
import { TIPO_OCORRENCIA_LABEL } from '../types/ocorrencia';

interface TabelaOcorrenciasProps {
    ocorrencias: OcorrenciaRegistro[];
    mensagemVazia?: string;
}

export function TabelaOcorrencias({ ocorrencias, mensagemVazia = 'Nenhuma ocorrência registrada ainda.' }: TabelaOcorrenciasProps) {
    if (ocorrencias.length === 0) return <p className="text-sm text-slate">{mensagemVazia}</p>;

    return (
        <table className="w-full border-t border-ink/10">
            <thead>
                <tr className="border-b border-ink/10 text-left">
                    <th className="py-3 text-sm font-normal text-slate">Aluno</th>
                    <th className="py-3 text-sm font-normal text-slate">Tipo</th>
                    <th className="py-3 text-sm font-normal text-slate">Descrição</th>
                    <th className="py-3 text-sm font-normal text-slate">Registrado por</th>
                    <th className="py-3 text-sm font-normal text-slate">Data</th>
                </tr>
            </thead>

            <tbody>
                {ocorrencias.map((o) => (
                    <tr key={o.id} className="border-b border-ink/10 align-top">
                        <td className="py-3 text-ink">{o.nomeAluno}</td>
                        <td className="py-3 text-sm text-gold">{TIPO_OCORRENCIA_LABEL[o.tipo]}</td>
                        <td className="py-3 text-sm text-slate">{o.descricao}</td>
                        <td className="py-3 text-sm text-slate">{o.registradoPor}</td>
                        <td className="py-3 text-sm text-slate whitespace-nowrap">
                            {new Date(o.data).toLocaleDateString('pt-BR')}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
