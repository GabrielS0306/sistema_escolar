import { useState } from 'react';
import { Modal } from './Modal';
import { criarOcorrencia } from '../services/ocorrenciaTurmaService';
import { mensagemDeErro } from '../services/api';
import { TIPO_OCORRENCIA_LABEL } from '../types/ocorrencia';
import type { Aluno } from '../types/aluno';
import { Button } from './ui/Button';
import { Textarea } from './ui/Campo';
import { CampoSelecaoBusca } from './ui/CampoSelecaoBusca';
import { EstadoErro } from './ui/Estrutura';

const TIPO_ATRASO = 2;

interface NovaOcorrenciaModalProps {
    aberto: boolean;
    onFechar: () => void;
    onRegistrada: () => void;
    alunos: Aluno[];
    // Quando aberto a partir de um aluno específico, já vem selecionado.
    alunoInicialId?: string;
    tipoInicial?: number;
    titulo?: string;
}

export function NovaOcorrenciaModal(props: NovaOcorrenciaModalProps) {
    // A key remonta o formulário a cada abertura, então o estado inicial (aluno pré-selecionado) sempre vale.
    if (!props.aberto) return null;

    return <Formulario key={props.alunoInicialId ?? 'novo'} {...props} />;
}

function Formulario({ aberto, onFechar, onRegistrada, alunos, alunoInicialId, tipoInicial = TIPO_ATRASO, titulo = 'Registrar ocorrência' }: NovaOcorrenciaModalProps) {
    const [alunoId, setAlunoId] = useState(alunoInicialId ?? '');
    const [tipo, setTipo] = useState(tipoInicial);
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
        } catch (err) {
            setErro(mensagemDeErro(err, 'Não foi possível registrar a ocorrência.'));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Modal aberto={aberto} onFechar={onFechar} titulo={titulo}>
            {erro && <div className="mb-4"><EstadoErro mensagem={erro} /></div>}

            <CampoSelecaoBusca
                label="Aluno"
                opcoes={alunos.map((a) => ({ id: a.id, titulo: a.nomeUsuario, subtitulo: `Matrícula ${a.matricula}` }))}
                valor={alunoId}
                onChange={setAlunoId}
                placeholder="Digite o nome ou a matrícula..."
                autoFocus={!alunoInicialId}
            />

            {/* Tipo em botões: são poucos e escolher com um toque é mais rápido que abrir uma lista. */}
            <p className="text-sm font-medium text-ink mb-1.5">Tipo</p>
            <div className="flex flex-wrap gap-2 mb-4" role="radiogroup" aria-label="Tipo de ocorrência">
                {TIPO_OCORRENCIA_LABEL.map((label, valor) => (
                    <button
                        key={valor}
                        type="button"
                        role="radio"
                        aria-checked={tipo === valor}
                        onClick={() => setTipo(valor)}
                        className={`px-3 h-8 rounded-full text-sm border transition-colors ${
                            tipo === valor
                                ? 'border-gold bg-gold-soft text-ink font-medium'
                                : 'border-line-strong text-slate hover:text-ink'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <Textarea
                label="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                placeholder="Ex.: Chegou às 7h40, 25 minutos após o início da aula."
            />

            <div className="flex justify-end gap-3">
                <Button variante="secundario" onClick={onFechar}>Cancelar</Button>
                <Button onClick={handleRegistrar} carregando={salvando} disabled={!podeRegistrar} icone="check">
                    {salvando ? 'Registrando...' : 'Confirmar registro'}
                </Button>
            </div>
        </Modal>
    );
}
