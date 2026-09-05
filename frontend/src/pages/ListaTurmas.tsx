import { useTurmas } from '../hooks/useTurmas';

const NOMES_TURNO = ['Manhã', 'Tarde', 'Noite'];

export function ListaTurmas() {
    const { turmas, carregando, erro } = useTurmas();

    if (carregando) return <p className="text-gray-500 p-4">Carregando turmas...</p>;
    if (erro) return <p className="text-red-500 p-4">Erro: {erro}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Turmas</h1>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border-b">Nome</th>
                        <th className="p-2 border-b">Série</th>
                        <th className="p-2 border-b">Turno</th>
                        <th className="p-2 border-b">Ano Letivo</th>
                    </tr>
                </thead>

                <tbody>
                    {turmas.map((turma) => (
                        <tr key={turma.id} className="hover:bg-gray-50">
                        <td className="p-2 border-b">{turma.nome}</td>
                        <td className="p-2 border-b">{turma.serie}</td>
                        <td className="p-2 border-b">{NOMES_TURNO[turma.turno]}</td>
                        <td className="p-2 border-b">{turma.anoLetivo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}