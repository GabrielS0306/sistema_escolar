import { useEffect, useState } from 'react';
import { getResumoAluno } from '../services/alunoService';
import type { ResumoAluno } from '../types/resumoAluno';

export function useResumoAluno(alunoId: string | null) {
    const [resumo, setResumo] = useState<ResumoAluno | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (!alunoId) return;
        let cancelado = false;
        (async () => {
            setCarregando(true);
            setErro(null);
            try {
                const dados = await getResumoAluno(alunoId);
                if (!cancelado) setResumo(dados);
            } catch (err) {
                if (!cancelado) setErro((err as Error).message);
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

        return () => { cancelado = true; };
    }, [alunoId]);

    return { resumo, carregando, erro };
}
