import { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { getUsuario, atualizarUsuarioAdmin } from '../services/usuarioService';
import type { UsuarioDetalhado } from '../types/usuario';

interface EditarUsuarioModalProps {
    usuarioId: string | null;
    onFechar: () => void;
}

export function EditarUsuarioModal({ usuarioId, onFechar }: EditarUsuarioModalProps) {
    const [usuario, setUsuario] = useState<UsuarioDetalhado | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState(false);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [endereco, setEndereco] = useState('');
    const [foto, setFoto] = useState<File | null>(null);

    const fotoPreview = useMemo(() => (foto ? URL.createObjectURL(foto) : null), [foto]);

    useEffect(() => {
        if (!usuarioId) return;

        let cancelado = false;

        (async () => {
            setCarregando(true);
            setErro(null);
            setSucesso(false);

            try {
                const dados = await getUsuario(usuarioId);

                if (!cancelado) {
                    setUsuario(dados);
                    setNome(dados.nome);
                    setEmail(dados.email);
                    setTelefone(dados.telefone ?? '');
                    setCpf(dados.cpf ?? '');
                    setEndereco(dados.endereco ?? '');
                }
            } catch {
                if (!cancelado) setErro('Não foi possível carregar o usuário.');
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })
    ();

    return () => { cancelado = true; };
}, [usuarioId]);

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        if (!usuarioId) return;
        setSalvando(true);
        setErro(null);

        try {
            const atualizado = await atualizarUsuarioAdmin(usuarioId, { nome, email, telefone, cpf, endereco, foto });
            setUsuario(atualizado);
            setFoto(null);
            setSucesso(true);
        } catch {
            setErro('Não foi possível salvar as alterações.');
        } finally {
            setSalvando(false);
        }
    }

    const inputClasses = 'w-full h-11 border border-ink/20 rounded px-3 mb-4 focus:outline-none focus:border-gold';
    const labelClasses = 'block text-sm text-slate mb-1';

    return (
        <Modal aberto={!!usuarioId} onFechar={onFechar} titulo="Editar usuário">
            {carregando && <p className="text-sm text-slate">Carregando...</p>}
            {erro && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{erro}</p>}
            {sucesso && <p className="text-sm text-ink bg-gold/10 border border-gold/30 rounded px-3 py-2 mb-4">Alterações salvas.</p>}

            {usuario && !carregando && (
                <form onSubmit={handleSalvar}>
                    <div className="flex items-center gap-4 mb-6">
                        <img
                            src={fotoPreview ?? usuario.fotoPerfilUrl ?? undefined}
                            className="w-16 h-16 rounded-full object-cover bg-ink/10"
                        />
                        <label className="text-sm text-gold cursor-pointer hover:underline">
                            Trocar foto

                            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} />
                        </label>
                    </div>

                    <label className={labelClasses}>Nome</label>
                    <input value={nome} onChange={(e) => setNome(e.target.value)} className={inputClasses} />

                    <label className={labelClasses}>Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} />

                    <label className={labelClasses}>Telefone</label>
                    <input value={telefone} onChange={(e) => setTelefone(e.target.value)} className={inputClasses} />

                    <label className={labelClasses}>CPF</label>
                    <input value={cpf} onChange={(e) => setCpf(e.target.value)} className={inputClasses} />

                    <label className={labelClasses}>Endereço</label>
                    <input value={endereco} onChange={(e) => setEndereco(e.target.value)} className={inputClasses} />

                    <button type="submit" disabled={salvando} className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50 mt-2">
                        {salvando ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                </form>
            )}
        </Modal>
    );
}