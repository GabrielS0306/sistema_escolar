import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrar } from '../../services/authService';

export function Registro() {
    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro(null);
        setCarregando(true);

        try {
            await registrar(nome, email, senha);
            navigate('/login');
        } catch (err) {
            setErro('Não foi possível registrar. Verifique os dados e tente novamente.' + {err});
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6">Criar conta</h1>

                {erro && <p className="text-red-500 mb-4 text-sm">{erro}</p>}

                <label className="block mb-1 text-sm font-medium">Nome</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="w-full border rounded p-2 mb-4"
                />

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
                    minLength={6}
                    className="w-full border rounded p-2 mb-6"
                />

                <button
                    type="submit"
                    disabled={carregando}
                    className="w-full bg-blue-600 text-white rounded p-2 font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {carregando ? 'Criando...' : 'Criar conta'}
                </button>

                <p className="text-sm text-center mt-4">
                    Já tem conta?{' '}

                    <Link to="/login" className="text-blue-600 hover:underline">
                        Entrar
                    </Link>
                </p>
            </form>
        </div>
    );
}