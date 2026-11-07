import { Link } from 'react-router-dom';
import { useAlunos } from '../../hooks/useAlunos';
import { useTurmas } from '../../hooks/useTurmas';
import { useProfessores } from '../../hooks/useProfessores';
import { useRecuperacao } from '../../hooks/useRecuperacao';
import { useConselhos } from '../../hooks/useConselhos';
import { useAuth } from '../../hooks/useAuth';
import { Pagina, PageHeader, StatCard } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Icone, type NomeIcone } from '../../components/ui/Icone';
import { ComunicadosRecentes } from '../../components/ComunicadosRecentes';
import { hojePorExtenso, saudacao } from '../../utils/datas';

const ACESSOS: { path: string; label: string; descricao: string; icone: NomeIcone }[] = [
    { path: '/admin/usuarios/novo', label: 'Novo usuário', descricao: 'Cadastrar aluno, professor ou equipe', icone: 'novoUsuario' },
    { path: '/admin/usuarios', label: 'Usuários', descricao: 'Editar dados, senha e documentos', icone: 'usuarios' },
    { path: '/admin/turmas', label: 'Turmas', descricao: 'Séries, turnos e ano letivo', icone: 'turmas' },
    { path: '/admin/notas', label: 'Notas', descricao: 'Avaliações e médias', icone: 'notas' },
    { path: '/admin/frequencia', label: 'Frequência', descricao: 'Consulta de presença', icone: 'frequencia' },
    { path: '/admin/comunicados', label: 'Comunicados', descricao: 'Enviar avisos à escola', icone: 'comunicados' },
];

export function DashboardAdmin() {
    const { sessao } = useAuth();
    const { alunos } = useAlunos();
    const { turmas } = useTurmas();
    const { professores } = useProfessores();
    const { situacoes } = useRecuperacao();
    const { conselhos } = useConselhos();

    const alunosEmRecuperacao = new Set(situacoes.map((s) => s.alunoId)).size;
    const conselhosEmVotacao = conselhos.filter((c) => c.resultado === 0).length;

    return (
        <Pagina>
            <PageHeader
                eyebrow={hojePorExtenso()}
                titulo={`${saudacao()}, ${sessao?.nome?.split(' ')[0] ?? ''}.`}
                descricao="Visão geral da escola."
            />

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StatCard valor={alunos.length} rotulo="Alunos" icone="alunos" />
                <StatCard valor={professores.length} rotulo="Professores" icone="professores" />
                <StatCard valor={turmas.length} rotulo="Turmas" icone="turmas" />
                <StatCard
                    valor={alunosEmRecuperacao + conselhosEmVotacao}
                    rotulo="Pendências"
                    icone="alerta"
                    tom={alunosEmRecuperacao + conselhosEmVotacao > 0 ? 'alerta' : 'neutro'}
                    detalhe={`${alunosEmRecuperacao} em recuperação · ${conselhosEmVotacao} conselhos`}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] mt-6">
                <Card titulo="Acesso rápido">
                    <div className="grid gap-2 sm:grid-cols-2">
                        {ACESSOS.map((a) => (
                            <Link
                                key={a.path}
                                to={a.path}
                                className="group flex items-start gap-3 rounded-lg border border-line p-3 transition-colors hover:border-gold hover:bg-gold-soft/40"
                            >
                                <span className="w-9 h-9 rounded-lg bg-surface-muted text-slate group-hover:text-gold flex items-center justify-center transition-colors">
                                    <Icone nome={a.icone} />
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-sm font-medium text-ink">{a.label}</span>
                                    <span className="block text-xs text-slate">{a.descricao}</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </Card>

                <ComunicadosRecentes className="" />
            </div>
        </Pagina>
    );
}
