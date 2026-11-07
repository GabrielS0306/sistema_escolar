import { useState } from 'react';
import { useComunicados } from '../hooks/useComunicados';
import { useToast } from '../hooks/useToast';
import { ListaComunicados } from './ListaComunicados';
import { NovoComunicadoModal, type OpcaoTurma } from './NovoComunicadoModal';
import { Pagina, PageHeader, BarraFerramentas, Carregando, EstadoErro } from './ui/Estrutura';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { CampoBusca } from './ui/Campo';

interface PaginaComunicadosProps {
    eyebrow: string;
    descricao: string;
    turmas: OpcaoTurma[];
    // Professor: só envia para as próprias turmas (o backend também exige).
    somenteTurma?: boolean;
}

// Mural + envio de comunicados, usado pela gestão e pelo professor.
export function PaginaComunicados({ eyebrow, descricao, turmas, somenteTurma = false }: PaginaComunicadosProps) {
    const toast = useToast();
    const { comunicados, carregando, erro, recarregarDados } = useComunicados();

    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);

    const semTurmas = somenteTurma && turmas.length === 0;
    const filtrados = comunicados.filter((c) =>
        `${c.titulo} ${c.mensagem}`.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <Pagina estreita>
            <PageHeader
                eyebrow={eyebrow}
                titulo="Comunicados"
                descricao={descricao}
                acoes={
                    <Button
                        icone="mais"
                        onClick={() => setModalAberto(true)}
                        disabled={semTurmas}
                        title={semTurmas ? 'Você não tem turmas vinculadas.' : undefined}
                    >
                        Novo comunicado
                    </Button>
                }
            />

            <Card>
                <BarraFerramentas>
                    <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar comunicado..." />
                </BarraFerramentas>

                {carregando && <Carregando />}
                {erro && <EstadoErro mensagem={erro} />}
                {!carregando && !erro && (
                    <ListaComunicados
                        comunicados={filtrados}
                        mensagemVazia={busca ? 'Nenhum comunicado encontrado' : 'Nenhum comunicado por enquanto.'}
                    />
                )}
            </Card>

            <NovoComunicadoModal
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                onEnviado={() => {
                    setModalAberto(false);
                    toast.sucesso('Comunicado enviado.');
                    recarregarDados();
                }}
                turmas={turmas}
                somenteTurma={somenteTurma}
            />
        </Pagina>
    );
}
