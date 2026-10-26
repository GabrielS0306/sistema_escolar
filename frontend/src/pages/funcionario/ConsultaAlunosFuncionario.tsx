import { useState } from 'react';
import { useAlunos } from '../../hooks/useAlunos';
import { NovaOcorrenciaModal } from '../../components/NovaOcorrenciaModal';

export function ConsultaAlunosFuncionario() {
    const { alunos, carregando, erro } = useAlunos();

    const [busca, setBusca] = useState('');
    const [alunoOcorrencia, setAlunoOcorrencia] = useState<string | null>(null);
    const [aviso, setAviso] = useState<string | null>(null);

    const termo = busca.toLowerCase();
    const filtrados = alunos.filter((a) =>
        a.nomeUsuario.toLowerCase().includes(termo) || a.matricula.toLowerCase().includes(termo)
    );

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Secretaria</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Alunos</h1>

            <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou matrícula..."
                className="w-80 h-11 border border-ink/20 rounded px-3 mt-8 mb-8 focus:outline-none focus:border-gold"
            />

            {aviso && (
                <div className="flex items-center justify-between border-l-2 border-gold bg-gold/10 px-4 py-3 mb-8">
                    <p className="text-sm text-ink">{aviso}</p>
                    <button onClick={() => setAviso(null)} className="text-slate hover:text-ink leading-none">×</button>
                </div>
            )}

            {carregando && <p className="text-slate">Carregando...</p>}
            {erro && <p className="text-red-600">Erro: {erro}</p>}

            {!carregando && !erro && (
                filtrados.length === 0 ? (
                    <p className="text-sm text-slate">Nenhum aluno encontrado.</p>
                ) : (
                    <table className="w-full border-t border-ink/10">
                        <thead>
                            <tr className="border-b border-ink/10 text-left">
                                <th className="py-3 text-sm font-normal text-slate">Aluno</th>
                                <th className="py-3 text-sm font-normal text-slate">Matrícula</th>
                                <th className="py-3"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtrados.map((a) => (
                                <tr key={a.id} className="border-b border-ink/10">
                                    <td className="py-3 text-ink">{a.nomeUsuario}</td>
                                    <td className="py-3 text-slate">{a.matricula}</td>
                                    <td className="py-3 text-right">
                                        <button
                                            onClick={() => setAlunoOcorrencia(a.id)}
                                            className="text-sm text-slate hover:text-gold transition-colors"
                                        >
                                            Registrar ocorrência
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}

            <NovaOcorrenciaModal
                aberto={alunoOcorrencia !== null}
                onFechar={() => setAlunoOcorrencia(null)}
                onRegistrada={() => { setAlunoOcorrencia(null); setAviso('Ocorrência registrada.'); }}
                alunos={alunos}
                alunoInicialId={alunoOcorrencia ?? undefined}
            />
        </div>
    );
}
