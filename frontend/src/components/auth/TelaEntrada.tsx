import type { ReactNode } from 'react';
import { SeletorTema } from '../ui/SeletorTema';

// Moldura das telas de entrada (login e seleção de papel): marca à esquerda, conteúdo à direita.
export function TelaEntrada({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-paper">
            <aside className="hidden lg:flex flex-col justify-between bg-sidebar text-sidebar-fg p-12 relative overflow-hidden">
                <Marca />

                <div className="relative z-10 max-w-md">
                    <p className="font-serif text-4xl leading-tight">
                        A vida escolar inteira, <span className="text-gold">num lugar só.</span>
                    </p>
                    <p className="text-sidebar-muted mt-4">
                        Notas, frequência, conselho de classe, comunicados e ocorrências — para gestão,
                        professores, alunos e famílias.
                    </p>
                </div>

                <p className="text-xs text-sidebar-muted relative z-10">Sistema de Gestão Escolar</p>

                {/* Detalhe decorativo: anéis dourados no canto */}
                <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full border border-gold/20" aria-hidden="true" />
                <div className="absolute -right-8 -bottom-8 w-64 h-64 rounded-full border border-gold/10" aria-hidden="true" />
            </aside>

            <main className="flex flex-col">
                <div className="flex items-center justify-between p-4 sm:p-6">
                    <div className="lg:hidden"><Marca compacta /></div>
                    <div className="ml-auto"><SeletorTema /></div>
                </div>

                <div className="flex-1 flex items-center justify-center px-4 pb-16">
                    <div className="w-full max-w-sm animate-subir">{children}</div>
                </div>
            </main>
        </div>
    );
}

function Marca({ compacta = false }: { compacta?: boolean }) {
    return (
        <div className="flex items-center gap-2.5 relative z-10">
            <span className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center">
                <span className="font-serif text-[#1B2A4A] font-bold">SE</span>
            </span>
            <span className={`font-serif text-xl ${compacta ? 'text-ink' : ''}`}>Sistema Escolar</span>
        </div>
    );
}
