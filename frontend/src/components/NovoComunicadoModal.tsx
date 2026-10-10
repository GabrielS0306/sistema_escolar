import { useState } from 'react';
import { Modal } from './Modal';
import { criarComunicado } from '../services/comunicadoService';
import { PUBLICO_ALVO_LABEL } from '../types/comunicado';

export interface OpcaoTurma {
    id: string;
    label: string;
}

interface NovoComunicadoModalProps {
    aberto: boolean;
    onFechar: () => void;
    onEnviado: () => void;
    turmas: OpcaoTurma[];
    // Professor só envia para turma; gestão escolhe qualquer público.
    somenteTurma?: boolean;
}

const PUBLICO_TURMA = 1;

export function NovoComunicadoModal({ aberto, onFechar, onEnviado, turmas, somenteTurma = false }: NovoComunicadoModalProps) {
    const [titulo, setTitulo] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [publicoAlvo, setPublicoAlvo] = useState(somenteTurma ? PUBLICO_TURMA : 0);
    const [turmaId, setTurmaId] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const precisaTurma = publicoAlvo === PUBLICO_TURMA;
    const podeEnviar = titulo.trim() !== '' && mensagem.trim() !== '' && (!precisaTurma || turmaId !== '');

    function limpar() {
        setTitulo('');
        setMensagem('');
        setPublicoAlvo(somenteTurma ? PUBLICO_TURMA : 0);
        setTurmaId('');
        setErro(null);
    }

    function handleFechar() {
        limpar();
        onFechar();
    }

    async function handleEnviar() {
        if (!podeEnviar) return;

        setEnviando(true);
        setErro(null);

        try {
            await criarComunicado({
                titulo,
                mensagem,
                publicoAlvo,
                turmaId: precisaTurma ? turmaId : undefined,
            });

            limpar();
            onEnviado();
        } catch {
            setErro('Não foi possível enviar o comunicado.');
        } finally {
            setEnviando(false);
        }
    }

    const inputClasses = 'w-full h-11 border border-ink/20 rounded px-3 mb-4 focus:outline-none focus:border-gold';

    return (
        <Modal aberto={aberto} onFechar={handleFechar} titulo="Novo comunicado">
            {erro && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{erro}</p>
            )}

            <label className="block text-sm text-slate mb-1">Título</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className={inputClasses} />

            {!somenteTurma && (
                <>
                    <label className="block text-sm text-slate mb-1">Público</label>
                    <select
                        value={publicoAlvo}
                        onChange={(e) => setPublicoAlvo(Number(e.target.value))}
                        className={inputClasses}
                    >
                        {PUBLICO_ALVO_LABEL.map((label, valor) => (
                            <option key={valor} value={valor}>{label}</option>
                        ))}
                    </select>
                </>
            )}

            {precisaTurma && (
                <>
                    <label className="block text-sm text-slate mb-1">Turma</label>
                    <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)} className={inputClasses}>
                        <option value="">Selecione uma turma</option>
                        {turmas.map((t) => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                    </select>
                </>
            )}

            <label className="block text-sm text-slate mb-1">Mensagem</label>
            <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows={5}
                className="w-full border border-ink/20 rounded px-3 py-2 mb-6 focus:outline-none focus:border-gold"
            />

            <button
                onClick={handleEnviar}
                disabled={enviando || !podeEnviar}
                className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
            >
                {enviando ? 'Enviando...' : 'Enviar comunicado'}
            </button>
        </Modal>
    );
}
