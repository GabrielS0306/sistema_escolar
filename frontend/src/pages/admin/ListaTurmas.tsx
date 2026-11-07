import { useState } from 'react';
import { useTurmas } from '../../hooks/useTurmas';
import { Pagina, PageHeader, BarraFerramentas, Carregando, EstadoErro, EstadoVazio } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Badge, type TomBadge } from '../../components/ui/Badge';
import { CampoBusca, Select } from '../../components/ui/Campo';
import { Tabela, TabelaCabecalho, TabelaCorpo, Th, Tr, Td } from '../../components/ui/Tabela';

const NOMES_TURNO = ['Manhã', 'Tarde', 'Noite'];
const TOM_TURNO: TomBadge[] = ['destaque', 'info', 'neutro'];

export function ListaTurmas() {
    const { turmas, carregando, erro } = useTurmas();
    const [busca, setBusca] = useState('');
    const [anoFiltro, setAnoFiltro] = useState('');

    // Há várias turmas com o mesmo nome em anos diferentes: o filtro por ano ajuda a achar a certa.
    const anos = [...new Set(turmas.map((t) => t.anoLetivo))].sort((a, b) => b - a);
    const termo = busca.toLowerCase();
    const filtradas = turmas.filter((t) =>
        `${t.nome} ${t.serie}`.toLowerCase().includes(termo) && (anoFiltro === '' || String(t.anoLetivo) === anoFiltro)
    );

    return (
        <Pagina>
            <PageHeader
                eyebrow="Acadêmico"
                titulo="Turmas"
                descricao={carregando ? undefined : `${turmas.length} turmas em ${anos.length} ${anos.length === 1 ? 'ano letivo' : 'anos letivos'}.`}
            />

            <Card semPadding>
                <div className="p-4">
                    <BarraFerramentas>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <CampoBusca value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou série..." />
                            <Select value={anoFiltro} onChange={(e) => setAnoFiltro(e.target.value)} className="sm:w-40" aria-label="Ano letivo">
                                <option value="">Todos os anos</option>
                                {anos.map((ano) => <option key={ano} value={ano}>{ano}</option>)}
                            </Select>
                        </div>
                    </BarraFerramentas>
                </div>

                {carregando && <Carregando />}
                {erro && <div className="px-4 pb-4"><EstadoErro mensagem={erro} /></div>}

                {!carregando && !erro && (
                    filtradas.length === 0 ? (
                        <EstadoVazio icone={busca || anoFiltro ? 'busca' : 'turmas'} titulo="Nenhuma turma encontrada" />
                    ) : (
                        <Tabela>
                            <TabelaCabecalho>
                                <Th>Turma</Th>
                                <Th>Série</Th>
                                <Th>Turno</Th>
                                <Th>Ano letivo</Th>
                            </TabelaCabecalho>
                            <TabelaCorpo>
                                {filtradas.map((t) => (
                                    <Tr key={t.id}>
                                        <Td className="font-medium">{t.nome}</Td>
                                        <Td className="text-slate">{t.serie}</Td>
                                        <Td><Badge tom={TOM_TURNO[t.turno] ?? 'neutro'}>{NOMES_TURNO[t.turno]}</Badge></Td>
                                        <Td className="text-slate tabular-nums">{t.anoLetivo}</Td>
                                    </Tr>
                                ))}
                            </TabelaCorpo>
                        </Tabela>
                    )
                )}
            </Card>
        </Pagina>
    );
}
