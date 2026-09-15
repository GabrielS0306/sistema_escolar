import { useState } from 'react';
import { useAlunos } from '../../hooks/useAlunos';
import { useNotas } from '../../hooks/useNotas';

export function ConsultaNotas() {
    const { alunos, carregando: carregandoAlunos } = useAlunos();
    const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null);
    const { notas, carregando, erro } = useNotas(alunoSelecionado);

    const selectClasses = 'border border-ink/20 rounded h-11 px-3 mb-8 focus:outline-none focus:border-gold';

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Gestão acadêmica</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Notas</h1>

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
                            <th className="py-3 text-sm font-normal text-slate">Bimestre</th>
                            <th className="py-3 text-sm font-normal text-slate">Avaliação</th>
                            <th className="py-3 text-sm font-normal text-slate">Nota</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notas.map((n) => (
                            <tr key={n.id} className="border-b border-ink/10 hover:bg-ink/5 transition-colors">
                                <td className="py-3 text-slate">{n.bimestre}º</td>
                                <td className="py-3 text-ink">{n.nomeAvaliacao}</td>
                                <td className="py-3 text-ink font-medium">{n.valor.toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}