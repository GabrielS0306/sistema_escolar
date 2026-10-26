import type { OcorrenciaRegistro } from '../services/ocorrenciaTurmaService';
import { TIPO_OCORRENCIA_LABEL } from '../types/ocorrencia';
import { Badge, type TomBadge } from './ui/Badge';
import { EstadoVazio } from './ui/Estrutura';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td } from './ui/Tabela';

// Disciplinar, Saúde, Atraso, Elogio, Outro
const TOM_TIPO: TomBadge[] = ['perigo', 'info', 'alerta', 'sucesso', 'neutro'];

interface TabelaOcorrenciasProps {
    ocorrencias: OcorrenciaRegistro[];
    mensagemVazia?: string;
}

export function TabelaOcorrencias({ ocorrencias, mensagemVazia = 'Nenhuma ocorrência registrada ainda.' }: TabelaOcorrenciasProps) {
    if (ocorrencias.length === 0) return <EstadoVazio icone="ocorrencias" titulo={mensagemVazia} />;

    return (
        <Tabela>
            <TabelaCabecalho>
                <Th>Aluno</Th>
                <Th>Tipo</Th>
                <Th>Descrição</Th>
                <Th>Registrado por</Th>
                <Th>Data</Th>
            </TabelaCabecalho>

            <TabelaCorpo>
                {ocorrencias.map((o) => (
                    <Tr key={o.id}>
                        <Td className="font-medium whitespace-nowrap">{o.nomeAluno}</Td>
                        <Td><Badge tom={TOM_TIPO[o.tipo] ?? 'neutro'}>{TIPO_OCORRENCIA_LABEL[o.tipo]}</Badge></Td>
                        <Td className="text-slate min-w-64">{o.descricao}</Td>
                        <Td className="text-slate whitespace-nowrap">{o.registradoPor}</Td>
                        <Td className="text-slate whitespace-nowrap">{new Date(o.data).toLocaleDateString('pt-BR')}</Td>
                    </Tr>
                ))}
            </TabelaCorpo>
        </Tabela>
    );
}
