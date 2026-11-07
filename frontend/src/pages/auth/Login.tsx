import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { mensagemDeErro } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { ROTA_POR_PAPEL } from '../../types/auth';
import { TelaEntrada } from '../../components/auth/TelaEntrada';
import { Input } from '../../components/ui/Campo';
import { Button } from '../../components/ui/Button';
import { EstadoErro } from '../../components/ui/Estrutura';

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
                navigate(ROTA_POR_PAPEL[papel] ?? '/dashboard/sem-perfil');
            }
        } catch (err) {
            // 401 traz "Email ou senha inválidos." do backend; API fora do ar traz a mensagem de conexão.
            setErro(mensagemDeErro(err));
        } finally {
            setCarregando(false);
        }
    }

    return (
        <TelaEntrada>
            <h1 className="text-2xl font-semibold text-ink tracking-tight">Entrar</h1>
            <p className="text-sm text-slate mt-1 mb-8">Use o e-mail e a senha cadastrados pela escola.</p>

            {erro && <div className="mb-5"><EstadoErro mensagem={erro} /></div>}

            <form onSubmit={handleSubmit}>
                <Input
                    label="E-mail"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                />

                <Input
                    label="Senha"
                    type="password"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />

                <Button type="submit" carregando={carregando} className="w-full mt-2">
                    {carregando ? 'Entrando...' : 'Entrar'}
                </Button>
            </form>

            <p className="text-xs text-slate text-center mt-8">
                Esqueceu a senha? Procure a secretaria da escola.
            </p>
        </TelaEntrada>
    );
}
