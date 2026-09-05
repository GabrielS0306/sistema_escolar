import { useEffect, useState } from 'react';
import { getNotasPorAluno } from '../services/notaService';
import type { Nota } from '../types/nota';

export function useNotas(alunoId: string | null) {
    const [notas, setNotas] = useState<Nota[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (!alunoId) return;

        let cancelado = false;

        (async () => {
            setCarregando(true);

            try {
                const dados = await getNotasPorAluno(alunoId);

                if (!cancelado) setNotas(dados);
            } catch (err) {
                if (!cancelado) setErro((err as Error).message);
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

        return () => { cancelado = true; };
    }, [alunoId]);

    return { notas, carregando, erro };
}