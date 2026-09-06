import { useState } from 'react';

interface Sessao {
    token: string;
    nome: string;
    papel: string;
}

const CHAVE_SESSAO = 'sistema-escolar-sessao';

export function useAuth() {
    const [sessao, setSessao] = useState<Sessao | null>(() => {
        const salvo = sessionStorage.getItem(CHAVE_SESSAO);
        return salvo ? JSON.parse(salvo) : null;
    });

    function salvarSessao(dados: Sessao) {
        sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(dados));
        setSessao(dados);
    }

    function sair() {
        sessionStorage.removeItem(CHAVE_SESSAO);
        setSessao(null);
    }

    return { sessao, salvarSessao, sair };
}