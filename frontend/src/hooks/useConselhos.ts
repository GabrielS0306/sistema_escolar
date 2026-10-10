import { useEffect, useState } from 'react';
import { getConselhos } from '../services/conselhoService';
import type { ConselhoClasse } from '../types/conselho';

export function useConselhos() {
    const [conselhos, setConselhos] = useState<ConselhoClasse[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [recarregar, setRecarregar] = useState(0);

    useEffect(() => {
        let cancelado = false;

        (async () => {
            setCarregando(true);

            try {
                const dados = await getConselhos();

                if (!cancelado) setConselhos(dados);
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

    return { conselhos, carregando, erro, recarregarDados };
}
