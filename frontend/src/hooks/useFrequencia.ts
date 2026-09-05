import { useEffect, useState } from 'react';
import { getFrequenciaPorAluno } from '../services/frequenciaService';
import type { Frequencia } from '../types/frequencia';

export function useFrequencia(alunoId: string | null) {
    const [frequencias, setFrequencias] = useState<Frequencia[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (!alunoId) return;

        let cancelado = false;

        (async () => {
            setCarregando(true);

            try {
                const dados = await getFrequenciaPorAluno(alunoId);

                if (!cancelado) setFrequencias(dados);
            } catch (err) {
                if (!cancelado) setErro((err as Error).message);
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

        return () => { cancelado = true; };
    }, [alunoId]);

    return { frequencias, carregando, erro };
}