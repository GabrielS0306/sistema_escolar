import { useSyncExternalStore } from 'react';

export type PreferenciaTema = 'claro' | 'escuro' | 'sistema';

// Mesma chave usada pelo script do index.html, que aplica o tema antes da primeira pintura.
const CHAVE_TEMA = 'sistema-escolar-tema';

const midiaEscuro = window.matchMedia('(prefers-color-scheme: dark)');
const ouvintes = new Set<() => void>();

function lerPreferencia(): PreferenciaTema {
    try {
        const valor = localStorage.getItem(CHAVE_TEMA);
        return valor === 'claro' || valor === 'escuro' || valor === 'sistema' ? valor : 'sistema';
    } catch {
        return 'sistema';
    }
}

function estaEscuro() {
    return document.documentElement.classList.contains('dark');
}

function aplicar(preferencia: PreferenciaTema) {
    const escuro = preferencia === 'escuro' || (preferencia === 'sistema' && midiaEscuro.matches);
    const html = document.documentElement;

    // Liga a transição de cores só durante a troca (senão toda interação ficaria "lenta").
    html.classList.add('trocando-tema');
    html.classList.toggle('dark', escuro);
    window.setTimeout(() => html.classList.remove('trocando-tema'), 250);
}

function avisarOuvintes() {
    ouvintes.forEach((ouvinte) => ouvinte());
}

// Se o usuário escolheu "sistema", acompanha quando o sistema operacional troca de tema.
midiaEscuro.addEventListener('change', () => {
    if (lerPreferencia() === 'sistema') {
        aplicar('sistema');
        avisarOuvintes();
    }
});

export function definirTema(preferencia: PreferenciaTema) {
    try {
        localStorage.setItem(CHAVE_TEMA, preferencia);
    } catch {
        // Sem localStorage (aba privada): o tema vale só até recarregar.
    }

    aplicar(preferencia);
    avisarOuvintes();
}

function assinar(ouvinte: () => void) {
    ouvintes.add(ouvinte);
    return () => { ouvintes.delete(ouvinte); };
}

export function useTema() {
    const preferencia = useSyncExternalStore(assinar, lerPreferencia);
    const escuro = useSyncExternalStore(assinar, estaEscuro);

    return { preferencia, escuro, definirTema };
}
