import { apiGet } from './api';
import type { Aluno } from '../types/aluno';
import type { ResumoAluno } from '../types/resumoAluno';

export function getAlunos(): Promise<Aluno[]> {
    return apiGet<Aluno[]>('/Alunos');
}

export function getMeuResumo(): Promise<ResumoAluno> {
    return apiGet<ResumoAluno>('/Alunos/me/resumo');
}

export function getResumoAluno(alunoId: string): Promise<ResumoAluno> {
    return apiGet<ResumoAluno>(`/Alunos/${alunoId}/resumo`);
}
