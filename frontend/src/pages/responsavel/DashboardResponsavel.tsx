import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMeusAlunos } from '../../hooks/useMeusAlunos';
import { useResumoAluno } from '../../hooks/useResumoAluno';
import { ResumoAlunoPainel } from '../../components/ResumoAlunoPainel';
import { ComunicadosRecentes } from '../../components/ComunicadosRecentes';
import { Pagina, PageHeader, Carregando, EstadoErro, EstadoVazio } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { saudacao } from '../../utils/datas';

export function DashboardResponsavel() {
    const { sessao } = useAuth();
    const { alunos, carregando, erro } = useMeusAlunos();
    const [alunoSelecionadoId, setAlunoSelecionadoId] = useState<string | null>(null);

    // Até o responsável escolher alguém, mostra o primeiro filho da lista.
    const alunoAtivoId = alunoSelecionadoId ?? alunos[0]?.id ?? null;
    const { resumo, carregando: carregandoResumo, erro: erroResumo } = useResumoAluno(alunoAtivoId);

    return (
        <Pagina>
            <PageHeader
                eyebrow="Portal do responsável"
                titulo={`${saudacao()}, ${sessao?.nome?.split(' ')[0] ?? ''}.`}
                descricao={alunos.length > 1 ? 'Escolha um filho para ver o acompanhamento.' : 'Acompanhamento escolar.'}
            />

            {carregando && <Carregando />}
            {erro && <EstadoErro mensagem={erro} />}

            {!carregando && !erro && alunos.length === 0 && (
                <Card>
                    <EstadoVazio
                        icone="usuarios"
                        titulo="Nenhum aluno vinculado à sua conta"
                        descricao="Procure a secretaria da escola para vincular seus filhos."
                    />
                </Card>
            )}

            {alunos.length > 0 && (
                <>
                    {/* Seletor de filho: cartões com nome e matrícula (só com 2 ou mais) */}
                    {alunos.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-1 mb-6" role="tablist" aria-label="Filhos">
                            {alunos.map((a) => {
                                const ativo = a.id === alunoAtivoId;

                                return (
                                    <button
                                        key={a.id}
                                        role="tab"
                                        aria-selected={ativo}
                                        onClick={() => setAlunoSelecionadoId(a.id)}
                                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left shrink-0 transition-colors ${
                                            ativo ? 'border-gold bg-gold-soft/50 shadow-card' : 'border-line bg-surface hover:border-line-strong'
                                        }`}
                                    >
                                        <Avatar nome={a.nomeUsuario} tamanho="md" />
                                        <span>
                                            <span className="block font-medium text-ink">{a.nomeUsuario}</span>
                                            <span className="block text-xs text-slate">Matrícula {a.matricula}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {carregandoResumo && <Carregando texto="Carregando acompanhamento..." />}
                    {erroResumo && <EstadoErro mensagem={erroResumo} />}

                    {resumo && !carregandoResumo && !erroResumo && (
                        <>
                            {alunos.length === 1 && (
                                <div className="flex items-center gap-3 mb-6">
                                    <Avatar nome={resumo.nomeAluno} tamanho="md" />
                                    <div>
                                        <p className="font-semibold text-ink">{resumo.nomeAluno}</p>
                                        <p className="text-xs text-slate">Matrícula {resumo.matricula}</p>
                                    </div>
                                </div>
                            )}

                            <ResumoAlunoPainel resumo={resumo} />
                        </>
                    )}
                </>
            )}

            <ComunicadosRecentes />
        </Pagina>
    );
}
