import { useState } from 'react';
import { useComunicados } from '../../hooks/useComunicados';
import { useTurmas } from '../../hooks/useTurmas';
import { ListaComunicados } from '../../components/ListaComunicados';
import { NovoComunicadoModal } from '../../components/NovoComunicadoModal';

const TURNO_LABEL = ['Manhã', 'Tarde', 'Noite'];

export function Comunicados() {
    const { comunicados, carregando, erro, recarregarDados } = useComunicados();
    const { turmas } = useTurmas();

    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);

    // Há várias turmas com o mesmo nome; ano e turno ajudam a escolher a certa.
    const opcoesTurma = turmas.map((t) => ({
        id: t.id,
        label: `${t.nome} · ${t.anoLetivo} · ${TURNO_LABEL[t.turno]}`,
    }));

    const filtrados = comunicados.filter((c) =>
        `${c.titulo} ${c.mensagem}`.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Comunicação</p>
            <h1 className="font-serif text-3xl text-ink mt-1">Comunicados</h1>

            <div className="flex items-center justify-between mt-8 mb-8">
                <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar comunicado..."
                    className="w-72 h-11 border border-ink/20 rounded px-3 focus:outline-none focus:border-gold"
                />

                <button
                    onClick={() => setModalAberto(true)}
                    className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90"
                >
                    Novo comunicado
                </button>
            </div>

            {carregando && <p className="text-slate">Carregando...</p>}
            {erro && <p className="text-red-600">Erro: {erro}</p>}
            {!carregando && !erro && <ListaComunicados comunicados={filtrados} />}

            <NovoComunicadoModal
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                onEnviado={() => { setModalAberto(false); recarregarDados(); }}
                turmas={opcoesTurma}
            />
        </div>
    );
}
