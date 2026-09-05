import { apiGet } from './api';
import type { Nota } from '../types/nota';

export function getNotasPorAluno(alunoId: string): Promise<Nota[]> {
    return apiGet<Nota[]>(`/Notas/aluno/${alunoId}`);
}