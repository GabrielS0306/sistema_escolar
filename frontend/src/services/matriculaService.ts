import { apiGet } from './api';

export interface MatriculaResumo {
    id: string;
    nomeAluno: string;
    matricula: string;
    turma: string;
    dataMatricula: string;
}

export function getAlunosPorTurma(turmaId: string): Promise<MatriculaResumo[]> {
    return apiGet<MatriculaResumo[]>(`/Matriculas/turma/${turmaId}`);
}