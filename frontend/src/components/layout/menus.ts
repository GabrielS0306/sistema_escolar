import type { NomeIcone } from '../ui/Icone';

export interface ItemMenu {
    path: string;
    label: string;
    icone: NomeIcone;
    // Só fica ativo na URL exata (itens "Painel", que são o índice da área).
    exato?: boolean;
    // Outras URLs em que o item conta como ativo (ex.: telas internas de uma turma).
    ativoTambemEm?: string[];
    // Escondido para o Coordenador (o backend também bloqueia).
    somenteAdmin?: boolean;
}

export interface SecaoMenu {
    titulo?: string;
    itens: ItemMenu[];
}

// Admin e Coordenador são áreas separadas (mesmo que compartilhem telas): a rota define a área,
// e não a sessão — assim trocar de papel nunca deixa o menu de um papel na área do outro.
export type Area = 'admin' | 'coordenador' | 'professor' | 'aluno' | 'responsavel' | 'funcionario';

export interface ConfigArea {
    nome: string;     // aparece no topo do caminho ("Gestão › Turmas")
    secoes: SecaoMenu[];
}

// Admin e Coordenador usam as mesmas telas de gestão; só o prefixo da URL muda.
function menuGestao(base: string, ehCoordenador: boolean): SecaoMenu[] {
    const secoes: SecaoMenu[] = [
        { itens: [{ path: base, label: 'Painel', icone: 'painel', exato: true }] },
        {
            titulo: 'Pessoas',
            itens: [
                { path: `${base}/usuarios`, label: 'Usuários', icone: 'usuarios', somenteAdmin: true, exato: true },
                { path: `${base}/usuarios/novo`, label: 'Novo usuário', icone: 'novoUsuario' },
                { path: `${base}/alunos`, label: 'Alunos', icone: 'alunos' },
                { path: `${base}/professores`, label: 'Professores', icone: 'professores' },
            ],
        },
        {
            titulo: 'Acadêmico',
            itens: [
                { path: `${base}/turmas`, label: 'Turmas', icone: 'turmas' },
                { path: `${base}/frequencia`, label: 'Frequência', icone: 'frequencia' },
                { path: `${base}/notas`, label: 'Notas', icone: 'notas' },
                { path: `${base}/recuperacao`, label: 'Recuperação', icone: 'recuperacao' },
                { path: `${base}/conselhos`, label: 'Conselho de classe', icone: 'conselho' },
            ],
        },
        {
            titulo: 'Comunicação',
            itens: [{ path: `${base}/comunicados`, label: 'Comunicados', icone: 'comunicados' }],
        },
    ];

    return secoes
        .map((secao) => ({ ...secao, itens: secao.itens.filter((item) => !(ehCoordenador && item.somenteAdmin)) }))
        .filter((secao) => secao.itens.length > 0);
}

export function configDaArea(area: Area): ConfigArea {
    switch (area) {
        case 'admin':
            return { nome: 'Gestão', secoes: menuGestao('/admin', false) };
        case 'coordenador':
            return { nome: 'Coordenação', secoes: menuGestao('/coordenador', true) };
        case 'professor':
            return {
                nome: 'Diário de classe',
                secoes: [{
                    itens: [
                        { path: '/dashboard/professor', label: 'Minhas turmas', icone: 'turmas', exato: true, ativoTambemEm: ['/dashboard/professor/turma'] },
                        { path: '/dashboard/professor/conselhos', label: 'Conselho de classe', icone: 'conselho' },
                        { path: '/dashboard/professor/comunicados', label: 'Comunicados', icone: 'comunicados' },
                    ],
                }],
            };
        case 'aluno':
            return {
                nome: 'Portal do aluno',
                secoes: [{ itens: [{ path: '/dashboard/aluno', label: 'Meu painel', icone: 'painel', exato: true }] }],
            };
        case 'responsavel':
            return {
                nome: 'Portal do responsável',
                secoes: [{ itens: [{ path: '/dashboard/responsavel', label: 'Meus filhos', icone: 'usuarios', exato: true }] }],
            };
        case 'funcionario':
            return {
                nome: 'Secretaria',
                secoes: [{
                    itens: [
                        { path: '/dashboard/funcionario', label: 'Painel', icone: 'painel', exato: true },
                        { path: '/dashboard/funcionario/alunos', label: 'Alunos', icone: 'alunos' },
                        { path: '/dashboard/funcionario/ocorrencias', label: 'Ocorrências', icone: 'ocorrencias' },
                    ],
                }],
            };
    }
}

export function itemEstaAtivo(item: ItemMenu, pathname: string) {
    const caminhos = [item.path, ...(item.ativoTambemEm ?? [])];

    return caminhos.some((caminho, i) => {
        // "exato" vale só para o path principal; os extras sempre aceitam subrotas.
        if (i === 0 && item.exato) return pathname === caminho;
        return pathname === caminho || pathname.startsWith(`${caminho}/`);
    });
}
