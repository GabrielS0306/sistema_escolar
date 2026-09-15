import { useTurmas } from '../../hooks/useTurmas';

const NOMES_TURNO = ['Manhã', 'Tarde', 'Noite'];

export function ListaTurmas() {
    const { turmas, carregando, erro } = useTurmas();

    if (carregando) return <p className="text-slate px-12 py-10">Carregando...</p>;
    if (erro) return <p className="text-red-600 px-12 py-10">Erro: {erro}</p>;

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Gestão acadêmica</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Turmas</h1>

            <table className="w-full mt-10 border-t border-ink/10">
                <thead>
                    <tr className="border-b border-ink/10 text-left">
                        <th className="py-3 text-sm font-normal text-slate">Nome</th>
                        <th className="py-3 text-sm font-normal text-slate">Série</th>
                        <th className="py-3 text-sm font-normal text-slate">Turno</th>
                        <th className="py-3 text-sm font-normal text-slate">Ano letivo</th>
                    </tr>
                </thead>
                <tbody>
                    {turmas.map((turma) => (
                        <tr key={turma.id} className="border-b border-ink/10 hover:bg-ink/5 transition-colors">
                        <td className="py-3 text-ink">{turma.nome}</td>
                        <td className="py-3 text-slate">{turma.serie}</td>
                        <td className="py-3 text-slate">{NOMES_TURNO[turma.turno]}</td>
                        <td className="py-3 text-slate">{turma.anoLetivo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}