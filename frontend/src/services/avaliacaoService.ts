import { apiPost } from './api';

interface CreateAvaliacaoDto {
    professorTurmaDisciplinaId: string;
    bimestre: number;
    tipo: number;
    nome: string;
    data: string;
}

interface AvaliacaoResponse {
    id: string;
    bimestre: number;
    tipo: number;
    nome: string;
    data: string;
    turma: string;
    disciplina: string;
}

export function criarAvaliacao(dto: CreateAvaliacaoDto): Promise<AvaliacaoResponse> {
    return apiPost<AvaliacaoResponse>('/Avaliacoes', dto);
}