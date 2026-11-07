import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAlunosPorTurma } from '../../hooks/useAlunosPorTurma';
import { useFrequenciaTurma } from '../../hooks/useFrequenciaTurma';
import { useToast } from '../../hooks/useToast';
import { registrarChamada } from '../../services/frequenciaProfessorService';
import { mensagemDeErro } from '../../services/api';
import { Modal } from '../../components/Modal';
import { BarraFerramentas, Carregando, EstadoErro, EstadoVazio } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CampoBusca } from '../../components/ui/Campo';
import { Avatar } from '../../components/ui/Avatar';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td } from '../../components/ui/Tabela';
import { dataCurta } from '../../utils/datas';

export function AbaFrequencia() {
    const toast = useToast();
    const { turmaId } = useParams<{ turmaId: string }>();
    const [searchParams] = useSearchParams();
    const vinculoId = searchParams.get('vinculo');

    const { alunos } = useAlunosPorTurma(turmaId);
    const { frequencias, carregando, erro, recarregarDados } = useFrequenciaTurma(vinculoId);

    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [presencas, setPresencas] = useState<Record<string, boolean>>({});
    const [salvando, setSalvando] = useState(false);
    const [erroModal, setErroModal] = useState<string | null>(null);

    const frequenciasFiltradas = frequencias
        .filter((f) => f.nomeAluno.toLowerCase().includes(busca.toLowerCase()))
        .sort((a, b) => b.data.localeCompare(a.data));

    // Todo mundo começa presente: o professor só marca quem faltou.
    const estaPresente = (alunoId: string) => presencas[alunoId] ?? true;
    const totalFaltas = alunos.filter((a) => !estaPresente(a.alunoId)).length;

    function marcar(alunoId: string, presente: boolean) {
        setPresencas((prev) => ({ ...prev, [alunoId]: presente }));
    }

    function abrirChamada() {
        setPresencas({});
        setErroModal(null);
        setModalAberto(true);
    }

    async function handleRegistrarChamada() {
        if (!vinculoId) return;

        setSalvando(true);
        setErroModal(null);

        try {
            await registrarChamada({
                professorTurmaDisciplinaId: vinculoId,
                data: new Date().toISOString(),
                presencas: alunos.map((a) => ({ alunoId: a.alunoId, presente: estaPresente(a.alunoId) })),
            });

            toast.sucesso(`Chamada registrada: ${alunos.length - totalFaltas} presentes, ${totalFaltas} ${totalFaltas === 1 ? 'falta' : 'faltas'}.`);
            setModalAberto(false);
            recarregarDados();
        } catch (err) {
            setErroModal(mensagemDeErro(err, 'Não foi possível registrar a chamada.'));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <Card semPadding>
                <div className="p-4">
                    <BarraFerramentas>
                        <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por aluno..." />
                        <Button icone="frequencia" onClick={abrirChamada} disabled={alunos.length === 0}>Fazer chamada de hoje</Button>
                    </BarraFerramentas>
                </div>

                {carregando && <Carregando />}
                {erro && <div className="px-4 pb-4"><EstadoErro mensagem={erro} /></div>}

                {!carregando && !erro && (
                    frequenciasFiltradas.length === 0 ? (
                        <EstadoVazio
                            icone="frequencia"
                            titulo={busca ? 'Nenhum registro encontrado' : 'Nenhuma chamada registrada ainda'}
                            descricao={busca ? undefined : 'Clique em "Fazer chamada de hoje" para registrar a primeira.'}
                        />
                    ) : (
                        <Tabela>
                            <TabelaCabecalho>
                                <Th>Aluno</Th>
                                <Th>Data</Th>
                                <Th>Presença</Th>
                            </TabelaCabecalho>
                            <TabelaCorpo>
                                {frequenciasFiltradas.map((f) => (
                                    <Tr key={f.id}>
                                        <Td className="font-medium">{f.nomeAluno}</Td>
                                        <Td className="text-slate tabular-nums">{dataCurta(f.data)}</Td>
                                        <Td>
                                            {f.presente
                                                ? <Badge tom="sucesso" comPonto>Presente</Badge>
                                                : <Badge tom="perigo" comPonto>Falta</Badge>}
                                        </Td>
                                    </Tr>
                                ))}
                            </TabelaCorpo>
                        </Tabela>
                    )
                )}
            </Card>

            <Modal
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                titulo="Chamada de hoje"
                descricao={new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            >
                {erroModal && <div className="mb-4"><EstadoErro mensagem={erroModal} /></div>}

                <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-sm">
                        <span className="font-semibold text-success">{alunos.length - totalFaltas} presentes</span>
                        <span className="text-slate"> · </span>
                        <span className={`font-semibold ${totalFaltas > 0 ? 'text-danger' : 'text-slate'}`}>
                            {totalFaltas} {totalFaltas === 1 ? 'falta' : 'faltas'}
                        </span>
                    </p>
                    <Button tamanho="sm" variante="fantasma" onClick={() => setPresencas({})} disabled={totalFaltas === 0}>
                        Todos presentes
                    </Button>
                </div>

                <ul className="divide-y divide-line border-y border-line mb-5">
                    {alunos.map((a) => {
                        const presente = estaPresente(a.alunoId);

                        return (
                            <li key={a.alunoId} className="flex items-center justify-between gap-3 py-2.5">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Avatar nome={a.nomeAluno} />
                                    <span className={`text-sm truncate ${presente ? 'text-ink' : 'text-danger font-medium'}`}>{a.nomeAluno}</span>
                                </div>

                                <div className="inline-flex rounded-lg bg-surface-muted p-0.5 shrink-0" role="radiogroup" aria-label={`Presença de ${a.nomeAluno}`}>
                                    <button
                                        role="radio"
                                        aria-checked={presente}
                                        onClick={() => marcar(a.alunoId, true)}
                                        className={`px-3 h-8 rounded-md text-xs font-medium transition-colors ${
                                            presente ? 'bg-success text-white shadow-card' : 'text-slate hover:text-ink'
                                        }`}
                                    >
                                        Presente
                                    </button>
                                    <button
                                        role="radio"
                                        aria-checked={!presente}
                                        onClick={() => marcar(a.alunoId, false)}
                                        className={`px-3 h-8 rounded-md text-xs font-medium transition-colors ${
                                            !presente ? 'bg-danger text-white shadow-card' : 'text-slate hover:text-ink'
                                        }`}
                                    >
                                        Falta
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <div className="flex justify-end gap-3">
                    <Button variante="secundario" onClick={() => setModalAberto(false)}>Cancelar</Button>
                    <Button onClick={handleRegistrarChamada} carregando={salvando} icone="check">
                        {salvando ? 'Registrando...' : 'Confirmar chamada'}
                    </Button>
                </div>
            </Modal>
        </>
    );
}
