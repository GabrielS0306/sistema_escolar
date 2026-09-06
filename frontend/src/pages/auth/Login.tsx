import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

const ROTAS_POR_PAPEL: Record<string, string> = {
    Aluno: '/dashboard/aluno',
    Professor: '/dashboard/professor',
    SemPerfil: '/dashboard/sem-perfil',
};

export function Login() {
    const navigate = useNavigate();
    const { salvarSessao } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro(null);
        setCarregando(true);

        try {
            const resposta = await login(email, senha);

            if (resposta.papeis.length > 1) {
                navigate('/selecionar-papel', { state: resposta });
            } else {
                const papel = resposta.papeis[0] ?? 'SemPerfil';
                salvarSessao({ ...resposta, papelAtivo: papel });
                navigate(ROTAS_POR_PAPEL[papel] ?? '/dashboard/sem-perfil');
            }
        } catch (err) {
            setErro('Email ou senha inválidos.' + err);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6">Entrar</h1>

                {erro && <p className="text-red-500 mb-4 text-sm">{erro}</p>}

                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border rounded p-2 mb-4"
                />

                <label className="block mb-1 text-sm font-medium">Senha</label>
                <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    className="w-full border rounded p-2 mb-6"
                />

                <button
                    type="submit"
                    disabled={carregando}
                    className="w-full bg-blue-600 text-white rounded p-2 font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {carregando ? 'Entrando...' : 'Entrar'}
                </button>

                <p className="text-sm text-center mt-4">
                    Não tem conta?{' '}

                    <Link to="/registro" className="text-blue-600 hover:underline">
                        Criar conta
                    </Link>
                </p>
            </form>
        </div>
    );
}