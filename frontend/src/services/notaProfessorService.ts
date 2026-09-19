import { apiPost } from './api';

interface NotaAlunoDto {
    alunoId: string;
    valor: number;
}

interface LancarNotasDto {
    avaliacaoId: string;
    notas: NotaAlunoDto[];
}

export function lancarNotas(dto: LancarNotasDto) {
    return apiPost('/Notas/lancar', dto);
}