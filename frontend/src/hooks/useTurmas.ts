import { useEffect, useState } from 'react';
import { getTurmas } from '../services/turmaService';
import type { Turma } from '../types/turma';

export function useTurmas() {
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        getTurmas()
        .then(setTurmas)
        .catch((err) => setErro(err.message))
        .finally(() => setCarregando(false));
    }, []);

    return { turmas, carregando, erro };
}