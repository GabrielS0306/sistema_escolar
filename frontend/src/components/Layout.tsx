import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { PerfilModal } from './PerfilModal';
import { getMe } from '../services/authService';

interface ItemMenu {
    path: string;            // relativo à área: '' é o painel
    label: string;
    icone: string;
    somenteAdmin?: boolean;  // escondido para o Coordenador (o backend também bloqueia)
}

// O mesmo layout serve à área do Admin (/admin) e do Coordenador (/coordenador).
const MENU_SECOES: { titulo: string | null; itens: ItemMenu[] }[] = [
    {
        titulo: null,
        itens: [{ path: '', label: 'Painel', icone: 'painel' }],
    },
    {
        titulo: 'Pessoas',
        itens: [
            { path: 'usuarios', label: 'Usuários', icone: 'usuarios', somenteAdmin: true },
            { path: 'usuarios/novo', label: 'Novo usuário', icone: 'novoUsuario' },
            { path: 'alunos', label: 'Alunos', icone: 'alunos' },
            { path: 'professores', label: 'Professores', icone: 'professores' },
        ],
    },
    {
        titulo: 'Acadêmico',
        itens: [
            { path: 'turmas', label: 'Turmas', icone: 'turmas' },
            { path: 'frequencia', label: 'Frequência', icone: 'frequencia' },
            { path: 'notas', label: 'Notas', icone: 'notas' },
            { path: 'recuperacao', label: 'Recuperação', icone: 'recuperacao' },
            { path: 'conselhos', label: 'Conselho de classe', icone: 'conselho' },
        ],
    },
    {
        titulo: 'Comunicação',
        itens: [{ path: 'comunicados', label: 'Comunicados', icone: 'comunicados' }],
    },
];

function Icone({ nome }: { nome: string }) {
    const props = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

    switch (nome) {
        case 'painel':
            return <svg {...props}>
                    <rect x="3" y="3" width="7" height="9" rx="1"/>
                    <rect x="14" y="3" width="7" height="5" rx="1"/>
                    <rect x="14" y="12" width="7" height="9" rx="1"/>
                    <rect x="3" y="16" width="7" height="5" rx="1"/>
                </svg>;
        case 'usuarios':
            return <svg {...props}>
                    <circle cx="9" cy="8" r="3"/>
                    <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5"/>
                    <circle cx="17" cy="9" r="2.5"/>
                    <path d="M21 20c0-2.2-1.6-3.8-4-4.3"/>
                </svg>;
        case 'novoUsuario':
            return <svg {...props}>
                    <circle cx="9" cy="8" r="3"/>
                    <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5"/>
                    <line x1="18" y1="8" x2="18" y2="14"/>
                    <line x1="15" y1="11" x2="21" y2="11"/>
                </svg>;
        case 'alunos':
            return <svg {...props}>
                    <path d="M2 8l10-5 10 5-10 5-10-5Z"/>
                    <path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5"/>
                </svg>;
        case 'professores':
            return <svg {...props}>
                    <rect x="3" y="5" width="18" height="13" rx="1.5"/>
                    <path d="M3 15h18"/>
                    <path d="M9 5V3h6v2"/>
                </svg>;
        case 'turmas':
            return <svg {...props}>
                    <rect x="3" y="3" width="8" height="8" rx="1"/>
                    <rect x="13" y="3" width="8" height="8" rx="1"/>
                    <rect x="3" y="13" width="8" height="8" rx="1"/>
                    <rect x="13" y="13" width="8" height="8" rx="1"/>
                </svg>;
        case 'frequencia':
            return <svg {...props}>
                    <rect x="3" y="4" width="18" height="17" rx="2"/>
                    <path d="M3 9h18"/>
                    <path d="M8 2v4M16 2v4"/>
                    <path d="M8 14l2.5 2.5L16 11"/>
                </svg>;
        case 'notas':
            return <svg {...props}>
                    <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Z"/>
                    <path d="M14 3v5h5"/>
                    <path d="M9 13h6M9 17h6"/>
                </svg>;
        case 'conselho':
            return <svg {...props}>
                    <path d="M12 3v18"/>
                    <path d="M7 21h10"/>
                    <path d="M4 7h16"/>
                    <path d="M7 7l-3 6a3 3 0 0 0 6 0L7 7Z"/>
                    <path d="M17 7l-3 6a3 3 0 0 0 6 0l-3-6Z"/>
                </svg>;
        case 'recuperacao':
            return <svg {...props}>
                    <path d="M3 12a9 9 0 1 0 3-6.7"/>
                    <path d="M3 4v5h5"/>
                    <path d="M12 8v4l3 2"/>
                </svg>;
        case 'comunicados':
            return <svg {...props}>
                    <path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1Z"/>
                    <path d="M16 9a3 3 0 0 1 0 6"/>
                    <path d="M19 6a7 7 0 0 1 0 12"/>
                </svg>;
        default:
            return null;
    }
}

export function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sessao, sair } = useAuth();
    const [perfilAberto, setPerfilAberto] = useState(false);
    const [fotoUrl, setFotoUrl] = useState<string | null>(null);

    useEffect(() => {
        let cancelado = false;

        getMe()
            .then((dados) => {
            if (!cancelado) setFotoUrl(dados.fotoPerfilUrl ?? null);
            })
        .catch(() => {});
    return () => { cancelado = true; };
    }, [perfilAberto]);

    const ehCoordenador = sessao?.papelAtivo === 'Coordenador';
    const base = ehCoordenador ? '/coordenador' : '/admin';
    const secoes = MENU_SECOES
        .map((secao) => ({ ...secao, itens: secao.itens.filter((item) => !(ehCoordenador && item.somenteAdmin)) }))
        .filter((secao) => secao.itens.length > 0);

    function handleSair() {
        sair();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-paper">
            <aside className="fixed inset-y-0 left-0 w-60 bg-sidebar text-sidebar-fg flex flex-col">
                <div className="px-6 py-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                            <span className="font-serif text-[#1B2A4A] font-semibold text-sm">
                                SE
                            </span>
                        </div>

                        <p className="font-serif text-xl leading-tight">Sistema Escolar</p>
                    </div>

                    <p className="text-xs text-sidebar-muted mt-2 ml-10">{ehCoordenador ? 'Coordenação pedagógica' : 'Painel administrativo'}</p>
                </div>

                <nav className="flex-1 px-3 overflow-y-auto">
                    {secoes.map((secao, i) => (
                        <div key={i} className={i > 0 ? 'mt-5' : ''}>
                            {secao.titulo && (
                                <p className="px-3 text-xs text-sidebar-muted uppercase tracking-wide mb-1">{secao.titulo}</p>
                            )}

                            {secao.itens.map((item) => {
                                const destino = item.path ? `${base}/${item.path}` : base;
                                const ativo = location.pathname === destino;

                                return (
                                    <Link
                                        key={destino}
                                        to={destino}
                                        className={`flex items-center gap-2.5 px-3 py-2 text-sm border-l-2 mb-0.5 transition-colors ${
                                        ativo
                                            ? 'border-gold text-sidebar-fg bg-white/5'
                                            : 'border-transparent text-sidebar-muted hover:text-sidebar-fg hover:border-white/20'
                                        }`}
                                    >
                                        <Icone nome={item.icone} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="px-6 py-5 border-t border-white/10 flex items-center gap-3">
                    <button
                        onClick={() => setPerfilAberto(true)}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left"
                    >
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {fotoUrl ? (
                                <img src={fotoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-serif text-gold text-sm">{sessao?.nome?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">
                                {sessao?.nome}
                            </p>

                            <p className="text-xs text-sidebar-muted">
                                {sessao?.papelAtivo}
                            </p>
                        </div>
                    </button>

                    <button onClick={handleSair} title="Sair" className="text-sidebar-muted hover:text-gold transition-colors shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />

                            <polyline points="16 17 21 12 16 7" />

                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </div>
            </aside>

            <main className="ml-60">
                <Outlet />
            </main>

            <PerfilModal
                aberto={perfilAberto}
                onFechar={() => setPerfilAberto(false)}
            />
        </div>
    );
}