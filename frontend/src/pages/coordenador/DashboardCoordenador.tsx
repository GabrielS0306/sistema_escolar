import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRecuperacao } from '../../hooks/useRecuperacao';
import { useConselhos } from '../../hooks/useConselhos';
import { useTurmas } from '../../hooks/useTurmas';
import { ComunicadosRecentes } from '../../components/ComunicadosRecentes';

function saudacao() {
    const hora = new Date().getHours();

    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';

    return 'Boa noite';
}

function plural(n: number, singular: string, pluralTexto: string) {
    return `${n} ${n === 1 ? singular : pluralTexto}`;
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

    const pendencias = [
        {
            path: '/coordenador/recuperacao',
            titulo: situacoes.length === 0
                ? 'Nenhuma prova final pendente'
                : `${plural(situacoes.length, 'prova final', 'provas finais')} para lançar`,
            descricao: situacoes.length === 0
                ? 'Nenhum aluno em recuperação no momento.'
                : `${plural(alunosEmRecuperacao, 'aluno', 'alunos')} em recuperação.`,
            ativa: situacoes.length > 0,
            carregando: carregandoRecuperacao,
        },
        {
            path: '/coordenador/conselhos',
            titulo: conselhosPendentes.length === 0
                ? 'Nenhum conselho em aberto'
                : `${plural(conselhosPendentes.length, 'conselho', 'conselhos')} em votação`,
            descricao: conselhosPendentes.length === 0
                ? 'Todos os conselhos de classe foram encerrados.'
                : `${plural(prontosParaEncerrar, 'já tem', 'já têm')} votos e pode${prontosParaEncerrar === 1 ? '' : 'm'} ser encerrado${prontosParaEncerrar === 1 ? '' : 's'}.`,
            ativa: conselhosPendentes.length > 0,
            carregando: carregandoConselhos,
        },
    ];

    const hoje = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return (
        <div className="max-w-4xl mx-auto px-8 py-12">
            <p className="text-sm text-slate capitalize">{hoje}</p>

            <h1 className="font-serif text-3xl text-ink mt-1">
                {saudacao()}, {sessao?.nome?.split(' ')[0]}.
            </h1>

            <div className="grid grid-cols-3 mt-10 border-y border-ink/10">
                <div className="py-6 px-6 border-r border-ink/10">
                    <p className="font-serif text-4xl text-amber-700">{alunosEmRecuperacao}</p>
                    <p className="text-sm text-slate mt-1">Alunos em recuperação</p>
                </div>

                <div className="py-6 px-6 border-r border-ink/10">
                    <p className="font-serif text-4xl text-ink">{conselhosPendentes.length}</p>
                    <p className="text-sm text-slate mt-1">Conselhos em votação</p>
                </div>

                <div className="py-6 px-6">
                    <p className="font-serif text-4xl text-ink">{turmas.length}</p>
                    <p className="text-sm text-slate mt-1">Turmas</p>
                </div>
            </div>

            <div className="mt-12">
                <p className="text-sm text-slate mb-4">Pendências</p>

                <div className="divide-y divide-ink/10 border-y border-ink/10">
                    {pendencias.map((p) => (
                        <Link key={p.path} to={p.path} className="flex items-center justify-between py-4 group">
                            <div className="flex items-start gap-3">
                                <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${p.ativa ? 'bg-gold' : 'bg-ink/20'}`} />
                                <div>
                                    <p className="text-ink group-hover:text-gold transition-colors">
                                        {p.carregando ? 'Carregando...' : p.titulo}
                                    </p>
                                    {!p.carregando && <p className="text-sm text-slate">{p.descricao}</p>}
                                </div>
                            </div>

                            <span className="text-slate group-hover:text-gold transition-colors">→</span>
                        </Link>
                    ))}
                </div>
            </div>

            <ComunicadosRecentes />
        </div>
    );
}
