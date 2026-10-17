import { apiGet, apiPost } from './api';
import type { SituacaoRecuperacao } from '../types/recuperacao';
import type { SituacaoDisciplina } from '../types/resumoAluno';

export function getEmRecuperacao(): Promise<SituacaoRecuperacao[]> {
    return apiGet<SituacaoRecuperacao[]>('/SituacoesDisciplina/recuperacao');
}

export function registrarProvaFinal(situacaoId: string, notaProvaFinal: number): Promise<SituacaoDisciplina> {
    return apiPost<SituacaoDisciplina>(`/SituacoesDisciplina/${situacaoId}/prova-final`, { notaProvaFinal });
}
