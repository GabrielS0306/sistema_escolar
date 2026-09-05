import { useState } from 'react';
import { useAlunos } from '../hooks/useAlunos';
import { useNotas } from '../hooks/useNotas';

export function ConsultaNotas() {
    const { alunos, carregando: carregandoAlunos } = useAlunos();
    const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null);
    const { notas, carregando, erro } = useNotas(alunoSelecionado);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Notas</h1>

            <select
                className="border rounded p-2 mb-4"
                disabled={carregandoAlunos}
                onChange={(e) => setAlunoSelecionado(e.target.value || null)}
                defaultValue=""
            >
                <option value="">Selecione um aluno</option>

                {alunos.map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>
                        {aluno.nomeUsuario}
                    </option>
                ))}
            </select>

            {carregando && <p className="text-gray-500">Carregando notas...</p>}
            {erro && <p className="text-red-500">Erro: {erro}</p>}

            {alunoSelecionado && !carregando && (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                        <th className="p-2 border-b">Bimestre</th>
                        <th className="p-2 border-b">Avaliação</th>
                        <th className="p-2 border-b">Nota</th>
                        </tr>
                    </thead>

                    <tbody>
                        {notas.map((n) => (
                            <tr key={n.id} className="hover:bg-gray-50">
                                <td className="p-2 border-b">{n.bimestre}º</td>
                                <td className="p-2 border-b">{n.nomeAvaliacao}</td>
                                <td className="p-2 border-b font-medium">{n.valor.toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}