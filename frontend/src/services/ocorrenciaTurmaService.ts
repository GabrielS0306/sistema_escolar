import { apiGet, apiPost } from './api';

export interface OcorrenciaRegistro {
    id: string;
    nomeAluno: string;
    registradoPor: string;
    tipo: number;
    descricao: string;
    data: string;
}

// Quem registra é o usuário logado (o backend lê do token).
interface CreateOcorrenciaDto {
    alunoId: string;
    tipo: number;
    descricao: string;
}

export function getOcorrenciasPorTurma(turmaId: string): Promise<OcorrenciaRegistro[]> {
    return apiGet<OcorrenciaRegistro[]>(`/Ocorrencias/turma/${turmaId}`);
}

export function getOcorrenciasRecentes(): Promise<OcorrenciaRegistro[]> {
    return apiGet<OcorrenciaRegistro[]>('/Ocorrencias/recentes');
}

export function criarOcorrencia(dto: CreateOcorrenciaDto) {
    return apiPost('/Ocorrencias', dto);
}