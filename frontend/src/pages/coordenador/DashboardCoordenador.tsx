import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRecuperacao } from '../../hooks/useRecuperacao';
import { useConselhos } from '../../hooks/useConselhos';
import { useTurmas } from '../../hooks/useTurmas';
import { Pagina, PageHeader, StatCard } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Icone, type NomeIcone } from '../../components/ui/Icone';
import { ComunicadosRecentes } from '../../components/ComunicadosRecentes';
import { hojePorExtenso, saudacao } from '../../utils/datas';

function plural(n: number, singular: string, pluralTexto: string) {
    return `${n} ${n === 1 ? singular : pluralTexto}`;
}

interface Pendencia {
    path: string;
    icone: NomeIcone;
    titulo: string;
    descricao: string;
    quantidade: number;
    carregando: boolean;
}

export function DashboardCoordenador() {
    const { sessao } = useAuth();
    const { situacoes, carregando: carregandoRecuperacao } = useRecuperacao();
    const { conselhos, carregando: carregandoConselhos } = useConselhos();
    const { turmas } = useTurmas();

    // Um aluno pode estar em recuperação em várias disciplinas; o número de topo conta alunos.
    const alunosEmRecuperacao = new Set(situacoes.map((s) => s.alunoId)).size;
    const conselhosPendentes = conselhos.filter((c) => c.resultado === 0);
    const prontosParaEncerrar = conselhosPendentes.filter((c) => c.votosAprovar + c.votosReprovar > 0).length;

    const pendencias: Pendencia[] = [
        {
            path: '/coordenador/recuperacao',
            icone: 'recuperacao',
            titulo: 'Provas finais',
            descricao: situacoes.length === 0
                ? 'Nenhum aluno em recuperação no momento.'
                : `${plural(situacoes.length, 'prova final', 'provas finais')} para lançar (${plural(alunosEmRecuperacao, 'aluno', 'alunos')}).`,
            quantidade: situacoes.length,
            carregando: carregandoRecuperacao,
        },
        {
            path: '/coordenador/conselhos',
            icone: 'conselho',
            titulo: 'Conselhos de classe',
            descricao: conselhosPendentes.length === 0
                ? 'Todos os conselhos foram encerrados.'
                : `${plural(conselhosPendentes.length, 'conselho', 'conselhos')} em votação; ${plural(prontosParaEncerrar, 'pronto', 'prontos')} para encerrar.`,
            quantidade: conselhosPendentes.length,
            carregando: carregandoConselhos,
        },
    ];

    return (
        <Pagina>
            <PageHeader
                eyebrow={hojePorExtenso()}
                titulo={`${saudacao()}, ${sessao?.nome?.split(' ')[0] ?? ''}.`}
                descricao="Acompanhamento pedagógico da escola."
            />

            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    valor={alunosEmRecuperacao}
                    rotulo="Alunos em recuperação"
                    icone="recuperacao"
                    tom={alunosEmRecuperacao > 0 ? 'alerta' : 'neutro'}
                />
                <StatCard
                    valor={conselhosPendentes.length}
                    rotulo="Conselhos em votação"
                    icone="conselho"
                    tom={conselhosPendentes.length > 0 ? 'destaque' : 'neutro'}
                />
                <StatCard valor={turmas.length} rotulo="Turmas" icone="turmas" />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] mt-6">
                <Card titulo="Pendências" descricao="O que depende da coordenação agora.">
                    <div className="grid gap-2">
                        {pendencias.map((p) => (
                            <Link
                                key={p.path}
                                to={p.path}
                                className="group flex items-center gap-3 rounded-lg border border-line p-3 transition-colors hover:border-gold hover:bg-gold-soft/40"
                            >
                                <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                    p.quantidade > 0 ? 'bg-warning-soft text-warning' : 'bg-success-soft text-success'
                                }`}>
                                    <Icone nome={p.quantidade > 0 ? p.icone : 'check'} />
                                </span>

                                <span className="flex-1 min-w-0">
                                    <span className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-ink">{p.titulo}</span>
                                        {!p.carregando && p.quantidade > 0 && <Badge tom="alerta">{p.quantidade}</Badge>}
                                    </span>
                                    <span className="block text-xs text-slate">{p.carregando ? 'Carregando...' : p.descricao}</span>
                                </span>

                                <Icone nome="chevronDireita" className="text-slate group-hover:text-gold transition-colors" />
                            </Link>
                        ))}
                    </div>
                </Card>

                <ComunicadosRecentes className="" />
            </div>
        </Pagina>
    );
}
