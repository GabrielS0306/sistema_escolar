import { useTurmas } from '../../hooks/useTurmas';
import { PaginaComunicados } from '../../components/PaginaComunicados';

const TURNO_LABEL = ['Manhã', 'Tarde', 'Noite'];

export function Comunicados() {
    const { turmas } = useTurmas();

    // Há várias turmas com o mesmo nome; ano e turno ajudam a escolher a certa.
    const opcoesTurma = turmas.map((t) => ({
        id: t.id,
        label: `${t.nome} · ${t.anoLetivo} · ${TURNO_LABEL[t.turno]}`,
    }));

    return (
        <PaginaComunicados
            eyebrow="Comunicação"
            descricao="Avisos para a escola toda, uma turma, professores ou alunos."
            turmas={opcoesTurma}
        />
    );
}
