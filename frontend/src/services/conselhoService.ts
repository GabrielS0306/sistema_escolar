import { apiGet, apiPost } from './api';
import type { ConselhoClasse } from '../types/conselho';

export function getConselhos(): Promise<ConselhoClasse[]> {
    return apiGet<ConselhoClasse[]>('/ConselhosClasse');
}

export function votarConselho(conselhoId: string, voto: number): Promise<ConselhoClasse> {
    return apiPost<ConselhoClasse>(`/ConselhosClasse/${conselhoId}/votar`, { voto });
}

export function encerrarConselho(conselhoId: string): Promise<ConselhoClasse> {
    return apiPost<ConselhoClasse>(`/ConselhosClasse/${conselhoId}/encerrar`, {});
}
