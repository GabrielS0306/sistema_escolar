import { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { getMe, atualizarMe } from '../services/authService';
import type { UsuarioDetalhado } from '../types/usuario';

interface PerfilModalProps {
    aberto: boolean;
    onFechar: () => void;
}

export function PerfilModal({ aberto, onFechar }: PerfilModalProps) {
    const [usuario, setUsuario] = useState<UsuarioDetalhado | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [foto, setFoto] = useState<File | null>(null);

    const fotoPreview = useMemo(() => (foto ? URL.createObjectURL(foto) : null), [foto]);

    useEffect(() => {
        if (!aberto) return;

        let cancelado = false;

        (async () => {
            setCarregando(true);
            setErro(null);

            try {
                const dados = await getMe();

                if (!cancelado) {
                    setUsuario(dados);
                    setTelefone(dados.telefone ?? '');
                    setEndereco(dados.endereco ?? '');
                }
            } catch {
                if (!cancelado) setErro('Não foi possível carregar o perfil.');
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

        return () => { cancelado = true; };
    }, [aberto]);

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        setSalvando(true);
        setErro(null);

        try {
            const atualizado = await atualizarMe({ telefone, endereco, foto });
            setUsuario(atualizado);
            setFoto(null);
        } catch {
            setErro('Não foi possível salvar as alterações.');
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Modal aberto={aberto} onFechar={onFechar} titulo="Meu perfil">
            {carregando && <p className="text-sm text-slate">Carregando...</p>}
            {erro && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{erro}</p>
            )}

            {usuario && !carregando && (
                <form onSubmit={handleSalvar}>
                    <div className="flex items-center gap-4 mb-6">
                        <img
                            src={fotoPreview ?? usuario.fotoPerfilUrl ?? undefined}
                            className="w-16 h-16 rounded-full object-cover bg-ink/10"
                        />
                        <label className="text-sm text-gold cursor-pointer hover:underline">
                            Trocar foto

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                            />
                        </label>
                    </div>

                    <p className="text-sm text-slate mb-1">Nome</p>
                    <p className="text-ink mb-4">{usuario.nome}</p>

                    <p className="text-sm text-slate mb-1">Email</p>
                    <p className="text-ink mb-4">{usuario.email}</p>

                    <label className="block text-sm text-slate mb-1">Telefone</label>
                    <input
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className="w-full border border-ink/20 rounded px-3 py-2 mb-4 focus:outline-none focus:border-gold"
                    />

                    <label className="block text-sm text-slate mb-1">Endereço</label>
                    <input
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        className="w-full border border-ink/20 rounded px-3 py-2 mb-6 focus:outline-none focus:border-gold"
                    />

                    <button
                        type="submit"
                        disabled={salvando}
                        className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
                    >
                        {salvando ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                </form>
            )}
        </Modal>
    );
}