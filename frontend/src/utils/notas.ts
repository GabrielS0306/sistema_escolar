// Aceita "7,5" e "7.5" (no Brasil se digita com vírgula); devolve null se não for uma nota de 0 a 10.
export function lerNota(texto: string): number | null {
    if (texto.trim() === '') return null;

    const valor = Number(texto.replace(',', '.'));

    return Number.isFinite(valor) && valor >= 0 && valor <= 10 ? valor : null;
}

// Nota abaixo disso aparece em vermelho nas listagens.
export const NOTA_MINIMA = 6;
