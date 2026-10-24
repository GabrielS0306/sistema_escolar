import { useState } from 'react';
import { Modal } from './Modal';
import { useDocumentosUsuario } from '../hooks/useDocumentosUsuario';
import { enviarDocumento, getUrlDocumento } from '../services/documentoService';
import { TIPO_DOCUMENTO_LABEL } from '../types/documento';

interface DocumentosUsuarioModalProps {
    usuario: { id: string; nome: string } | null;
    onFechar: () => void;
}

export function DocumentosUsuarioModal({ usuario, onFechar }: DocumentosUsuarioModalProps) {
    const { documentos, carregando, erro, recarregarDados } = useDocumentosUsuario(usuario?.id ?? null);

    const [tipo, setTipo] = useState(0);
    const [descricao, setDescricao] = useState('');
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [enviando, setEnviando] = useState(false);
    const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);
    const [abrindoId, setAbrindoId] = useState<string | null>(null);

    // Muda a cada envio para limpar o <input type="file"> (que não aceita value controlado).
    const [chaveArquivo, setChaveArquivo] = useState(0);

    function handleFechar() {
        setTipo(0);
        setDescricao('');
        setArquivo(null);
        setAviso(null);
        onFechar();
    }

    async function handleEnviar() {
        if (!usuario || !arquivo || descricao.trim() === '') return;

        setEnviando(true);
        setAviso(null);

        try {
            await enviarDocumento(usuario.id, tipo, descricao.trim(), arquivo);

            setDescricao('');
            setArquivo(null);
            setChaveArquivo((n) => n + 1);
            setAviso({ ok: true, texto: 'Documento enviado.' });
            recarregarDados();
        } catch {
            setAviso({ ok: false, texto: 'Não foi possível enviar o documento.' });
        } finally {
            setEnviando(false);
        }
    }

    async function handleAbrir(documentoId: string) {
        // A aba é aberta no clique (antes do await) para o navegador não bloquear como pop-up.
        const janela = window.open('', '_blank');
        setAbrindoId(documentoId);

        try {
            const { url } = await getUrlDocumento(documentoId);

            // Se o navegador bloqueou a aba mesmo assim, abre na própria página.
            (janela ?? window).location.assign(url);
        } catch {
            janela?.close();
            setAviso({ ok: false, texto: 'Não foi possível abrir o documento.' });
        } finally {
            setAbrindoId(null);
        }
    }

    const inputClasses = 'w-full h-11 border border-ink/20 rounded px-3 mb-4 focus:outline-none focus:border-gold';
    const labelClasses = 'block text-sm text-slate mb-1';

    return (
        <Modal aberto={usuario !== null} onFechar={handleFechar} titulo={`Documentos — ${usuario?.nome ?? ''}`}>
            {aviso && (
                <p className={`text-sm rounded px-3 py-2 mb-4 border ${aviso.ok ? 'text-ink bg-gold/10 border-gold/30' : 'text-red-700 bg-red-50 border-red-200'}`}>
                    {aviso.texto}
                </p>
            )}

            <p className="font-serif text-lg text-ink mb-4">Enviar documento</p>

            <label className={labelClasses}>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(Number(e.target.value))} className={inputClasses}>
                {TIPO_DOCUMENTO_LABEL.map((label, valor) => (
                    <option key={valor} value={valor}>{label}</option>
                ))}
            </select>

            <label className={labelClasses}>Descrição</label>
            <input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex.: Atestado de 3 dias — gripe"
                className={inputClasses}
            />

            <label className={labelClasses}>Arquivo</label>
            <input
                key={chaveArquivo}
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-slate mb-5 file:mr-3 file:border file:border-ink/20 file:rounded file:bg-transparent file:px-3 file:py-2 file:text-ink hover:file:border-gold"
            />

            <button
                onClick={handleEnviar}
                disabled={enviando || !arquivo || descricao.trim() === ''}
                className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
            >
                {enviando ? 'Enviando...' : 'Enviar documento'}
            </button>

            <div className="mt-8 pt-6 border-t border-ink/10">
                <p className="font-serif text-lg text-ink mb-4">Histórico</p>

                {carregando && <p className="text-sm text-slate">Carregando...</p>}
                {erro && <p className="text-sm text-red-600">Erro: {erro}</p>}

                {!carregando && !erro && (
                    documentos.length === 0 ? (
                        <p className="text-sm text-slate">Nenhum documento enviado ainda.</p>
                    ) : (
                        <ul className="border-t border-ink/10">
                            {documentos.map((d) => (
                                <li key={d.id} className="flex items-start justify-between gap-4 py-3 border-b border-ink/10">
                                    <div className="min-w-0">
                                        <p className="text-ink">{d.descricao}</p>
                                        <p className="text-xs text-slate mt-0.5">
                                            <span className="text-gold">{TIPO_DOCUMENTO_LABEL[d.tipo]}</span>
                                            {' · '}{new Date(d.data).toLocaleDateString('pt-BR')}
                                            {' · '}por {d.registradoPor}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleAbrir(d.id)}
                                        disabled={abrindoId === d.id}
                                        className="text-sm text-ink hover:text-gold shrink-0 disabled:opacity-50"
                                    >
                                        {abrindoId === d.id ? 'Abrindo...' : 'Abrir'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )
                )}
            </div>
        </Modal>
    );
}
