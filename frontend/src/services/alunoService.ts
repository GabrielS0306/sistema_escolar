import { apiGet } from './api';
import type { Aluno } from '../types/aluno';

export function getAlunos(): Promise<Aluno[]> {
    return apiGet<Aluno[]>('/Alunos');
}