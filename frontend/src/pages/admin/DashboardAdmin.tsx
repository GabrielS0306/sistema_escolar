import { Link } from 'react-router-dom';
import { useAlunos } from '../../hooks/useAlunos';
import { useTurmas } from '../../hooks/useTurmas';
import { useProfessores } from '../../hooks/useProfessores';
import { useAuth } from '../../hooks/useAuth';

const ACESSOS = [
    { path: '/admin/alunos', label: 'Alunos', descricao: 'Cadastro e matrículas' },
    { path: '/admin/turmas', label: 'Turmas', descricao: 'Séries, turnos e ano letivo' },
    { path: '/admin/professores', label: 'Professores', descricao: 'Corpo docente' },
    { path: '/admin/frequencia', label: 'Frequência', descricao: 'Consulta de presença' },
    { path: '/admin/notas', label: 'Notas', descricao: 'Avaliações e médias' },
];

function saudacao() {
    const hora = new Date().getHours();

    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';

    return 'Boa noite';
}

export function DashboardAdmin() {
    const { sessao } = useAuth();
    const { alunos } = useAlunos();
    const { turmas } = useTurmas();
    const { professores } = useProfessores();

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
                    <p className="font-serif text-4xl text-ink">{alunos.length}</p>
                    <p className="text-sm text-slate mt-1">Alunos matriculados</p>
                </div>
                
                <div className="py-6 px-6 border-r border-ink/10">
                    <p className="font-serif text-4xl text-ink">{turmas.length}</p>
                    <p className="text-sm text-slate mt-1">Turmas ativas</p>
                </div>

                <div className="py-6 px-6">
                    <p className="font-serif text-4xl text-ink">{professores.length}</p>
                    <p className="text-sm text-slate mt-1">Professores</p>
                </div>
            </div>

            <div className="mt-12">
                <p className="text-sm text-slate mb-4">Áreas de gestão</p>

                <div className="divide-y divide-ink/10 border-t border-ink/10">
                    {ACESSOS.map((item) => (
                        <Link key={item.path} to={item.path} className="flex items-baseline justify-between py-4 group">
                            <div>
                                <p className="text-ink group-hover:text-gold transition-colors">{item.label}</p>
                                <p className="text-sm text-slate">{item.descricao}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}