import { useMeuResumo } from '../../hooks/useMeuResumo';
import { ResumoAlunoPainel } from '../../components/ResumoAlunoPainel';
import { ComunicadosRecentes } from '../../components/ComunicadosRecentes';
import { Pagina, PageHeader, Carregando, EstadoErro } from '../../components/ui/Estrutura';
import { saudacao } from '../../utils/datas';

export function DashboardAluno() {
    const { resumo, carregando, erro } = useMeuResumo();

    return (
        <Pagina>
            {carregando && <Carregando />}
            {erro && <EstadoErro mensagem={erro} />}

            {resumo && (
                <>
                    <PageHeader
                        eyebrow="Portal do aluno"
                        titulo={`${saudacao()}, ${resumo.nomeAluno.split(' ')[0]}.`}
                        descricao={`Matrícula ${resumo.matricula}`}
                    />

                    <ResumoAlunoPainel resumo={resumo} />
                    <ComunicadosRecentes />
                </>
            )}
        </Pagina>
    );
}
