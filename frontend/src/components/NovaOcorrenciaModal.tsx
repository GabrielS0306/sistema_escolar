import { useState } from 'react';
import { Modal } from './Modal';
import { criarOcorrencia } from '../services/ocorrenciaTurmaService';
import { TIPO_OCORRENCIA_LABEL } from '../types/ocorrencia';
import type { Aluno } from '../types/aluno';

const TIPO_ATRASO = 2;

interface NovaOcorrenciaModalProps {
    aberto: boolean;
    onFechar: () => void;
    onRegistrada: () => void;
    alunos: Aluno[];
    // Quando aberto a partir de um aluno específico, já vem selecionado.
    alunoInicialId?: string;
}

export function NovaOcorrenciaModal(props: NovaOcorrenciaModalProps) {
    // A key remonta o formulário a cada abertura, então o estado inicial (aluno pré-selecionado) sempre vale.
    if (!props.aberto) return null;

    return <Formulario key={props.alunoInicialId ?? 'novo'} {...props} />;
}

function Formulario({ aberto, onFechar, onRegistrada, alunos, alunoInicialId }: NovaOcorrenciaModalProps) {
    const [alunoId, setAlunoId] = useState(alunoInicialId ?? '');
    const [tipo, setTipo] = useState(TIPO_ATRASO);
    const [descricao, setDescricao] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const podeRegistrar = alunoId !== '' && descricao.trim() !== '';

    async function handleRegistrar() {
        if (!podeRegistrar) return;

        setSalvando(true);
        setErro(null);

        try {
            await criarOcorrencia({ alunoId, tipo, descricao: descricao.trim() });
            onRegistrada();
        } catch {
            setErro('Não foi possível registrar a ocorrência.');
        } finally {
            setSalvando(false);
        }
    }

    const inputClasses = 'w-full h-11 border border-ink/20 rounded px-3 mb-4 focus:outline-none focus:border-gold';

    return (
        <Modal aberto={aberto} onFechar={onFechar} titulo="Registrar ocorrência">
            {erro && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{erro}</p>
            )}

            <label className="block text-sm text-slate mb-1">Aluno</label>
            <select value={alunoId} onChange={(e) => setAlunoId(e.target.value)} className={inputClasses}>
                <option value="">Selecione um aluno</option>
                {alunos.map((a) => (
                    <option key={a.id} value={a.id}>{a.nomeUsuario} · {a.matricula}</option>
                ))}
            </select>

            <label className="block text-sm text-slate mb-1">Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(Number(e.target.value))} className={inputClasses}>
                {TIPO_OCORRENCIA_LABEL.map((label, valor) => (
                    <option key={valor} value={valor}>{label}</option>
                ))}
            </select>

            <label className="block text-sm text-slate mb-1">Descrição</label>
            <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                placeholder="Ex.: Chegou às 7h40, 25 minutos após o início da aula."
                className="w-full border border-ink/20 rounded px-3 py-2 mb-6 focus:outline-none focus:border-gold"
            />

            <button
                onClick={handleRegistrar}
                disabled={salvando || !podeRegistrar}
                className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
            >
                {salvando ? 'Registrando...' : 'Confirmar registro'}
            </button>
        </Modal>
    );
}
