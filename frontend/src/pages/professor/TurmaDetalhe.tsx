import { Link, Outlet, useSearchParams } from 'react-router-dom';
import { TabsTurma } from '../../components/TabsTurma';
import { useMinhasTurmas } from '../../hooks/useMinhasTurmas';
import { Pagina, PageHeader } from '../../components/ui/Estrutura';
import { Icone } from '../../components/ui/Icone';

export function TurmaDetalhe() {
    const [searchParams] = useSearchParams();
    const { vinculos } = useMinhasTurmas();

    // O vínculo (professor × turma × disciplina) vem na URL; com ele o título diz qual turma é.
    const vinculo = vinculos.find((v) => v.id === searchParams.get('vinculo'));

    return (
        <Pagina>
            <Link to="/dashboard/professor" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink mb-4">
                <Icone nome="chevronDireita" tamanho={14} className="rotate-180" /> Minhas turmas
            </Link>

            <PageHeader
                eyebrow={vinculo ? `Turma ${vinculo.turma}` : 'Turma'}
                titulo={vinculo?.disciplina ?? 'Carregando...'}
            />

            <TabsTurma />
            <Outlet />
        </Pagina>
    );
}
