import { useProfessores } from '../hooks/useProfessores';

export function ListaProfessores() {
    const { professores, carregando, erro } = useProfessores();

    if (carregando) return <p className="text-gray-500 p-4">Carregando professores...</p>;
    if (erro) return <p className="text-red-500 p-4">Erro: {erro}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Professores</h1>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border-b">Nome</th>
                    </tr>
                </thead>

                <tbody>
                    {professores.map((professor) => (
                        <tr key={professor.id} className="hover:bg-gray-50">
                        <td className="p-2 border-b">{professor.nomeUsuario}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}