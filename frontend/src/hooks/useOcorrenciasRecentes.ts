import { useEffect, useState } from 'react';
import { getOcorrenciasRecentes, type OcorrenciaRegistro } from '../services/ocorrenciaTurmaService';

export function useOcorrenciasRecentes() {
    const [ocorrencias, setOcorrencias] = useState<OcorrenciaRegistro[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [recarregar, setRecarregar] = useState(0);

    useEffect(() => {
        let cancelado = false;

        (async () => {
            setCarregando(true);

            try {
                const dados = await getOcorrenciasRecentes();

                if (!cancelado) setOcorrencias(dados);
            } catch (err) {
                if (!cancelado) setErro((err as Error).message);
            } finally {
                if (!cancelado) setCarregando(false);
            }
        })();

        return () => { cancelado = true; };
    }, [recarregar]);

    function recarregarDados() {
        setRecarregar((n) => n + 1);
    }

    return { ocorrencias, carregando, erro, recarregarDados };
}
