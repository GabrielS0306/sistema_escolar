import { apiGet } from './api';
import type { Frequencia } from '../types/frequencia';

export function getFrequenciaPorAluno(alunoId: string): Promise<Frequencia[]> {
    return apiGet<Frequencia[]>(`/Frequencias/aluno/${alunoId}`);
}