import { useAlunos } from '../hooks/useAlunos';

export function ListaAlunos() {
    const { alunos, carregando, erro } = useAlunos();

    if (carregando) return <p className="text-gray-500 p-4">Carregando alunos...</p>;
    if (erro) return <p className="text-red-500 p-4">Erro: {erro}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Alunos</h1>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border-b">Nome</th>
                        <th className="p-2 border-b">Matrícula</th>
                        <th className="p-2 border-b">Data de Nascimento</th>
                    </tr>
                </thead>
                <tbody>
                    {alunos.map((aluno) => (
                        <tr key={aluno.id} className="hover:bg-gray-50">
                            <td className="p-2 border-b">{aluno.nomeUsuario}</td>
                            <td className="p-2 border-b">{aluno.matricula}</td>
                            <td className="p-2 border-b">
                                {new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}