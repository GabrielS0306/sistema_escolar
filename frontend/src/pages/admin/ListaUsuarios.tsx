import { useState } from 'react';
import { useUsuarios } from '../../hooks/useUsuarios';
import { EditarUsuarioModal } from '../../components/EditarUsuarioModal';

export function ListaUsuarios() {
    const { usuarios, carregando, erro } = useUsuarios();
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<string | null>(null);

    if (carregando) return <p className="text-slate p-12">Carregando...</p>;
    if (erro) return <p className="text-red-600 p-12">Erro: {erro}</p>;

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Gestão de acesso</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Usuários</h1>

            <div className="mt-10 border-t border-ink/10 divide-y divide-ink/10">
                {usuarios.map((u) => (
                    <button
                        key={u.id}
                        onClick={() => setUsuarioSelecionado(u.id)}
                        className="flex items-center justify-between w-full py-4 text-left group"
                    >
                        <div>
                            <p className="text-ink group-hover:text-gold transition-colors">{u.nome}</p>
                            <p className="text-sm text-slate">{u.email}</p>
                        </div>
                    </button>
                ))}
            </div>

            <EditarUsuarioModal usuarioId={usuarioSelecionado} onFechar={() => setUsuarioSelecionado(null)} />
        </div>
    );
}