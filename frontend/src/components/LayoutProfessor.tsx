import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LayoutProfessor() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sessao, sair } = useAuth();

    function handleSair() {
        sair();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-paper">
            <aside className="fixed inset-y-0 left-0 w-60 bg-ink text-paper flex flex-col">
                <div className="px-6 py-8 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                        <span className="font-serif text-ink font-semibold text-sm">SE</span>
                    </div>

                    <p className="font-serif text-xl leading-tight">Sistema Escolar</p>
                </div>

                <nav className="flex-1 px-3">
                    <Link
                        to="/dashboard/professor"
                        className={`block px-3 py-2 text-sm border-l-2 mb-1 transition-colors ${
                        location.pathname === '/dashboard/professor'
                            ? 'border-gold text-paper bg-white/5'
                            : 'border-transparent text-paper/70 hover:text-paper hover:border-paper/30'
                        }`}
                    >
                        Minhas turmas
                    </Link>
                </nav>

                <div className="px-6 py-5 border-t border-white/10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <span className="font-serif text-gold text-sm">{sessao?.nome?.charAt(0).toUpperCase()}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{sessao?.nome}</p>
                        <p className="text-xs text-paper/50">Professor</p>
                    </div>

                    <button onClick={handleSair} title="Sair" className="text-paper/40 hover:text-gold transition-colors shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                    </button>
                </div>
            </aside>

            <main className="ml-60">
                <Outlet />
            </main>
        </div>
    );
}