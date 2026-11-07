export function saudacao(data = new Date()) {
    const hora = data.getHours();

    if (hora < 12) return 'Bom dia';
    if (hora < 18) return 'Boa tarde';

    return 'Boa noite';
}

// Ex.: "domingo, 25 de outubro" (a primeira letra é maiúscula via CSS, onde for exibido).
export function hojePorExtenso(data = new Date()) {
    return data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function dataCurta(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR');
}

// "hoje", "ontem", "há 3 dias" — para listas de comunicados e ocorrências recentes.
export function tempoRelativo(iso: string, agora = new Date()) {
    const inicioDoDia = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dias = Math.round((inicioDoDia(agora) - inicioDoDia(new Date(iso))) / 86_400_000);

    if (dias <= 0) return 'hoje';
    if (dias === 1) return 'ontem';
    if (dias < 7) return `há ${dias} dias`;

    return dataCurta(iso);
}
