import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAlunosPorTurma } from '../../hooks/useAlunosPorTurma';
import { useOcorrenciasTurma } from '../../hooks/useOcorrenciasTurma';
import { useToast } from '../../hooks/useToast';
import { NovaOcorrenciaModal } from '../../components/NovaOcorrenciaModal';
import { TabelaOcorrencias } from '../../components/TabelaOcorrencias';
import { BarraFerramentas, Carregando, EstadoErro } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CampoBusca } from '../../components/ui/Campo';

const TIPO_DISCIPLINAR = 0;

export function AbaObservacoes() {
    const toast = useToast();
    const { turmaId } = useParams<{ turmaId: string }>();
    const { alunos } = useAlunosPorTurma(turmaId);
    const { ocorrencias, carregando, erro, recarregarDados } = useOcorrenciasTurma(turmaId);

    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);

    const filtradas = ocorrencias.filter((o) =>
        `${o.nomeAluno} ${o.descricao}`.toLowerCase().includes(busca.toLowerCase())
    );

    // O modal compartilhado espera o formato da lista geral de alunos.
    const alunosDaTurma = alunos.map((a) => ({ id: a.alunoId, nomeUsuario: a.nomeAluno, matricula: a.matricula }));

    return (
        <>
            <Card semPadding>
                <div className="p-4">
                    <BarraFerramentas>
                        <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por aluno ou descrição..." />
                        <Button icone="mais" onClick={() => setModalAberto(true)} disabled={alunos.length === 0}>
                            Registrar observação
                        </Button>
                    </BarraFerramentas>
                </div>

                {carregando && <Carregando />}
                {erro && <div className="px-4 pb-4"><EstadoErro mensagem={erro} /></div>}
                {!carregando && !erro && (
                    <TabelaOcorrencias
                        ocorrencias={filtradas}
                        mensagemVazia={busca ? 'Nenhuma observação encontrada' : 'Nenhuma observação registrada nessa turma'}
                    />
                )}
            </Card>

            <NovaOcorrenciaModal
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                onRegistrada={() => {
                    setModalAberto(false);
                    toast.sucesso('Observação registrada.');
                    recarregarDados();
                }}
                alunos={alunosDaTurma}
                tipoInicial={TIPO_DISCIPLINAR}
                titulo="Registrar observação"
            />
        </>
    );
}
