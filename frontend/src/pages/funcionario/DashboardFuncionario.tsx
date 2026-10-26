import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOcorrenciasRecentes } from '../../hooks/useOcorrenciasRecentes';
import { TabelaOcorrencias } from '../../components/TabelaOcorrencias';
import { ComunicadosRecentes } from '../../components/ComunicadosRecentes';

const ATALHOS = [
    { path: '/dashboard/funcionario/ocorrencias', label: 'Registrar ocorrência', descricao: 'Atrasos, saúde, disciplina e elogios' },
    { path: '/dashboard/funcionario/alunos', label: 'Consultar alunos', descricao: 'Busca por nome ou matrícula' },
];

function saudacao() {
    const hora = new Date().getHours();

    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';

    return 'Boa noite';
}

export function DashboardFuncionario() {
    const { sessao } = useAuth();
    const { ocorrencias, carregando, erro } = useOcorrenciasRecentes();

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

            <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
                {ATALHOS.map((a) => (
                    <Link key={a.path} to={a.path} className="flex items-center justify-between py-4 group">
                        <div>
                            <p className="text-ink group-hover:text-gold transition-colors">{a.label}</p>
                            <p className="text-sm text-slate">{a.descricao}</p>
                        </div>
                        <span className="text-slate group-hover:text-gold transition-colors">→</span>
                    </Link>
                ))}
            </div>

            <div className="mt-12">
                <p className="text-sm text-slate mb-4">Últimas ocorrências</p>

                {carregando && <p className="text-sm text-slate">Carregando...</p>}
                {erro && <p className="text-sm text-red-600">Erro: {erro}</p>}
                {!carregando && !erro && <TabelaOcorrencias ocorrencias={ocorrencias.slice(0, 5)} />}
            </div>

            <ComunicadosRecentes />
        </div>
    );
}
