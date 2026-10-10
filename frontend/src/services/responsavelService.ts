import { apiGet } from './api';
import type { AlunoVinculado } from '../types/responsavel';

export function getMeusAlunos(): Promise<AlunoVinculado[]> {
    return apiGet<AlunoVinculado[]>('/Responsaveis/me/alunos');
}
