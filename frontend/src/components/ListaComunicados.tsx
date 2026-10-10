import { PUBLICO_ALVO_LABEL, type Comunicado } from '../types/comunicado';

interface ListaComunicadosProps {
    comunicados: Comunicado[];
    mensagemVazia?: string;
}

// Mural de comunicados, do mais recente para o mais antigo (a API já devolve nessa ordem).
export function ListaComunicados({ comunicados, mensagemVazia = 'Nenhum comunicado por enquanto.' }: ListaComunicadosProps) {
    if (comunicados.length === 0) return <p className="text-sm text-slate">{mensagemVazia}</p>;

    return (
        <ul className="border-t border-ink/10">
            {comunicados.map((c) => (
                <li key={c.id} className="py-5 border-b border-ink/10">
                    <div className="flex items-baseline justify-between gap-4">
                        <p className="font-serif text-lg text-ink">{c.titulo}</p>
                        <p className="text-xs text-slate whitespace-nowrap">
                            {new Date(c.dataEnvio).toLocaleDateString('pt-BR')}
                        </p>
                    </div>

                    <p className="text-xs text-slate mt-1">
                        <span className="text-gold">
                            {c.publicoAlvo === 1 && c.turma ? `Turma ${c.turma}` : PUBLICO_ALVO_LABEL[c.publicoAlvo]}
                        </span>
                        {c.autor && <> · por {c.autor}</>}
                    </p>

                    <p className="text-sm text-ink/80 mt-3 whitespace-pre-line">{c.mensagem}</p>
                </li>
            ))}
        </ul>
    );
}
