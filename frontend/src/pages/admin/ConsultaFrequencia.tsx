import { useState } from 'react';
import { useAlunos } from '../../hooks/useAlunos';
import { useFrequencia } from '../../hooks/useFrequencia';

export function ConsultaFrequencia() {
    const { alunos, carregando: carregandoAlunos } = useAlunos();
    const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null);
    const { frequencias, carregando, erro } = useFrequencia(alunoSelecionado);

    const selectClasses = 'border border-ink/20 rounded h-11 px-3 mb-8 focus:outline-none focus:border-gold';

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Gestão acadêmica</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Frequência</h1>

            <select
                className={`${selectClasses} mt-8`}
                disabled={carregandoAlunos}
                onChange={(e) => setAlunoSelecionado(e.target.value || null)}
                defaultValue=""
            >
                <option value="">Selecione um aluno</option>

                {alunos.map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>{aluno.nomeUsuario}</option>
                ))}
            </select>

            {carregando && <p className="text-slate">Carregando...</p>}
            {erro && <p className="text-red-600">Erro: {erro}</p>}

            {alunoSelecionado && !carregando && (
                <table className="w-full border-t border-ink/10">
                    <thead>
                        <tr className="border-b border-ink/10 text-left">
                        <th className="py-3 text-sm font-normal text-slate">Data</th>
                        <th className="py-3 text-sm font-normal text-slate">Presença</th>
                        </tr>
                    </thead>
                    <tbody>
                        {frequencias.map((f) => (
                            <tr key={f.id} className="border-b border-ink/10 hover:bg-ink/5 transition-colors">
                                <td className="py-3 text-ink">{new Date(f.data).toLocaleDateString('pt-BR')}</td>
                                <td className="py-3">
                                    {f.presente ? (
                                        <span className="text-sm text-emerald-700">Presente</span>
                                    ) : (
                                        <span className="text-sm text-red-700">Falta</span>
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