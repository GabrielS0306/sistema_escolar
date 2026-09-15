import { useAlunos } from '../../hooks/useAlunos';

export function ListaAlunos() {
    const { alunos, carregando, erro } = useAlunos();

    if (carregando) return <p className="text-slate px-12 py-10">Carregando...</p>;
    if (erro) return <p className="text-red-600 px-12 py-10">Erro: {erro}</p>;

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Gestão de pessoas</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Alunos</h1>

            <table className="w-full mt-10 border-t border-ink/10">
                <thead>
                    <tr className="border-b border-ink/10 text-left">
                        <th className="py-3 text-sm font-normal text-slate">Nome</th>
                        <th className="py-3 text-sm font-normal text-slate">Matrícula</th>
                        <th className="py-3 text-sm font-normal text-slate">Data de nascimento</th>
                    </tr>
                </thead>
                <tbody>
                    {alunos.map((aluno) => (
                        <tr key={aluno.id} className="border-b border-ink/10 hover:bg-ink/5 transition-colors">
                            <td className="py-3 text-ink">{aluno.nomeUsuario}</td>
                            <td className="py-3 text-slate">{aluno.matricula}</td>
                            <td className="py-3 text-slate">
                                {new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}