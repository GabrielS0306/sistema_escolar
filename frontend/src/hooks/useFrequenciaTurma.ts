import { useEffect, useState } from 'react';
import { getFrequenciaPorVinculo, type FrequenciaRegistro } from '../services/frequenciaTurmaService';

export function useFrequenciaTurma(vinculoId: string | null) {
    const [frequencias, setFrequencias] = useState<FrequenciaRegistro[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [recarregar, setRecarregar] = useState(0);

    useEffect(() => {
        if (!vinculoId) return;

        let cancelado = false;

        (async () => {
            setCarregando(true);

            try {
                const dados = await getFrequenciaPorVinculo(vinculoId);
                if (!cancelado) setFrequencias(dados);
            } catch (err) {
                if (!cancelado) setErro((err as Error).message);
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();
        
        return () => { cancelado = true; };
    }, [vinculoId, recarregar]);

    function recarregarDados() {
        setRecarregar((n) => n + 1);
    }

    return { frequencias, carregando, erro, recarregarDados };
}