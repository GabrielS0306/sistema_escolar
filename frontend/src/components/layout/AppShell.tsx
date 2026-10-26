import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTema } from '../../hooks/useTema';
import { getMe } from '../../services/authService';
import { ROTA_POR_PAPEL, ROTULO_PAPEL } from '../../types/auth';
import { PerfilModal } from '../PerfilModal';
import { Icone } from '../ui/Icone';
import { SeletorTema } from '../ui/SeletorTema';
import { configDaArea, itemEstaAtivo, type Area, type SecaoMenu } from './menus';

// Layout único de todas as áreas logadas: sidebar (vira gaveta no celular), cabeçalho com caminho e menu do usuário.
export function AppShell({ area }: { area: Area }) {
    const location = useLocation();
    const config = configDaArea(area);

    const [gavetaAberta, setGavetaAberta] = useState(false);

    const itemAtivo = config.secoes.flatMap((s) => s.itens).find((item) => itemEstaAtivo(item, location.pathname));

    return (
        <div className="min-h-screen bg-paper">
            {/* Sidebar fixa no desktop */}
            <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col bg-sidebar text-sidebar-fg">
                <Sidebar secoes={config.secoes} pathname={location.pathname} />
            </aside>

            {/* Gaveta no celular */}
            {gavetaAberta && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black/50 animate-entrar" onClick={() => setGavetaAberta(false)} />
                    <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] flex flex-col bg-sidebar text-sidebar-fg shadow-pop animate-subir">
                        <Sidebar
                            secoes={config.secoes}
                            pathname={location.pathname}
                            onNavegar={() => setGavetaAberta(false)}
                            onFechar={() => setGavetaAberta(false)}
                        />
                    </aside>
                </div>
            )}

            <div className="lg:pl-64 min-w-0">
                <header className="sticky top-0 z-30 flex items-center gap-3 h-14 px-4 sm:px-8 bg-paper/85 backdrop-blur border-b border-line">
                    <button
                        onClick={() => setGavetaAberta(true)}
                        className="lg:hidden -ml-1 w-9 h-9 rounded-lg flex items-center justify-center text-ink hover:bg-surface-muted"
                        aria-label="Abrir menu"
                    >
                        <Icone nome="menu" />
                    </button>

                    {/* Caminho: onde o usuário está */}
                    <nav aria-label="Caminho" className="flex items-center gap-1.5 text-sm min-w-0">
                        <span className="text-slate truncate">{config.nome}</span>
                        {itemAtivo && (
                            <>
                                <Icone nome="chevronDireita" tamanho={14} className="text-slate/60" />
                                <span className="font-medium text-ink truncate">{itemAtivo.label}</span>
                            </>
                        )}
                    </nav>

                    <div className="ml-auto">
                        <BotaoTemaRapido />
                    </div>
                </header>

                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

interface SidebarProps {
    secoes: SecaoMenu[];
    pathname: string;
    onNavegar?: () => void;
    onFechar?: () => void;
}

function Sidebar({ secoes, pathname, onNavegar, onFechar }: SidebarProps) {
    return (
        <>
            <div className="flex items-center justify-between px-5 h-16 shrink-0">
                <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                        <span className="font-serif text-[#1B2A4A] font-bold text-sm">SE</span>
                    </span>
                    <span className="font-serif text-lg">Sistema Escolar</span>
                </div>

                {onFechar && (
                    <button onClick={onFechar} className="w-8 h-8 rounded-lg flex items-center justify-center text-sidebar-muted hover:text-sidebar-fg" aria-label="Fechar menu">
                        <Icone nome="fechar" />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-2">
                {secoes.map((secao, i) => (
                    <div key={i} className={i > 0 ? 'mt-6' : ''}>
                        {secao.titulo && (
                            <p className="px-3 mb-1.5 text-[11px] font-medium uppercase tracking-wider text-sidebar-muted/80">{secao.titulo}</p>
                        )}

                        {secao.itens.map((item) => {
                            const ativo = itemEstaAtivo(item, pathname);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={onNavegar}
                                    aria-current={ativo ? 'page' : undefined}
                                    className={`relative flex items-center gap-3 px-3 h-9 mb-0.5 rounded-lg text-sm transition-colors ${
                                        ativo
                                            ? 'bg-white/10 text-sidebar-fg font-medium'
                                            : 'text-sidebar-muted hover:text-sidebar-fg hover:bg-sidebar-hover'
                                    }`}
                                >
                                    {ativo && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gold" aria-hidden="true" />}
                                    <Icone nome={item.icone} tamanho={17} className={ativo ? 'text-gold' : ''} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <MenuUsuario />
        </>
    );
}

function MenuUsuario() {
    const navigate = useNavigate();
    const { sessao, salvarSessao, sair } = useAuth();

    const [aberto, setAberto] = useState(false);
    const [perfilAberto, setPerfilAberto] = useState(false);
    const [fotoUrl, setFotoUrl] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Recarrega a foto ao fechar o modal de perfil (ela pode ter mudado).
    useEffect(() => {
        if (perfilAberto) return;
        let cancelado = false;

        getMe()
            .then((dados) => { if (!cancelado) setFotoUrl(dados.fotoPerfilUrl ?? null); })
            .catch(() => {});

        return () => { cancelado = true; };
    }, [perfilAberto]);

    // Fecha o menu ao clicar fora ou apertar Esc.
    useEffect(() => {
        if (!aberto) return;

        function cliqueFora(e: MouseEvent) {
            if (!containerRef.current?.contains(e.target as Node)) setAberto(false);
        }
        function tecla(e: KeyboardEvent) {
            if (e.key === 'Escape') setAberto(false);
        }

        document.addEventListener('mousedown', cliqueFora);
        document.addEventListener('keydown', tecla);
        return () => {
            document.removeEventListener('mousedown', cliqueFora);
            document.removeEventListener('keydown', tecla);
        };
    }, [aberto]);

    if (!sessao) return null;

    const outrosPapeis = sessao.papeis.filter((p) => p !== sessao.papelAtivo);

    function trocarPapel(papel: string) {
        salvarSessao({ ...sessao!, papelAtivo: papel });
        setAberto(false);
        navigate(ROTA_POR_PAPEL[papel] ?? '/dashboard/sem-perfil');
    }

    function handleSair() {
        sair();
        navigate('/login');
    }

    return (
        <div ref={containerRef} className="relative p-3 border-t border-white/10">
            {aberto && (
                <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-line bg-surface text-ink shadow-pop p-1.5 animate-subir" role="menu">
                    <button
                        role="menuitem"
                        onClick={() => { setAberto(false); setPerfilAberto(true); }}
                        className="flex items-center gap-3 w-full px-3 h-9 rounded-lg text-sm hover:bg-surface-muted"
                    >
                        <Icone nome="usuario" tamanho={16} className="text-slate" /> Meu perfil
                    </button>

                    {outrosPapeis.length > 0 && (
                        <>
                            <p className="px-3 pt-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-slate">Trocar para</p>
                            {outrosPapeis.map((papel) => (
                                <button
                                    key={papel}
                                    role="menuitem"
                                    onClick={() => trocarPapel(papel)}
                                    className="flex items-center gap-3 w-full px-3 h-9 rounded-lg text-sm hover:bg-surface-muted"
                                >
                                    <Icone nome="trocar" tamanho={16} className="text-slate" /> {ROTULO_PAPEL[papel] ?? papel}
                                </button>
                            ))}
                        </>
                    )}

                    <div className="flex items-center justify-between px-3 py-2 mt-1 border-t border-line">
                        <span className="text-sm">Tema</span>
                        <SeletorTema />
                    </div>

                    <button
                        role="menuitem"
                        onClick={handleSair}
                        className="flex items-center gap-3 w-full px-3 h-9 rounded-lg text-sm text-danger hover:bg-danger-soft"
                    >
                        <Icone nome="sair" tamanho={16} /> Sair
                    </button>
                </div>
            )}

            <button
                onClick={() => setAberto((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={aberto}
                className="flex items-center gap-3 w-full rounded-lg p-2 text-left hover:bg-sidebar-hover transition-colors"
            >
                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {fotoUrl
                        ? <img src={fotoUrl} alt="" className="w-full h-full object-cover" />
                        : <span className="font-serif text-gold text-sm">{sessao.nome.charAt(0).toUpperCase()}</span>}
                </span>
                <span className="flex-1 min-w-0">
                    <span className="block text-sm truncate">{sessao.nome}</span>
                    <span className="block text-xs text-sidebar-muted">{ROTULO_PAPEL[sessao.papelAtivo] ?? sessao.papelAtivo}</span>
                </span>
                <Icone nome="chevronBaixo" tamanho={16} className={`text-sidebar-muted transition-transform ${aberto ? 'rotate-180' : ''}`} />
            </button>

            <PerfilModal aberto={perfilAberto} onFechar={() => setPerfilAberto(false)} />
        </div>
    );
}

// Botão do cabeçalho: alterna claro/escuro com um clique (a opção "Sistema" fica no menu do usuário).
function BotaoTemaRapido() {
    const { escuro, definirTema } = useTema();

    return (
        <button
            onClick={() => definirTema(escuro ? 'claro' : 'escuro')}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate hover:text-ink hover:bg-surface-muted transition-colors"
            aria-label={escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            title={escuro ? 'Tema claro' : 'Tema escuro'}
        >
            <Icone nome={escuro ? 'sol' : 'lua'} />
        </button>
    );
}
