import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROTA_POR_PAPEL, ROTULO_PAPEL } from '../../types/auth';
import { TelaEntrada } from '../../components/auth/TelaEntrada';
import { Icone, type NomeIcone } from '../../components/ui/Icone';

const DETALHE_PAPEL: Record<string, { icone: NomeIcone; descricao: string }> = {
    Admin: { icone: 'usuarios', descricao: 'Usuários, cadastros e toda a gestão' },
    Coordenador: { icone: 'conselho', descricao: 'Acompanhamento pedagógico e pendências' },
    Professor: { icone: 'livro', descricao: 'Suas turmas, chamada e notas' },
    Responsavel: { icone: 'usuario', descricao: 'Acompanhar seus filhos' },
    Aluno: { icone: 'alunos', descricao: 'Suas notas, frequência e comunicados' },
    Funcionario: { icone: 'ocorrencias', descricao: 'Alunos e registro de ocorrências' },
};

export function SelecionarPapel() {
    const navigate = useNavigate();
    const location = useLocation();
    const { salvarSessao } = useAuth();

    const { token, nome, papeis } = (location.state ?? {}) as {
        token?: string;
        nome?: string;
        papeis?: string[];
    };

    // Chegou aqui sem passar pelo login (ex.: recarregou a página): volta para o login.
    useEffect(() => {
        if (!token) navigate('/login', { replace: true });
    }, [token, navigate]);

    if (!token || !nome || !papeis) return null;

    function escolher(papel: string) {
        salvarSessao({ token: token!, nome: nome!, papeis: papeis!, papelAtivo: papel });
        navigate(ROTA_POR_PAPEL[papel] ?? '/dashboard/sem-perfil');
    }

    return (
        <TelaEntrada>
            <h1 className="text-2xl font-semibold text-ink tracking-tight">Olá, {nome.split(' ')[0]}!</h1>
            <p className="text-sm text-slate mt-1 mb-6">Você tem mais de um perfil. Como quer entrar agora?</p>

            <div className="flex flex-col gap-2.5">
                {papeis.map((papel) => {
                    const detalhe = DETALHE_PAPEL[papel] ?? { icone: 'usuario' as const, descricao: '' };

                    return (
                        <button
                            key={papel}
                            onClick={() => escolher(papel)}
                            className="group flex items-center gap-4 w-full text-left rounded-xl border border-line bg-surface px-4 py-3.5 shadow-card
                                transition-all hover:border-gold hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                        >
                            <span className="w-10 h-10 rounded-lg bg-gold-soft text-gold flex items-center justify-center">
                                <Icone nome={detalhe.icone} tamanho={20} />
                            </span>
                            <span className="flex-1 min-w-0">
                                <span className="block font-medium text-ink">{ROTULO_PAPEL[papel] ?? papel}</span>
                                {detalhe.descricao && <span className="block text-xs text-slate">{detalhe.descricao}</span>}
                            </span>
                            <Icone nome="chevronDireita" className="text-slate group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                        </button>
                    );
                })}
            </div>
        </TelaEntrada>
    );
}
