import { Outlet, useNavigate } from 'react-router-dom';
import { TabsTurma } from '../../components/TabsTurma';

export function TurmaDetalhe() {
    const navigate = useNavigate();

    return (
        <div className="px-12 py-10">
            <button onClick={() => navigate(-1)} className="text-sm text-slate hover:text-ink mb-6">
                ← Voltar
            </button>

            <p className="text-sm text-slate">Diário de classe</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Turma</h1>

            <div className="mt-8">
                <TabsTurma />
                <Outlet />
            </div>
        </div>
    );
}