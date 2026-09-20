import { apiGet } from './api';

export interface FrequenciaRegistro {
    id: string;
    nomeAluno: string;
    data: string;
    presente: boolean;
}

export function getFrequenciaPorVinculo(vinculoId: string): Promise<FrequenciaRegistro[]> {
    return apiGet<FrequenciaRegistro[]>(`/Frequencias/vinculo/${vinculoId}`);
}