import { useMeuResumo } from '../../hooks/useMeuResumo';
import { ResumoAlunoPainel } from '../../components/ResumoAlunoPainel';

export function DashboardAluno() {
    const { resumo, carregando, erro } = useMeuResumo();

    if (carregando) return <p className="text-slate px-12 py-10">Carregando...</p>;
    if (erro) return <p className="text-red-600 px-12 py-10">Erro: {erro}</p>;
    if (!resumo) return null;

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Portal do aluno</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Olá, {resumo.nomeAluno.split(' ')[0]}.</h1>
            <p className="text-sm text-slate mt-1">Matrícula {resumo.matricula}</p>

            <ResumoAlunoPainel resumo={resumo} />
        </div>
    );
}
