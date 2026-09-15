import { apiGet } from './api';
import type { VinculoProfessor } from '../types/vinculoProfessor';

export function getMinhasTurmas(): Promise<VinculoProfessor[]> {
    return apiGet<VinculoProfessor[]>('/ProfessorTurmaDisciplinas/minhas');
}