import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './ui/Button';
import { Input, Select, Textarea } from './ui/Campo';
import { EstadoErro } from './ui/Estrutura';
import { mensagemDeErro } from '../services/api';
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
        } catch (err) {
            setErro(mensagemDeErro(err, 'Não foi possível enviar o comunicado.'));
        } finally {
            setEnviando(false);
        }
    }

    return (
        <Modal
            aberto={aberto}
            onFechar={handleFechar}
            titulo="Novo comunicado"
            descricao={somenteTurma ? 'O comunicado vai para os alunos e responsáveis da turma escolhida.' : undefined}
        >
            {erro && <div className="mb-4"><EstadoErro mensagem={erro} /></div>}

            <Input label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Reunião de pais" autoFocus />

            <div className="grid sm:grid-cols-2 gap-x-4">
                {!somenteTurma && (
                    <Select label="Público" value={publicoAlvo} onChange={(e) => setPublicoAlvo(Number(e.target.value))}>
                        {PUBLICO_ALVO_LABEL.map((label, valor) => (
                            <option key={valor} value={valor}>{label}</option>
                        ))}
                    </Select>
                )}

                {precisaTurma && (
                    <Select label="Turma" value={turmaId} onChange={(e) => setTurmaId(e.target.value)}>
                        <option value="">Selecione uma turma</option>
                        {turmas.map((t) => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                    </Select>
                )}
            </div>

            <Textarea label="Mensagem" value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={5} />

            <div className="flex justify-end gap-3">
                <Button variante="secundario" onClick={handleFechar}>Cancelar</Button>
                <Button onClick={handleEnviar} carregando={enviando} disabled={!podeEnviar} icone="comunicados">
                    {enviando ? 'Enviando...' : 'Enviar comunicado'}
                </Button>
            </div>
        </Modal>
    );
}
