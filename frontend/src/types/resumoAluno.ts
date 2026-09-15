export interface SituacaoDisciplina {
    id: string;
    disciplina: string;
    turma: string;
    mediaFinal: number | null;
    status: number;
}

export interface FrequenciaResumo {
    id: string;
    data: string;
    presente: boolean;
}

export interface NotaResumo {
    id: string;
    valor: number;
    bimestre: number;
    nomeAvaliacao: string;
}

export interface OcorrenciaResumo {
    id: string;
    registradoPor: string;
    tipo: number;
    descricao: string;
    data: string;
}

export interface ResumoAluno {
    nomeAluno: string;
    matricula: string;
    situacoesDisciplina: SituacaoDisciplina[];
    frequencias: FrequenciaResumo[];
    notas: NotaResumo[];
    ocorrencias: OcorrenciaResumo[];
}