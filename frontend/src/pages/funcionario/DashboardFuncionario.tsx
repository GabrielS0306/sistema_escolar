import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOcorrenciasRecentes } from '../../hooks/useOcorrenciasRecentes';
import { TabelaOcorrencias } from '../../components/TabelaOcorrencias';
import { ComunicadosRecentes } from '../../components/ComunicadosRecentes';
import { Pagina, PageHeader, Carregando, EstadoErro } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Icone, type NomeIcone } from '../../components/ui/Icone';
import { hojePorExtenso, saudacao } from '../../utils/datas';

const ATALHOS: { path: string; label: string; descricao: string; icone: NomeIcone }[] = [
    { path: '/dashboard/funcionario/ocorrencias', label: 'Registrar ocorrência', descricao: 'Atrasos, saúde, disciplina e elogios', icone: 'ocorrencias' },
    { path: '/dashboard/funcionario/alunos', label: 'Consultar alunos', descricao: 'Busca por nome ou matrícula', icone: 'alunos' },
];

export function DashboardFuncionario() {
    const { sessao } = useAuth();
    const { ocorrencias, carregando, erro } = useOcorrenciasRecentes();

    return (
        <Pagina>
            <PageHeader
                eyebrow={hojePorExtenso()}
                titulo={`${saudacao()}, ${sessao?.nome?.split(' ')[0] ?? ''}.`}
                descricao="Secretaria e portaria."
            />

            <div className="grid gap-4 sm:grid-cols-2 mb-6">
                {ATALHOS.map((a) => (
                    <Link
                        key={a.path}
                        to={a.path}
                        className="group flex items-center gap-4 rounded-xl border border-line bg-surface shadow-card p-5 transition-colors hover:border-gold"
                    >
                        <span className="w-11 h-11 rounded-lg bg-gold-soft text-gold flex items-center justify-center">
                            <Icone nome={a.icone} tamanho={20} />
                        </span>
                        <span className="flex-1 min-w-0">
                            <span className="block font-semibold text-ink">{a.label}</span>
                            <span className="block text-sm text-slate">{a.descricao}</span>
                        </span>
                        <Icone nome="setaDireita" className="text-slate group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                    </Link>
                ))}
            </div>

            <Card
                titulo="Últimas ocorrências"
                acoes={<Link to="/dashboard/funcionario/ocorrencias" className="text-sm font-medium text-gold hover:underline">Ver todas</Link>}
                semPadding
            >
                {carregando && <Carregando />}
                {erro && <div className="px-5 pb-5"><EstadoErro mensagem={erro} /></div>}
                {!carregando && !erro && <TabelaOcorrencias ocorrencias={ocorrencias.slice(0, 5)} />}
            </Card>

            <ComunicadosRecentes />
        </Pagina>
    );
}
