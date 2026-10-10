import { useState } from 'react';
import { useComunicados } from '../../hooks/useComunicados';
import { useMinhasTurmas } from '../../hooks/useMinhasTurmas';
import { ListaComunicados } from '../../components/ListaComunicados';
import { NovoComunicadoModal } from '../../components/NovoComunicadoModal';

export function ComunicadosProfessor() {
    const { comunicados, carregando, erro, recarregarDados } = useComunicados();
    const { vinculos } = useMinhasTurmas();

    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);

    // Um vínculo por disciplina: o professor pode ter a mesma turma mais de uma vez.
    const opcoesTurma = vinculos
        .filter((v, i) => vinculos.findIndex((x) => x.turmaId === v.turmaId) === i)
        .map((v) => ({ id: v.turmaId, label: v.turma }));

    const filtrados = comunicados.filter((c) =>
        `${c.titulo} ${c.mensagem}`.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Diário de classe</p>
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
                    disabled={opcoesTurma.length === 0}
                    title={opcoesTurma.length === 0 ? 'Você não tem turmas vinculadas.' : undefined}
                    className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
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
                somenteTurma
            />
        </div>
    );
}
