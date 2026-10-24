import { useEffect, useState } from 'react';
import { getDocumentosUsuario } from '../services/documentoService';
import type { DocumentoUsuario } from '../types/documento';

export function useDocumentosUsuario(usuarioId: string | null) {
    const [documentos, setDocumentos] = useState<DocumentoUsuario[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [recarregar, setRecarregar] = useState(0);

    useEffect(() => {
        if (!usuarioId) return;

        let cancelado = false;

        (async () => {
            setCarregando(true);
            setErro(null);

            try {
                const dados = await getDocumentosUsuario(usuarioId);

                if (!cancelado) setDocumentos(dados);
            } catch (err) {
                if (!cancelado) setErro((err as Error).message);
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

        return () => { cancelado = true; };
    }, [usuarioId, recarregar]);

    function recarregarDados() {
        setRecarregar((n) => n + 1);
    }

    return { documentos, carregando, erro, recarregarDados };
}
