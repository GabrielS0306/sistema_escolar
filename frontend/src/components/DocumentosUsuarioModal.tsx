import { useState } from 'react';
import { Modal } from './Modal';
import { useDocumentosUsuario } from '../hooks/useDocumentosUsuario';
import { enviarDocumento, getUrlDocumento } from '../services/documentoService';
import { TIPO_DOCUMENTO_LABEL } from '../types/documento';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Icone } from './ui/Icone';
import { Input, Select } from './ui/Campo';
import { Aviso, Carregando, EstadoErro, EstadoVazio } from './ui/Estrutura';

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

    return (
        <Modal aberto={usuario !== null} onFechar={handleFechar} titulo="Documentos" descricao={usuario?.nome} tamanho="lg">
            {aviso && <div className="mb-4"><Aviso tom={aviso.ok ? 'sucesso' : 'perigo'}>{aviso.texto}</Aviso></div>}

            <div className="rounded-xl border border-line bg-surface-muted/40 p-4">
                <p className="font-semibold text-ink mb-3">Enviar documento</p>

                <div className="grid sm:grid-cols-[180px_1fr] gap-x-4">
                    <Select label="Tipo" value={tipo} onChange={(e) => setTipo(Number(e.target.value))}>
                        {TIPO_DOCUMENTO_LABEL.map((label, valor) => (
                            <option key={valor} value={valor}>{label}</option>
                        ))}
                    </Select>
                    <Input
                        label="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Ex.: Atestado de 3 dias — gripe"
                    />
                </div>

                <label className="flex items-center gap-3 rounded-lg border border-dashed border-line-strong bg-surface px-4 py-3 mb-4 cursor-pointer hover:border-gold transition-colors">
                    <Icone nome="upload" className="text-slate" />
                    <span className="text-sm text-slate truncate flex-1">{arquivo ? arquivo.name : 'Escolher arquivo (PDF ou imagem)'}</span>
                    <input
                        key={chaveArquivo}
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
                        className="hidden"
                    />
                </label>

                <div className="flex justify-end">
                    <Button onClick={handleEnviar} carregando={enviando} disabled={!arquivo || descricao.trim() === ''} icone="upload">
                        {enviando ? 'Enviando...' : 'Enviar documento'}
                    </Button>
                </div>
            </div>

            <p className="font-semibold text-ink mt-6 mb-2">Histórico</p>

            {carregando && <Carregando />}
            {erro && <EstadoErro mensagem={erro} />}

            {!carregando && !erro && (
                documentos.length === 0 ? (
                    <EstadoVazio icone="documentos" titulo="Nenhum documento enviado ainda" />
                ) : (
                    <ul className="divide-y divide-line">
                        {documentos.map((d) => (
                            <li key={d.id} className="flex items-center justify-between gap-4 py-3">
                                <div className="flex items-start gap-3 min-w-0">
                                    <span className="w-9 h-9 rounded-lg bg-surface-muted text-slate flex items-center justify-center shrink-0">
                                        <Icone nome="documentos" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-ink truncate">{d.descricao}</p>
                                        <p className="text-xs text-slate mt-0.5 flex flex-wrap items-center gap-x-2">
                                            <Badge tom="destaque">{TIPO_DOCUMENTO_LABEL[d.tipo]}</Badge>
                                            <span>{new Date(d.data).toLocaleDateString('pt-BR')} · por {d.registradoPor}</span>
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    tamanho="sm"
                                    variante="secundario"
                                    icone="abrir"
                                    onClick={() => handleAbrir(d.id)}
                                    carregando={abrindoId === d.id}
                                >
                                    Abrir
                                </Button>
                            </li>
                        ))}
                    </ul>
                )
            )}
        </Modal>
    );
}
