import { apiGet } from './api';
import type { Professor } from '../types/professor';

export function getProfessores(): Promise<Professor[]> {
    return apiGet<Professor[]>('/Professores');
}