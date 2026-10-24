import { apiGet, apiPostForm } from './api';
import type { DocumentoUrl, DocumentoUsuario } from '../types/documento';

export function getDocumentosUsuario(usuarioId: string): Promise<DocumentoUsuario[]> {
    return apiGet<DocumentoUsuario[]>(`/DocumentosUsuario/usuario/${usuarioId}`);
}

// O bucket é privado: cada abertura pede uma URL assinada que expira em poucos minutos.
export function getUrlDocumento(documentoId: string): Promise<DocumentoUrl> {
    return apiGet<DocumentoUrl>(`/DocumentosUsuario/${documentoId}/url`);
}

export function enviarDocumento(usuarioId: string, tipo: number, descricao: string, arquivo: File): Promise<DocumentoUsuario> {
    const formData = new FormData();

    formData.append('UsuarioId', usuarioId);
    formData.append('Tipo', String(tipo));
    formData.append('Descricao', descricao);
    formData.append('arquivo', arquivo);

    return apiPostForm<DocumentoUsuario>('/DocumentosUsuario', formData);
}
