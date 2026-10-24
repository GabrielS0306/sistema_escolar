export interface DocumentoUsuario {
    id: string;
    tipo: number;          // 0 AtestadoMedico, 1 Comprovante, 2 Disciplinar, 3 Outro
    descricao: string;
    data: string;
    registradoPor: string;
}

export interface DocumentoUrl {
    url: string;
    expiraEm: string;
}

export const TIPO_DOCUMENTO_LABEL = ['Atestado médico', 'Comprovante', 'Disciplinar', 'Outro'];
