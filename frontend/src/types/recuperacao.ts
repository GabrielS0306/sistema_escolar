export interface SituacaoRecuperacao {
    id: string;
    alunoId: string;
    nomeAluno: string;
    matricula: string;
    disciplina: string;
    turma: string;
    anoLetivo: number;
    mediaFinal: number | null;
}

// Mesma regra do backend (SituacoesDisciplinaController.RegistrarProvaFinal).
export const MEDIA_APROVACAO = 6;

export function mediaComProvaFinal(mediaFinal: number, notaProvaFinal: number) {
    return (mediaFinal + notaProvaFinal) / 2;
}
