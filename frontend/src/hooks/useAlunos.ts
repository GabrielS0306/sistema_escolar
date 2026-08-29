import { useEffect, useState } from 'react';
import { getAlunos } from '../services/alunoService';
import type { Aluno } from '../types/aluno';

export function useAlunos() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        getAlunos()
        .then(setAlunos)
        .catch((err) => setErro(err.message))
        .finally(() => setCarregando(false));
    }, []);

    return { alunos, carregando, erro };
}