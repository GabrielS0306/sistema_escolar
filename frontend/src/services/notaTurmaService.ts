import { apiGet } from './api';

export interface NotaRegistro {
    id: string;
    nomeAluno: string;
    valor: number;
    bimestre: number;
    nomeAvaliacao: string;
}

export function getNotasPorVinculo(vinculoId: string): Promise<NotaRegistro[]> {
    return apiGet<NotaRegistro[]>(`/Notas/vinculo/${vinculoId}`);
}