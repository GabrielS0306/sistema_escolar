import { apiGet, apiPost } from './api';

export interface OcorrenciaRegistro {
    id: string;
    nomeAluno: string;
    registradoPor: string;
    tipo: number;
    descricao: string;
    data: string;
}

interface CreateOcorrenciaDto {
    alunoId: string;
    registradoPorUsuarioId: string;
    tipo: number;
    descricao: string;
}

export function getOcorrenciasPorTurma(turmaId: string): Promise<OcorrenciaRegistro[]> {
    return apiGet<OcorrenciaRegistro[]>(`/Ocorrencias/turma/${turmaId}`);
}

export function criarOcorrencia(dto: CreateOcorrenciaDto) {
    return apiPost('/Ocorrencias', dto);
}