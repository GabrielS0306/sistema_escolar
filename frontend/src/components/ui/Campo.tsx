import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Icone, type NomeIcone } from './Icone';

const BASE_CAMPO = `w-full rounded-lg border border-line-strong bg-surface text-ink placeholder:text-slate/70
    transition-colors focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/25
    disabled:opacity-60 aria-[invalid=true]:border-danger`;

interface RotuloProps {
    label?: string;
    dica?: string;
    erro?: string | null;
}

interface MolduraProps extends RotuloProps {
    id: string;
    className?: string;
    children: ReactNode;
}

// Label + controle + dica/erro, ligados por id (o leitor de tela anuncia a dica e o erro).
function Moldura({ id, label, dica, erro, className = '', children }: MolduraProps) {
    // Sem label/dica/erro, o controle vai "puro" (ex.: busca numa barra de ferramentas).
    if (!label && !dica && !erro) return <div className={className}>{children}</div>;

    return (
        <div className={`mb-4 ${className}`}>
            {label && <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">{label}</label>}
            {children}
            {(erro || dica) && (
                <p id={`${id}-ajuda`} className={`text-xs mt-1.5 ${erro ? 'text-danger' : 'text-slate'}`}>{erro ?? dica}</p>
            )}
        </div>
    );
}

function atributosAcessibilidade(id: string, { dica, erro }: RotuloProps) {
    return {
        id,
        'aria-invalid': erro ? true : undefined,
        'aria-describedby': erro || dica ? `${id}-ajuda` : undefined,
    };
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, RotuloProps {
    icone?: NomeIcone;
}

export function Input({ label, dica, erro, icone, className = '', id: idExterno, ...props }: InputProps) {
    const idGerado = useId();
    const id = idExterno ?? idGerado;
    const acessibilidade = atributosAcessibilidade(id, { dica, erro });

    return (
        <Moldura id={id} label={label} dica={dica} erro={erro} className={className}>
            <div className="relative">
                {icone && (
                    <Icone nome={icone} tamanho={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate pointer-events-none" />
                )}
                <input className={`${BASE_CAMPO} h-10 ${icone ? 'pl-9 pr-3' : 'px-3'}`} {...acessibilidade} {...props} />
            </div>
        </Moldura>
    );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, RotuloProps {}

export function Select({ label, dica, erro, className = '', id: idExterno, children, ...props }: SelectProps) {
    const idGerado = useId();
    const id = idExterno ?? idGerado;

    return (
        <Moldura id={id} label={label} dica={dica} erro={erro} className={className}>
            <select className={`${BASE_CAMPO} h-10 px-3`} {...atributosAcessibilidade(id, { dica, erro })} {...props}>
                {children}
            </select>
        </Moldura>
    );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, RotuloProps {}

export function Textarea({ label, dica, erro, className = '', id: idExterno, ...props }: TextareaProps) {
    const idGerado = useId();
    const id = idExterno ?? idGerado;

    return (
        <Moldura id={id} label={label} dica={dica} erro={erro} className={className}>
            <textarea className={`${BASE_CAMPO} px-3 py-2`} {...atributosAcessibilidade(id, { dica, erro })} {...props} />
        </Moldura>
    );
}

// Caixa de busca padrão das telas de gestão.
export function CampoBusca({ className = 'w-full sm:w-80', ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return <Input icone="busca" type="search" aria-label={props.placeholder ?? 'Buscar'} className={className} {...props} />;
}
