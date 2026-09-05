import { useEffect, useState } from 'react';
import { getProfessores } from '../services/professorService';
import type { Professor } from '../types/professor';

export function useProfessores() {
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        getProfessores()
        .then(setProfessores)
        .catch((err) => setErro(err.message))
        .finally(() => setCarregando(false));
    }, []);

    return { professores, carregando, erro };
}