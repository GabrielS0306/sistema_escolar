import { useState } from 'react';
import { useAlunos } from '../../hooks/useAlunos';
import { useOcorrenciasRecentes } from '../../hooks/useOcorrenciasRecentes';
import { NovaOcorrenciaModal } from '../../components/NovaOcorrenciaModal';
import { TabelaOcorrencias } from '../../components/TabelaOcorrencias';

export function OcorrenciasFuncionario() {
    const { alunos } = useAlunos();
    const { ocorrencias, carregando, erro, recarregarDados } = useOcorrenciasRecentes();

    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);

    const filtradas = ocorrencias.filter((o) =>
        `${o.nomeAluno} ${o.descricao}`.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Secretaria</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Ocorrências</h1>
            <p className="text-sm text-slate mt-1">As 50 ocorrências mais recentes da escola.</p>

            <div className="flex items-center justify-between mt-8 mb-8">
                <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por aluno ou descrição..."
                    className="w-80 h-11 border border-ink/20 rounded px-3 focus:outline-none focus:border-gold"
                />

                <button
                    onClick={() => setModalAberto(true)}
                    className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90"
                >
                    Registrar ocorrência
                </button>
            </div>

            {carregando && <p className="text-slate">Carregando...</p>}
            {erro && <p className="text-red-600">Erro: {erro}</p>}
            {!carregando && !erro && <TabelaOcorrencias ocorrencias={filtradas} />}

            <NovaOcorrenciaModal
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                onRegistrada={() => { setModalAberto(false); recarregarDados(); }}
                alunos={alunos}
            />
        </div>
    );
}
