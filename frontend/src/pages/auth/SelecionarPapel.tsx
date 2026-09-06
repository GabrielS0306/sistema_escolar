import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ROTAS_POR_PAPEL: Record<string, string> = {
    Admin: '/dashboard/admin',
    Coordenador: '/dashboard/coordenador',
    Professor: '/dashboard/professor',
    Responsavel: '/dashboard/responsavel',
    Aluno: '/dashboard/aluno',
    Funcionario: '/dashboard/funcionario',
};

export function SelecionarPapel() {
    const navigate = useNavigate();
    const location = useLocation();
    const { salvarSessao } = useAuth();

    const { token, nome, papeis } = (location.state ?? {}) as {
        token: string;
        nome: string;
        papeis: string[];
    };

    if (!token) {
        navigate('/login');

        return null;
    }

    function escolher(papel: string) {
        salvarSessao({ token, nome, papeis, papelAtivo: papel });

        navigate(ROTAS_POR_PAPEL[papel] ?? '/dashboard/sem-perfil');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-2">Olá, {nome}!</h1>

                <p className="text-gray-600 mb-6">Como você quer entrar?</p>

                <div className="flex flex-col gap-3">
                    {papeis.map((papel) => (
                        <button
                            key={papel}
                            onClick={() => escolher(papel)}
                            className="w-full bg-blue-600 text-white rounded p-3 font-medium hover:bg-blue-700"
                        >
                            Entrar como {papel}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}