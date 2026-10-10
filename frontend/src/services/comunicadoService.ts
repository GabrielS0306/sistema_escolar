import { apiGet, apiPost } from './api';
import type { Comunicado, CriarComunicado } from '../types/comunicado';

// Para Admin/Coordenador o backend devolve todos; para os demais, só os do seu público.
export function getMeusComunicados(): Promise<Comunicado[]> {
    return apiGet<Comunicado[]>('/Comunicados/me');
}

export function criarComunicado(dados: CriarComunicado): Promise<Comunicado> {
    return apiPost<Comunicado>('/Comunicados', dados);
}
