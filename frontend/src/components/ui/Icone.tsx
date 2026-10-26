import type { ReactNode } from 'react';

// Ícones de contorno (24x24, traço 1.8), desenhados à mão no estilo do projeto.
const CAMINHOS = {
    painel: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
    usuarios: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" /><circle cx="17" cy="9" r="2.5" /><path d="M21 20c0-2.2-1.6-3.8-4-4.3" /></>,
    novoUsuario: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" /><path d="M18 8v6M15 11h6" /></>,
    usuario: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></>,
    alunos: <><path d="M2 8l10-5 10 5-10 5-10-5Z" /><path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" /></>,
    professores: <><rect x="3" y="5" width="18" height="13" rx="1.5" /><path d="M3 15h18" /><path d="M9 5V3h6v2" /></>,
    turmas: <><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></>,
    frequencia: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /><path d="M8 14l2.5 2.5L16 11" /></>,
    notas: <><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
    conselho: <><path d="M12 3v18M7 21h10M4 7h16" /><path d="M7 7l-3 6a3 3 0 0 0 6 0L7 7ZM17 7l-3 6a3 3 0 0 0 6 0l-3-6Z" /></>,
    recuperacao: <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5M12 8v4l3 2" /></>,
    comunicados: <><path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1Z" /><path d="M16 9a3 3 0 0 1 0 6M19 6a7 7 0 0 1 0 12" /></>,
    ocorrencias: <><path d="M12 3l9 16H3l9-16Z" /><path d="M12 10v4M12 17h.01" /></>,
    documentos: <><path d="M8 3h6l5 5v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M14 3v5h5" /><path d="M4 7v13a2 2 0 0 0 2 2h9" /></>,
    livro: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z" /><path d="M4 19a2 2 0 0 1 2-2h13" /></>,
    calendario: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></>,
    sair: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></>,
    trocar: <><path d="M7 4L3 8l4 4" /><path d="M3 8h13a4 4 0 0 1 4 4" /><path d="M17 20l4-4-4-4" /><path d="M21 16H8a4 4 0 0 1-4-4" /></>,
    sol: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    lua: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
    monitor: <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    fechar: <path d="M6 6l12 12M18 6L6 18" />,
    busca: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
    mais: <path d="M12 5v14M5 12h14" />,
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    sucesso: <><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" /></>,
    erro: <><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    alerta: <><path d="M12 3l9 16H3l9-16Z" /><path d="M12 10v4M12 17h.01" /></>,
    setaDireita: <path d="M5 12h14M13 6l6 6-6 6" />,
    chevronDireita: <path d="M9 6l6 6-6 6" />,
    chevronBaixo: <path d="M6 9l6 6 6-6" />,
    vazio: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M3 12h5l1.5 2h5L16 12h5M7 7l2-4h6l2 4" /></>,
    abrir: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></>,
    chave: <><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M17 6l3 3M14 9l2 2" /></>,
} satisfies Record<string, ReactNode>;

export type NomeIcone = keyof typeof CAMINHOS;

interface IconeProps {
    nome: NomeIcone;
    tamanho?: number;
    className?: string;
}

export function Icone({ nome, tamanho = 18, className = '' }: IconeProps) {
    return (
        <svg
            width={tamanho}
            height={tamanho}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 ${className}`}
            aria-hidden="true"
        >
            {CAMINHOS[nome]}
        </svg>
    );
}
