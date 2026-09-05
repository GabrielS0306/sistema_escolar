import { apiGet } from './api';
import type { Turma } from '../types/turma';

export function getTurmas(): Promise<Turma[]> {
    return apiGet<Turma[]>('/Turmas');
}