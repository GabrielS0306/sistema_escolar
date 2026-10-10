import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMeusAlunos } from '../../hooks/useMeusAlunos';
import { useResumoAluno } from '../../hooks/useResumoAluno';
import { ResumoAlunoPainel } from '../../components/ResumoAlunoPainel';

export function DashboardResponsavel() {
    const { sessao } = useAuth();
    const { alunos, carregando, erro } = useMeusAlunos();
    const [alunoSelecionadoId, setAlunoSelecionadoId] = useState<string | null>(null);

    // Até o responsável escolher alguém, mostra o primeiro filho da lista.
    const alunoAtivoId = alunoSelecionadoId ?? alunos[0]?.id ?? null;
    const { resumo, carregando: carregandoResumo, erro: erroResumo } = useResumoAluno(alunoAtivoId);

    if (carregando) return <p className="text-slate px-12 py-10">Carregando...</p>;
    if (erro) return <p className="text-red-600 px-12 py-10">Erro: {erro}</p>;

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Portal do responsável</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Olá, {sessao?.nome?.split(' ')[0]}.</h1>

            {alunos.length === 0 ? (
                <p className="text-sm text-slate mt-10">
                    Nenhum aluno vinculado à sua conta. Procure a secretaria da escola.
                </p>
            ) : (
                <>
                    {alunos.length > 1 && (
                        <div className="flex gap-6 mt-8 border-b border-ink/10">
                            {alunos.map((a) => (
                                <button
                                    key={a.id}
                                    onClick={() => setAlunoSelecionadoId(a.id)}
                                    className={`pb-3 -mb-px text-sm border-b-2 transition-colors ${
                                        a.id === alunoAtivoId
                                            ? 'border-gold text-ink'
                                            : 'border-transparent text-slate hover:text-ink'
                                    }`}
                                >
                                    {a.nomeUsuario}
                                </button>
                            ))}
                        </div>
                    )}

                    {carregandoResumo && <p className="text-slate mt-10">Carregando resumo...</p>}
                    {erroResumo && <p className="text-red-600 mt-10">Erro: {erroResumo}</p>}

                    {resumo && !carregandoResumo && !erroResumo && (
                        <>
                            <div className="mt-8">
                                <p className="font-serif text-2xl text-ink">{resumo.nomeAluno}</p>
                                <p className="text-sm text-slate mt-1">Matrícula {resumo.matricula}</p>
                            </div>

                            <ResumoAlunoPainel resumo={resumo} />
                        </>
                    )}
                </>
            )}
        </div>
    );
}
