import { useState } from 'react';
import { useUsuarios } from '../../hooks/useUsuarios';
import { EditarUsuarioModal } from '../../components/EditarUsuarioModal';
import { DocumentosUsuarioModal } from '../../components/DocumentosUsuarioModal';

export function ListaUsuarios() {
    const { usuarios, carregando, erro } = useUsuarios();
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<string | null>(null);
    const [usuarioDocumentos, setUsuarioDocumentos] = useState<{ id: string; nome: string } | null>(null);

    if (carregando) return <p className="text-slate p-12">Carregando...</p>;
    if (erro) return <p className="text-red-600 p-12">Erro: {erro}</p>;

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Gestão de acesso</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Usuários</h1>

            <div className="mt-10 border-t border-ink/10 divide-y divide-ink/10">
                {usuarios.map((u) => (
                    <div key={u.id} className="flex items-center justify-between py-4">
                        <div>
                            <p className="text-ink">{u.nome}</p>
                            <p className="text-sm text-slate">{u.email}</p>
                        </div>

                        <div className="flex items-center gap-5 text-sm">
                            <button onClick={() => setUsuarioSelecionado(u.id)} className="text-slate hover:text-gold transition-colors">
                                Editar
                            </button>
                            <button
                                onClick={() => setUsuarioDocumentos({ id: u.id, nome: u.nome })}
                                className="text-slate hover:text-gold transition-colors"
                            >
                                Documentos
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <EditarUsuarioModal usuarioId={usuarioSelecionado} onFechar={() => setUsuarioSelecionado(null)} />
            <DocumentosUsuarioModal usuario={usuarioDocumentos} onFechar={() => setUsuarioDocumentos(null)} />
        </div>
    );
}
