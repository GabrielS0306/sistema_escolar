import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAlunosPorTurma } from '../../hooks/useAlunosPorTurma';
import { useNotasTurma } from '../../hooks/useNotasTurma';
import { useToast } from '../../hooks/useToast';
import { criarAvaliacao } from '../../services/avaliacaoService';
import { lancarNotas } from '../../services/notaProfessorService';
import { mensagemDeErro } from '../../services/api';
import { Modal } from '../../components/Modal';
import { BarraFerramentas, Carregando, EstadoErro, EstadoVazio, Aviso } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CampoBusca, Input, Select } from '../../components/ui/Campo';
import { Avatar } from '../../components/ui/Avatar';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td } from '../../components/ui/Tabela';
import { lerNota, NOTA_MINIMA } from '../../utils/notas';

const TIPOS_AVALIACAO = [
    { value: 0, label: 'Comportamento' },
    { value: 1, label: 'Atividade' },
    { value: 2, label: 'Prova Bimestral' },
];

export function AbaNotas() {
    const toast = useToast();
    const { turmaId } = useParams<{ turmaId: string }>();
    const [searchParams] = useSearchParams();
    const vinculoId = searchParams.get('vinculo');

    const { alunos } = useAlunosPorTurma(turmaId);
    const { notas, carregando, erro, recarregarDados } = useNotasTurma(vinculoId);

    const [busca, setBusca] = useState('');
    const [bimestreFiltro, setBimestreFiltro] = useState(0);  // 0 = todos
    const [modalAberto, setModalAberto] = useState(false);

    const [bimestre, setBimestre] = useState(1);
    const [tipoAvaliacao, setTipoAvaliacao] = useState(0);
    const [nomeAvaliacao, setNomeAvaliacao] = useState('');
    const [dataAvaliacao, setDataAvaliacao] = useState(new Date().toISOString().slice(0, 10));
    const [notasForm, setNotasForm] = useState<Record<string, string>>({});
    const [salvando, setSalvando] = useState(false);
    const [erroModal, setErroModal] = useState<string | null>(null);

    const notasFiltradas = notas
        .filter((n) => n.nomeAluno.toLowerCase().includes(busca.toLowerCase()))
        .filter((n) => bimestreFiltro === 0 || n.bimestre === bimestreFiltro)
        .sort((a, b) => a.bimestre - b.bimestre || a.nomeAluno.localeCompare(b.nomeAluno));

    // Notas digitadas no modal: vazias são ignoradas; preenchidas precisam ser válidas.
    const preenchidas = alunos.filter((a) => (notasForm[a.alunoId] ?? '').trim() !== '');
    const invalidas = preenchidas.filter((a) => lerNota(notasForm[a.alunoId]) === null);
    const podeLancar = nomeAvaliacao.trim() !== '' && preenchidas.length > 0 && invalidas.length === 0;

    function abrirModal() {
        setNotasForm({});
        setNomeAvaliacao('');
        setErroModal(null);
        setModalAberto(true);
    }

    async function handleLancarNotas() {
        if (!vinculoId || !podeLancar) return;

        setSalvando(true);
        setErroModal(null);

        try {
            // Valida antes de criar a avaliação: antes, um lançamento sem notas deixava uma avaliação vazia no banco.
            const notasParaEnviar = preenchidas.map((a) => ({ alunoId: a.alunoId, valor: lerNota(notasForm[a.alunoId])! }));

            const avaliacao = await criarAvaliacao({
                professorTurmaDisciplinaId: vinculoId,
                bimestre,
                tipo: tipoAvaliacao,
                nome: nomeAvaliacao.trim(),
                data: new Date(dataAvaliacao).toISOString(),
            });

            await lancarNotas({ avaliacaoId: avaliacao.id, notas: notasParaEnviar });

            toast.sucesso(`${notasParaEnviar.length} ${notasParaEnviar.length === 1 ? 'nota lançada' : 'notas lançadas'} em "${nomeAvaliacao.trim()}".`);
            setModalAberto(false);
            recarregarDados();
        } catch (err) {
            setErroModal(mensagemDeErro(err, 'Não foi possível lançar as notas.'));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <Card semPadding>
                <div className="p-4">
                    <BarraFerramentas>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por aluno..." />
                            <Select value={bimestreFiltro} onChange={(e) => setBimestreFiltro(Number(e.target.value))} className="sm:w-44" aria-label="Bimestre">
                                <option value={0}>Todos os bimestres</option>
                                {[1, 2, 3, 4].map((b) => <option key={b} value={b}>{b}º bimestre</option>)}
                            </Select>
                        </div>
                        <Button icone="mais" onClick={abrirModal} disabled={alunos.length === 0}>Lançar notas</Button>
                    </BarraFerramentas>
                </div>

                {carregando && <Carregando />}
                {erro && <div className="px-4 pb-4"><EstadoErro mensagem={erro} /></div>}

                {!carregando && !erro && (
                    notasFiltradas.length === 0 ? (
                        <EstadoVazio
                            icone="notas"
                            titulo={busca || bimestreFiltro ? 'Nenhuma nota encontrada' : 'Nenhuma nota lançada ainda'}
                            descricao={busca || bimestreFiltro ? undefined : 'Cada bimestre precisa de 3 avaliações: Comportamento, Atividade e Prova Bimestral.'}
                        />
                    ) : (
                        <Tabela>
                            <TabelaCabecalho>
                                <Th>Aluno</Th>
                                <Th>Bimestre</Th>
                                <Th>Avaliação</Th>
                                <Th className="text-right">Nota</Th>
                            </TabelaCabecalho>
                            <TabelaCorpo>
                                {notasFiltradas.map((n) => (
                                    <Tr key={n.id}>
                                        <Td className="font-medium">{n.nomeAluno}</Td>
                                        <Td><Badge>{n.bimestre}º</Badge></Td>
                                        <Td className="text-slate">{n.nomeAvaliacao}</Td>
                                        <Td className={`text-right font-semibold tabular-nums ${n.valor < NOTA_MINIMA ? 'text-danger' : ''}`}>
                                            {n.valor.toFixed(1)}
                                        </Td>
                                    </Tr>
                                ))}
                            </TabelaCorpo>
                        </Tabela>
                    )
                )}
            </Card>

            <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Lançar notas" tamanho="lg">
                {erroModal && <div className="mb-4"><EstadoErro mensagem={erroModal} /></div>}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4">
                    <Select label="Bimestre" value={bimestre} onChange={(e) => setBimestre(Number(e.target.value))}>
                        {[1, 2, 3, 4].map((b) => <option key={b} value={b}>{b}º</option>)}
                    </Select>
                    <Select label="Tipo" value={tipoAvaliacao} onChange={(e) => setTipoAvaliacao(Number(e.target.value))}>
                        {TIPOS_AVALIACAO.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </Select>
                    <Input label="Nome" value={nomeAvaliacao} onChange={(e) => setNomeAvaliacao(e.target.value)} placeholder="Ex.: AV1" />
                    <Input label="Data" type="date" value={dataAvaliacao} onChange={(e) => setDataAvaliacao(e.target.value)} />
                </div>

                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-ink">Notas</p>
                    <p className="text-xs text-slate">
                        {preenchidas.length} de {alunos.length} preenchidas · de 0 a 10, aceita vírgula
                    </p>
                </div>

                <ul className="divide-y divide-line border-y border-line mb-4">
                    {alunos.map((a) => {
                        const texto = notasForm[a.alunoId] ?? '';
                        const invalida = texto.trim() !== '' && lerNota(texto) === null;

                        return (
                            <li key={a.alunoId} className="flex items-center justify-between gap-3 py-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Avatar nome={a.nomeAluno} />
                                    <span className="text-sm truncate">{a.nomeAluno}</span>
                                </div>
                                <input
                                    value={texto}
                                    onChange={(e) => setNotasForm((prev) => ({ ...prev, [a.alunoId]: e.target.value }))}
                                    inputMode="decimal"
                                    placeholder="—"
                                    aria-label={`Nota de ${a.nomeAluno}`}
                                    aria-invalid={invalida || undefined}
                                    className={`w-20 h-9 rounded-lg border bg-surface text-center text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-gold/25 ${
                                        invalida ? 'border-danger text-danger' : 'border-line-strong focus:border-gold'
                                    }`}
                                />
                            </li>
                        );
                    })}
                </ul>

                {invalidas.length > 0 && (
                    <div className="mb-4">
                        <Aviso tom="perigo">
                            {invalidas.length === 1 ? 'Há 1 nota inválida' : `Há ${invalidas.length} notas inválidas`}. Use valores de 0 a 10.
                        </Aviso>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <Button variante="secundario" onClick={() => setModalAberto(false)}>Cancelar</Button>
                    <Button onClick={handleLancarNotas} carregando={salvando} disabled={!podeLancar} icone="check">
                        {salvando ? 'Lançando...' : 'Confirmar lançamento'}
                    </Button>
                </div>
            </Modal>
        </>
    );
}
