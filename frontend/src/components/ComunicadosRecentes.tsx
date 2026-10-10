import { useComunicados } from '../hooks/useComunicados';
import { ListaComunicados } from './ListaComunicados';

const LIMITE = 5;

// Bloco para dashboards: os últimos comunicados que o usuário logado pode ver.
export function ComunicadosRecentes() {
    const { comunicados, carregando, erro } = useComunicados();

    return (
        <div className="mt-12">
            <p className="text-sm text-slate mb-4">Comunicados recentes</p>

            {carregando && <p className="text-sm text-slate">Carregando...</p>}
            {erro && <p className="text-sm text-red-600">Erro: {erro}</p>}
            {!carregando && !erro && <ListaComunicados comunicados={comunicados.slice(0, LIMITE)} />}
        </div>
    );
}
