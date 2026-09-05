import { Link, Outlet, useLocation } from 'react-router-dom';

const MENU_ITEMS = [
    { path: '/alunos',      label: 'Alunos' },
    { path: '/turmas',      label: 'Turmas' },
    { path: '/professores', label: 'Professores' },
    { path: '/frequencia',  label: 'Frequência' },
    { path: '/notas',       label: 'Notas' },
];

export function Layout() {
    const location = useLocation();

    return (
        <div className="flex min-h-screen">
            <aside className="w-56 bg-gray-900 text-white p-4">
                <h2 className="text-xl font-bold mb-6">Sistema Escolar</h2>

                <nav className="flex flex-col gap-2">
                    {MENU_ITEMS.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`px-3 py-2 rounded ${
                                location.pathname === item.path
                                ? 'bg-blue-600'
                                : 'hover:bg-gray-800'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className="flex-1 bg-gray-50">
                <Outlet />
            </main>
        </div>
    );
}