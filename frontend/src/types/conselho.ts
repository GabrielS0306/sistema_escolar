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
export const RESULTADO_COR = ['text-warning', 'text-success', 'text-danger'];
export const RESULTADO_TOM = ['alerta', 'sucesso', 'perigo'] as const;
