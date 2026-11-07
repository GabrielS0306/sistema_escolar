import { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { getUsuario, atualizarUsuarioAdmin, redefinirSenhaUsuario } from '../services/usuarioService';
import { mensagemDeErro } from '../services/api';
import { useToast } from '../hooks/useToast';
import type { UsuarioDetalhado } from '../types/usuario';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { Input } from './ui/Campo';
import { Carregando, EstadoErro } from './ui/Estrutura';

interface EditarUsuarioModalProps {
    usuarioId: string | null;
    onFechar: () => void;
}

export function EditarUsuarioModal({ usuarioId, onFechar }: EditarUsuarioModalProps) {
    const toast = useToast();
    const [usuario, setUsuario] = useState<UsuarioDetalhado | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [endereco, setEndereco] = useState('');
    const [foto, setFoto] = useState<File | null>(null);

    const [novaSenha, setNovaSenha] = useState('');
    const [redefinindo, setRedefinindo] = useState(false);

    const fotoPreview = useMemo(() => (foto ? URL.createObjectURL(foto) : null), [foto]);

    useEffect(() => {
        if (!usuarioId) return;

        let cancelado = false;

        (async () => {
            setCarregando(true);
            setErro(null);
            setNovaSenha('');
            setFoto(null);

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
            } catch (err) {
                if (!cancelado) setErro(mensagemDeErro(err, 'Não foi possível carregar o usuário.'));
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

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
            toast.sucesso('Alterações salvas.');
        } catch (err) {
            setErro(mensagemDeErro(err, 'Não foi possível salvar as alterações.'));
        } finally {
            setSalvando(false);
        }
    }

    async function handleRedefinirSenha() {
        if (!usuarioId || novaSenha.length < 6) return;
        setRedefinindo(true);

        try {
            await redefinirSenhaUsuario(usuarioId, novaSenha);
            setNovaSenha('');
            toast.sucesso('Senha redefinida. Informe a nova senha ao usuário.');
        } catch (err) {
            toast.erro(mensagemDeErro(err, 'Não foi possível redefinir a senha.'));
        } finally {
            setRedefinindo(false);
        }
    }

    return (
        <Modal aberto={!!usuarioId} onFechar={onFechar} titulo="Editar usuário" descricao={usuario?.email}>
            {carregando && <Carregando />}
            {erro && <div className="mb-4"><EstadoErro mensagem={erro} /></div>}

            {usuario && !carregando && (
                <>
                    <form onSubmit={handleSalvar}>
                        <div className="flex items-center gap-4 mb-6">
                            {fotoPreview || usuario.fotoPerfilUrl ? (
                                <img src={fotoPreview ?? usuario.fotoPerfilUrl ?? undefined} alt="" className="w-16 h-16 rounded-full object-cover" />
                            ) : (
                                <span className="scale-150 origin-left ml-2"><Avatar nome={usuario.nome} tamanho="md" /></span>
                            )}
                            <label className="text-sm font-medium text-gold cursor-pointer hover:underline ml-2">
                                Trocar foto
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} />
                            </label>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-x-4">
                            <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className="sm:col-span-2" />
                            <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Input label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                            <Input label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                            <Input label="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" carregando={salvando}>{salvando ? 'Salvando...' : 'Salvar alterações'}</Button>
                        </div>
                    </form>

                    <div className="mt-6 pt-5 border-t border-line">
                        <p className="font-semibold text-ink">Redefinir senha</p>
                        <p className="text-sm text-slate mt-0.5 mb-4">
                            Para quando o usuário esquecer a senha. A senha atual deixa de valer na hora.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
                            <Input
                                type="password"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                autoComplete="new-password"
                                placeholder="Nova senha (mínimo 6 caracteres)"
                                aria-label="Nova senha"
                                className="flex-1"
                            />
                            <Button
                                variante="secundario"
                                icone="chave"
                                onClick={handleRedefinirSenha}
                                carregando={redefinindo}
                                disabled={novaSenha.length < 6}
                            >
                                Redefinir
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
}
