export interface ConselhoClasse {
    id: string;
    alunoId: string;
    nomeAluno: string;
    matricula: string;
    anoLetivo: number;
    data: string;
    resultado: number;        // 0 PendenteVotacao, 1 Aprovado, 2 Reprovado
    votosAprovar: number;
    votosReprovar: number;
    meuVoto: number | null;   // 0 Aprovar, 1 Reprovar, null = ainda não votou
    disciplinasReprovadas: string[];
}

export const RESULTADO_LABEL = ['Pendente', 'Aprovado', 'Reprovado'];
export const RESULTADO_COR = ['text-amber-700', 'text-emerald-700', 'text-red-700'];
