import { useEffect, useState } from 'react';
import { getEmRecuperacao } from '../services/recuperacaoService';
import type { SituacaoRecuperacao } from '../types/recuperacao';

export function useRecuperacao() {
    const [situacoes, setSituacoes] = useState<SituacaoRecuperacao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [recarregar, setRecarregar] = useState(0);

    useEffect(() => {
        let cancelado = false;

        (async () => {
            setCarregando(true);

            try {
                const dados = await getEmRecuperacao();

                if (!cancelado) setSituacoes(dados);
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

    return { situacoes, carregando, erro, recarregarDados };
}
