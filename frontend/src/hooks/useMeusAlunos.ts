import { useEffect, useState } from 'react';
import { getMeusAlunos } from '../services/responsavelService';
import type { AlunoVinculado } from '../types/responsavel';

export function useMeusAlunos() {
    const [alunos, setAlunos] = useState<AlunoVinculado[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        let cancelado = false;
        (async () => {
            try {
                const dados = await getMeusAlunos();
                if (!cancelado) setAlunos(dados);
            } catch (err) {
                if (!cancelado) setErro((err as Error).message);
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

        return () => { cancelado = true; };
    }, []);

    return { alunos, carregando, erro };
}
