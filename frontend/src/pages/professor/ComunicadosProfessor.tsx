import { useMinhasTurmas } from '../../hooks/useMinhasTurmas';
import { PaginaComunicados } from '../../components/PaginaComunicados';

export function ComunicadosProfessor() {
    const { vinculos } = useMinhasTurmas();

    // Um vínculo por disciplina: o professor pode ter a mesma turma mais de uma vez.
    const opcoesTurma = vinculos
        .filter((v, i) => vinculos.findIndex((x) => x.turmaId === v.turmaId) === i)
        .map((v) => ({ id: v.turmaId, label: v.turma }));

    return (
        <PaginaComunicados
            eyebrow="Diário de classe"
            descricao="Os avisos da escola para você e os que você enviou às suas turmas."
            turmas={opcoesTurma}
            somenteTurma
        />
    );
}
