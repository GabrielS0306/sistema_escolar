import { useEffect, useState } from 'react';
import { getNotasPorVinculo, type NotaRegistro } from '../services/notaTurmaService';

export function useNotasTurma(vinculoId: string | null) {
    const [notas, setNotas] = useState<NotaRegistro[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [recarregar, setRecarregar] = useState(0);

    useEffect(() => {
        if (!vinculoId) return;

        let cancelado = false;

        (async () => {
            setCarregando(true);

            try {
                const dados = await getNotasPorVinculo(vinculoId);

                if (!cancelado) setNotas(dados);
            } catch (err) {
                if (!cancelado) setErro((err as Error).message);
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();
        
        return () => { cancelado = true; };
    }, [vinculoId, recarregar]);

    function recarregarDados() {
        setRecarregar((n) => n + 1);
    }

    return { notas, carregando, erro, recarregarDados };
}