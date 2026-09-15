import { useEffect, useState } from 'react';
import { getMinhasTurmas } from '../services/professorTurmaDisciplinaService';
import type { VinculoProfessor } from '../types/vinculoProfessor';

export function useMinhasTurmas() {
    const [vinculos, setVinculos] = useState<VinculoProfessor[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let cancelado = false;

        (async () => {
            try {
                const dados = await getMinhasTurmas();
                if (!cancelado) setVinculos(dados);
            } catch (err) {
                if (!cancelado) setErro((err as Error).message);
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

        return () => { cancelado = true; };
    }, []);

    return { vinculos, carregando, erro };
}