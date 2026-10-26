import { useTema, type PreferenciaTema } from '../../hooks/useTema';
import { Icone, type NomeIcone } from './Icone';

const OPCOES: { valor: PreferenciaTema; rotulo: string; icone: NomeIcone }[] = [
    { valor: 'claro', rotulo: 'Claro', icone: 'sol' },
    { valor: 'escuro', rotulo: 'Escuro', icone: 'lua' },
    { valor: 'sistema', rotulo: 'Sistema', icone: 'monitor' },
];

interface SeletorTemaProps {
    // "sidebar" usa as cores da barra lateral (fundo sempre escuro).
    variante?: 'padrao' | 'sidebar';
}

export function SeletorTema({ variante = 'padrao' }: SeletorTemaProps) {
    const { preferencia, definirTema } = useTema();
    const naSidebar = variante === 'sidebar';

    return (
        <div
            role="radiogroup"
            aria-label="Tema"
            className={`inline-flex rounded-lg p-0.5 ${naSidebar ? 'bg-sidebar-hover' : 'bg-surface-muted'}`}
        >
            {OPCOES.map((opcao) => {
                const ativo = preferencia === opcao.valor;

                return (
                    <button
                        key={opcao.valor}
                        role="radio"
                        aria-checked={ativo}
                        title={opcao.rotulo}
                        onClick={() => definirTema(opcao.valor)}
                        className={`w-8 h-7 rounded-md flex items-center justify-center transition-colors ${
                            ativo
                                ? naSidebar ? 'bg-white/15 text-sidebar-fg' : 'bg-surface text-ink shadow-card'
                                : naSidebar ? 'text-sidebar-muted hover:text-sidebar-fg' : 'text-slate hover:text-ink'
                        }`}
                    >
                        <Icone nome={opcao.icone} tamanho={15} />
                        <span className="sr-only">{opcao.rotulo}</span>
                    </button>
                );
            })}
        </div>
    );
}
