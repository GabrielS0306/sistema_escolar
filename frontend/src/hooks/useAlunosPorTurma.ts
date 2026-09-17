import { useEffect, useState } from 'react';
import { getAlunosPorTurma, type MatriculaResumo } from '../services/matriculaService';

export function useAlunosPorTurma(turmaId: string | undefined) {
    const [alunos, setAlunos] = useState<MatriculaResumo[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (!turmaId) return;

        let cancelado = false;

        (async () => {
            setCarregando(true);

            try {
                const dados = await getAlunosPorTurma(turmaId);
                if (!cancelado) setAlunos(dados);
            } catch (err) {
                if (!cancelado) setErro((err as Error).message);
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

        return () => { cancelado = true; };
    }, [turmaId]);

    return { alunos, carregando, erro };
}