import { useEffect, useState } from 'react';
import { getUsuarios, type UsuarioResumo } from '../services/usuarioService';

export function useUsuarios() {
    const [usuarios, setUsuarios] = useState<UsuarioResumo[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let cancelado = false;

        (async () => {
            try {
                const dados = await getUsuarios();
                if (!cancelado) setUsuarios(dados);
            } catch (err) {
                if (!cancelado) setErro((err as Error).message);
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

        return () => { cancelado = true; };
    }, []);

    return { usuarios, carregando, erro };
}