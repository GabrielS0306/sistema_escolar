import { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { getMe, atualizarMe } from '../services/authService';
import { mensagemDeErro } from '../services/api';
import { useToast } from '../hooks/useToast';
import type { UsuarioDetalhado } from '../types/usuario';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { Input } from './ui/Campo';
import { Carregando, EstadoErro } from './ui/Estrutura';

interface PerfilModalProps {
    aberto: boolean;
    onFechar: () => void;
}

export function PerfilModal({ aberto, onFechar }: PerfilModalProps) {
    const toast = useToast();
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
            } catch (err) {
                if (!cancelado) setErro(mensagemDeErro(err, 'Não foi possível carregar o perfil.'));
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
            toast.sucesso('Perfil atualizado.');
        } catch (err) {
            setErro(mensagemDeErro(err, 'Não foi possível salvar as alterações.'));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Modal aberto={aberto} onFechar={onFechar} titulo="Meu perfil">
            {carregando && <Carregando />}
            {erro && <div className="mb-4"><EstadoErro mensagem={erro} /></div>}

            {usuario && !carregando && (
                <form onSubmit={handleSalvar}>
                    <div className="flex items-center gap-4 mb-6">
                        {fotoPreview || usuario.fotoPerfilUrl ? (
                            <img src={fotoPreview ?? usuario.fotoPerfilUrl ?? undefined} alt="" className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                            <span className="scale-150 origin-left ml-2"><Avatar nome={usuario.nome} tamanho="md" /></span>
                        )}
                        <div className="ml-2 min-w-0">
                            <p className="font-semibold text-ink truncate">{usuario.nome}</p>
                            <p className="text-sm text-slate truncate">{usuario.email}</p>
                            <label className="text-sm font-medium text-gold cursor-pointer hover:underline">
                                Trocar foto
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} />
                            </label>
                        </div>
                    </div>

                    <Input label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                    <Input label="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                    <p className="text-xs text-slate mb-5">Nome e e-mail só podem ser alterados pela secretaria.</p>

                    <div className="flex justify-end gap-3">
                        <Button variante="secundario" onClick={onFechar}>Fechar</Button>
                        <Button type="submit" carregando={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
