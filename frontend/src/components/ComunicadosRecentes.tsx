import { useComunicados } from '../hooks/useComunicados';
import { ListaComunicados } from './ListaComunicados';
import { Card } from './ui/Card';
import { Carregando, EstadoErro } from './ui/Estrutura';

const LIMITE = 5;

// Bloco para dashboards: os últimos comunicados que o usuário logado pode ver.
export function ComunicadosRecentes({ className = 'mt-6' }: { className?: string }) {
    const { comunicados, carregando, erro } = useComunicados();

    return (
        <Card titulo="Comunicados recentes" className={className}>
            {carregando && <Carregando />}
            {erro && <EstadoErro mensagem={erro} />}
            {!carregando && !erro && <ListaComunicados comunicados={comunicados.slice(0, LIMITE)} />}
        </Card>
    );
}
