import { useState } from 'react';
import { useAlunos } from '../hooks/useAlunos';
import { useFrequencia } from '../hooks/useFrequencia';

export function ConsultaFrequencia() {
    const { alunos, carregando: carregandoAlunos } = useAlunos();
    const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null);
    const { frequencias, carregando, erro } = useFrequencia(alunoSelecionado);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Frequência</h1>

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

            {carregando && <p className="text-gray-500">Carregando frequência...</p>}
            {erro && <p className="text-red-500">Erro: {erro}</p>}

            {alunoSelecionado && !carregando && (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                        <th className="p-2 border-b">Data</th>
                        <th className="p-2 border-b">Presença</th>
                        </tr>
                    </thead>

                    <tbody>
                        {frequencias.map((f) => (
                            <tr key={f.id} className="hover:bg-gray-50">
                                <td className="p-2 border-b">
                                    {new Date(f.data).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="p-2 border-b">
                                    {f.presente ? (
                                        <span className="text-green-600 font-medium">Presente</span>
                                    ) : (
                                        <span className="text-red-600 font-medium">Falta</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}