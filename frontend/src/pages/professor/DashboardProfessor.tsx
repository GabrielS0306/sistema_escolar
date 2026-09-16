import { Link } from 'react-router-dom';
import { useMinhasTurmas } from '../../hooks/useMinhasTurmas';

export function DashboardProfessor() {
    const { vinculos, carregando, erro } = useMinhasTurmas();

    if (carregando) return <p className="text-slate px-12 py-10">Carregando...</p>;
    if (erro) return <p className="text-red-600 px-12 py-10">Erro: {erro}</p>;

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Diário de classe</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Minhas turmas</h1>

            {vinculos.length === 0 ? (
                <p className="text-sm text-slate mt-10">Nenhuma turma vinculada ainda.</p>
            ) : (
                <div className="mt-10 border-t border-ink/10 divide-y divide-ink/10">
                    {vinculos.map((v) => (
                        <div key={v.id} className="py-4">
                            <p className="text-ink">{v.disciplina}</p>
                            <p className="text-sm text-slate">{v.turma}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}