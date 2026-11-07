// Foto do usuário ou, sem foto, as iniciais do nome ("Ana Souza" → "AS").
function iniciais(nome: string) {
    const partes = nome.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return '?';

    const primeira = partes[0][0];
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';

    return (primeira + ultima).toUpperCase();
}

interface AvatarProps {
    nome: string;
    fotoUrl?: string | null;
    tamanho?: 'sm' | 'md';
}

export function Avatar({ nome, fotoUrl, tamanho = 'sm' }: AvatarProps) {
    const classes = tamanho === 'md' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs';

    if (fotoUrl) return <img src={fotoUrl} alt="" className={`${classes} rounded-full object-cover shrink-0`} />;

    return (
        <span className={`${classes} rounded-full bg-gold-soft text-gold font-semibold flex items-center justify-center shrink-0`} aria-hidden="true">
            {iniciais(nome)}
        </span>
    );
}
