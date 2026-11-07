import { PUBLICO_ALVO_LABEL, type Comunicado } from '../types/comunicado';
import { tempoRelativo } from '../utils/datas';
import { Badge, type TomBadge } from './ui/Badge';
import { EstadoVazio } from './ui/Estrutura';

// Escola toda, Turma, Professores, Alunos
const TOM_PUBLICO: TomBadge[] = ['destaque', 'info', 'neutro', 'sucesso'];

interface ListaComunicadosProps {
    comunicados: Comunicado[];
    mensagemVazia?: string;
}

// Mural de comunicados, do mais recente para o mais antigo (a API já devolve nessa ordem).
export function ListaComunicados({ comunicados, mensagemVazia = 'Nenhum comunicado por enquanto.' }: ListaComunicadosProps) {
    if (comunicados.length === 0) {
        return (
            <EstadoVazio
                icone="comunicados"
                titulo={mensagemVazia}
                descricao="Quando a escola enviar um comunicado para você, ele aparece aqui."
            />
        );
    }

    return (
        <ul className="divide-y divide-line">
            {comunicados.map((c) => (
                <li key={c.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <Badge tom={TOM_PUBLICO[c.publicoAlvo] ?? 'neutro'}>
                            {c.publicoAlvo === 1 && c.turma ? `Turma ${c.turma}` : PUBLICO_ALVO_LABEL[c.publicoAlvo]}
                        </Badge>
                        <span className="text-xs text-slate">
                            {tempoRelativo(c.dataEnvio)}
                            {c.autor && <> · por {c.autor}</>}
                        </span>
                    </div>

                    <p className="font-semibold text-ink">{c.titulo}</p>
                    <p className="text-sm text-slate mt-1 whitespace-pre-line">{c.mensagem}</p>
                </li>
            ))}
        </ul>
    );
}
