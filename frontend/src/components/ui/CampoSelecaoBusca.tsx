import { useEffect, useId, useRef, useState } from 'react';
import { Icone } from './Icone';
import { Avatar } from './Avatar';

export interface OpcaoBusca {
    id: string;
    titulo: string;      // texto principal (ex.: nome do aluno)
    subtitulo?: string;  // linha de apoio (ex.: matrícula) — também entra na busca
}

interface CampoSelecaoBuscaProps {
    label?: string;
    opcoes: OpcaoBusca[];
    valor: string;                 // id selecionado ('' = nada)
    onChange: (id: string) => void;
    placeholder?: string;
    dica?: string;
    desabilitado?: boolean;
    comAvatar?: boolean;
    autoFocus?: boolean;
}

const LIMITE_RESULTADOS = 50;

// "João" e "joao" casam: tira acentos e caixa antes de comparar.
function normalizar(texto: string) {
    return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Campo de busca que filtra uma lista enquanto se digita e permite escolher um item
// com o mouse ou com o teclado (↑ ↓ Enter Esc). Substitui <select> com listas longas.
export function CampoSelecaoBusca({
    label,
    opcoes,
    valor,
    onChange,
    placeholder = 'Digite para buscar...',
    dica,
    desabilitado = false,
    comAvatar = true,
    autoFocus = false,
}: CampoSelecaoBuscaProps) {
    const id = useId();
    const idLista = `${id}-lista`;
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [texto, setTexto] = useState('');
    const [aberto, setAberto] = useState(false);
    const [destaque, setDestaque] = useState(0);

    const selecionada = opcoes.find((o) => o.id === valor) ?? null;

    const termo = normalizar(texto.trim());
    const filtradas = (termo === ''
        ? opcoes
        : opcoes.filter((o) => normalizar(`${o.titulo} ${o.subtitulo ?? ''}`).includes(termo))
    ).slice(0, LIMITE_RESULTADOS);

    // Fecha ao clicar fora.
    useEffect(() => {
        if (!aberto) return;

        function cliqueFora(e: MouseEvent) {
            if (!containerRef.current?.contains(e.target as Node)) setAberto(false);
        }

        document.addEventListener('mousedown', cliqueFora);
        return () => document.removeEventListener('mousedown', cliqueFora);
    }, [aberto]);

    function escolher(opcao: OpcaoBusca) {
        onChange(opcao.id);
        setTexto('');
        setAberto(false);
    }

    function limpar() {
        onChange('');
        setTexto('');
        setDestaque(0);
        // Volta o foco para o campo, já pronto para uma nova busca.
        window.setTimeout(() => inputRef.current?.focus(), 0);
    }

    function handleTecla(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setAberto(true);
            setDestaque((d) => Math.min(d + 1, filtradas.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setDestaque((d) => Math.max(d - 1, 0));
        } else if (e.key === 'Enter') {
            // Enter escolhe o item destacado em vez de enviar o formulário.
            if (aberto && filtradas[destaque]) {
                e.preventDefault();
                escolher(filtradas[destaque]);
            }
        } else if (e.key === 'Escape') {
            setAberto(false);
        }
    }

    return (
        <div ref={containerRef} className="relative mb-4">
            {label && <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">{label}</label>}

            {selecionada ? (
                // Já escolhido: mostra o item como um "cartão" com botão para trocar.
                <div className="flex items-center gap-3 h-10 rounded-lg border border-gold bg-gold-soft/40 px-3">
                    {comAvatar && <Avatar nome={selecionada.titulo} />}
                    <span className="flex-1 min-w-0 truncate text-sm">
                        <span className="font-medium text-ink">{selecionada.titulo}</span>
                        {selecionada.subtitulo && <span className="text-slate"> · {selecionada.subtitulo}</span>}
                    </span>
                    {!desabilitado && (
                        <button
                            type="button"
                            onClick={limpar}
                            className="text-slate hover:text-ink transition-colors"
                            aria-label={`Trocar ${selecionada.titulo}`}
                            title="Trocar"
                        >
                            <Icone nome="fechar" tamanho={16} />
                        </button>
                    )}
                </div>
            ) : (
                <div className="relative">
                    <Icone nome="busca" tamanho={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate pointer-events-none" />
                    <input
                        ref={inputRef}
                        id={id}
                        type="text"
                        role="combobox"
                        aria-expanded={aberto}
                        aria-controls={idLista}
                        aria-autocomplete="list"
                        aria-activedescendant={aberto && filtradas[destaque] ? `${id}-opcao-${destaque}` : undefined}
                        autoComplete="off"
                        autoFocus={autoFocus}
                        disabled={desabilitado}
                        value={texto}
                        placeholder={placeholder}
                        onChange={(e) => { setTexto(e.target.value); setDestaque(0); setAberto(true); }}
                        onFocus={() => setAberto(true)}
                        onKeyDown={handleTecla}
                        className="w-full h-10 rounded-lg border border-line-strong bg-surface text-ink placeholder:text-slate/70 pl-9 pr-3
                            transition-colors focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/25 disabled:opacity-60"
                    />

                    {aberto && (
                        <ul
                            id={idLista}
                            role="listbox"
                            className="absolute z-20 left-0 right-0 mt-1 max-h-64 overflow-y-auto rounded-lg border border-line bg-surface shadow-pop py-1 animate-entrar"
                        >
                            {filtradas.length === 0 ? (
                                <li className="px-3 py-3 text-sm text-slate">Nenhum resultado para "{texto}".</li>
                            ) : (
                                filtradas.map((opcao, i) => (
                                    <li
                                        key={opcao.id}
                                        id={`${id}-opcao-${i}`}
                                        role="option"
                                        aria-selected={i === destaque}
                                        // mousedown (e não click) para escolher antes de o input perder o foco.
                                        onMouseDown={(e) => { e.preventDefault(); escolher(opcao); }}
                                        onMouseEnter={() => setDestaque(i)}
                                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm ${i === destaque ? 'bg-surface-muted' : ''}`}
                                    >
                                        {comAvatar && <Avatar nome={opcao.titulo} />}
                                        <span className="min-w-0">
                                            <span className="block text-ink truncate">{opcao.titulo}</span>
                                            {opcao.subtitulo && <span className="block text-xs text-slate truncate">{opcao.subtitulo}</span>}
                                        </span>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
            )}

            {dica && <p className="text-xs mt-1.5 text-slate">{dica}</p>}
        </div>
    );
}
