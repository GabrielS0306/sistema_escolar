import { useState } from 'react';
import { useAlunos } from '../../hooks/useAlunos';
import { useOcorrenciasRecentes } from '../../hooks/useOcorrenciasRecentes';
import { useToast } from '../../hooks/useToast';
import { NovaOcorrenciaModal } from '../../components/NovaOcorrenciaModal';
import { TabelaOcorrencias } from '../../components/TabelaOcorrencias';
import { Pagina, PageHeader, BarraFerramentas, Carregando, EstadoErro } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CampoBusca, Select } from '../../components/ui/Campo';
import { TIPO_OCORRENCIA_LABEL } from '../../types/ocorrencia';

export function OcorrenciasFuncionario() {
    const toast = useToast();
    const { alunos } = useAlunos();
    const { ocorrencias, carregando, erro, recarregarDados } = useOcorrenciasRecentes();

    const [busca, setBusca] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState(-1);  // -1 = todos
    const [modalAberto, setModalAberto] = useState(false);

    const filtradas = ocorrencias
        .filter((o) => `${o.nomeAluno} ${o.descricao}`.toLowerCase().includes(busca.toLowerCase()))
        .filter((o) => tipoFiltro === -1 || o.tipo === tipoFiltro);

    return (
        <Pagina>
            <PageHeader
                eyebrow="Secretaria"
                titulo="Ocorrências"
                descricao="As 50 ocorrências mais recentes da escola."
                acoes={<Button icone="mais" onClick={() => setModalAberto(true)}>Registrar ocorrência</Button>}
            />

            <Card semPadding>
                <div className="p-4">
                    <BarraFerramentas>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por aluno ou descrição..." />
                            <Select value={tipoFiltro} onChange={(e) => setTipoFiltro(Number(e.target.value))} className="sm:w-44" aria-label="Tipo">
                                <option value={-1}>Todos os tipos</option>
                                {TIPO_OCORRENCIA_LABEL.map((label, valor) => <option key={valor} value={valor}>{label}</option>)}
                            </Select>
                        </div>
                    </BarraFerramentas>
                </div>

                {carregando && <Carregando />}
                {erro && <div className="px-4 pb-4"><EstadoErro mensagem={erro} /></div>}
                {!carregando && !erro && (
                    <TabelaOcorrencias
                        ocorrencias={filtradas}
                        mensagemVazia={busca || tipoFiltro !== -1 ? 'Nenhuma ocorrência encontrada' : 'Nenhuma ocorrência registrada ainda'}
                    />
                )}
            </Card>

            <NovaOcorrenciaModal
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                onRegistrada={() => {
                    setModalAberto(false);
                    toast.sucesso('Ocorrência registrada.');
                    recarregarDados();
                }}
                alunos={alunos}
            />
        </Pagina>
    );
}
