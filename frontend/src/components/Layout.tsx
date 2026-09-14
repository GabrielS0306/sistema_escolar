import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { PerfilModal } from './PerfilModal';
import { getMe } from '../services/authService';

const MENU_ITEMS = [
    { path: '/admin', label: 'Painel' },
    { path: '/admin/usuarios/novo', label: 'Novo usuário' },
    { path: '/admin/alunos', label: 'Alunos' },
    { path: '/admin/turmas', label: 'Turmas' },
    { path: '/admin/professores', label: 'Professores' },
    { path: '/admin/frequencia', label: 'Frequência' },
    { path: '/admin/notas', label: 'Notas' },
    { path: '/admin/usuarios', label: 'Usuários' },
];

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

    function handleSair() {
        sair();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-paper">
            <aside className="fixed inset-y-0 left-0 w-60 bg-ink text-paper flex flex-col">
                <div className="px-6 py-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                            <span className="font-serif text-ink font-semibold text-sm">
                                SE
                            </span>
                        </div>

                        <p className="font-serif text-xl leading-tight">Sistema Escolar</p>
                    </div>

                    <p className="text-xs text-paper/60 mt-2 ml-10">Painel administrativo</p>
                </div>

                <nav className="flex-1 px-3">
                    {MENU_ITEMS.map((item) => {
                        const ativo = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`block px-3 py-2 text-sm border-l-2 mb-1 transition-colors ${
                                    ativo
                                        ? 'border-gold text-paper bg-white/5'
                                        : 'border-transparent text-paper/70 hover:text-paper hover:border-paper/30'
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
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

                            <p className="text-xs text-paper/50">
                                {sessao?.papelAtivo}
                            </p>
                        </div>
                    </button>

                    <button onClick={handleSair} title="Sair" className="text-paper/40 hover:text-gold transition-colors shrink-0">
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