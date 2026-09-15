import { useEffect, useState } from 'react';
import { getMeuResumo } from '../services/alunoService';
import type { ResumoAluno } from '../types/resumoAluno';

export function useMeuResumo() {
    const [resumo, setResumo] = useState<ResumoAluno | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let cancelado = false;
        (async () => {
            try {
                const dados = await getMeuResumo();
                if (!cancelado) setResumo(dados);
            } catch (err) {
                if (!cancelado) setErro((err as Error).message);
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

        return () => { cancelado = true; };
    }, []);

    return { resumo, carregando, erro };
}