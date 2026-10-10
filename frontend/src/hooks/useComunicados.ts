import { useEffect, useState } from 'react';
import { getMeusComunicados } from '../services/comunicadoService';
import type { Comunicado } from '../types/comunicado';

export function useComunicados() {
    const [comunicados, setComunicados] = useState<Comunicado[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [recarregar, setRecarregar] = useState(0);

    useEffect(() => {
        let cancelado = false;

        (async () => {
            setCarregando(true);

            try {
                const dados = await getMeusComunicados();

                if (!cancelado) setComunicados(dados);
            } catch (err) {
                if (!cancelado) setErro((err as Error).message);
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

        return () => { cancelado = true; };
    }, [recarregar]);

    function recarregarDados() {
        setRecarregar((n) => n + 1);
    }

    return { comunicados, carregando, erro, recarregarDados };
}
