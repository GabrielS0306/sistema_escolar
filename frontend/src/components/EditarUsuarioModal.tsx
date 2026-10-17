import { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { getUsuario, atualizarUsuarioAdmin, redefinirSenhaUsuario } from '../services/usuarioService';
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

    const [novaSenha, setNovaSenha] = useState('');
    const [redefinindo, setRedefinindo] = useState(false);
    const [avisoSenha, setAvisoSenha] = useState<{ ok: boolean; texto: string } | null>(null);

    const fotoPreview = useMemo(() => (foto ? URL.createObjectURL(foto) : null), [foto]);

    useEffect(() => {
        if (!usuarioId) return;

        let cancelado = false;

        (async () => {
            setCarregando(true);
            setErro(null);
            setSucesso(false);
            setNovaSenha('');
            setAvisoSenha(null);

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

    async function handleRedefinirSenha() {
        if (!usuarioId || novaSenha.length < 6) return;
        setRedefinindo(true);
        setAvisoSenha(null);

        try {
            await redefinirSenhaUsuario(usuarioId, novaSenha);
            setNovaSenha('');
            setAvisoSenha({ ok: true, texto: 'Senha redefinida. Informe a nova senha ao usuário.' });
        } catch {
            setAvisoSenha({ ok: false, texto: 'Não foi possível redefinir a senha.' });
        } finally {
            setRedefinindo(false);
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

            {usuario && !carregando && (
                <div className="mt-8 pt-6 border-t border-ink/10">
                    <p className="font-serif text-lg text-ink">Redefinir senha</p>
                    <p className="text-sm text-slate mt-1 mb-4">
                        Para quando o usuário esquecer a senha. A senha atual deixa de valer na hora.
                    </p>

                    {avisoSenha && (
                        <p className={`text-sm rounded px-3 py-2 mb-4 border ${avisoSenha.ok ? 'text-ink bg-gold/10 border-gold/30' : 'text-red-700 bg-red-50 border-red-200'}`}>
                            {avisoSenha.texto}
                        </p>
                    )}

                    <label className={labelClasses}>Nova senha (mínimo 6 caracteres)</label>
                    <div className="flex gap-3">
                        <input
                            type="password"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            autoComplete="new-password"
                            className="flex-1 h-11 border border-ink/20 rounded px-3 focus:outline-none focus:border-gold"
                        />
                        <button
                            type="button"
                            onClick={handleRedefinirSenha}
                            disabled={redefinindo || novaSenha.length < 6}
                            className="border border-ink text-ink rounded px-5 text-sm font-medium hover:bg-ink/5 disabled:opacity-50"
                        >
                            {redefinindo ? 'Redefinindo...' : 'Redefinir'}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}