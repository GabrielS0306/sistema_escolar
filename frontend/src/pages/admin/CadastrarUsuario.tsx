import { useState } from 'react';
import { registrar } from '../../services/authService';

export function CadastrarUsuario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState(false);
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro(null);
        setSucesso(false);
        setCarregando(true);

        try {
            await registrar(nome, email, senha);
            setSucesso(true);
            setNome('');
            setEmail('');
            setSenha('');
        } catch (err) {
            setErro('Não foi possível cadastrar. Verifique os dados e tente novamente.' + err);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="max-w-xl mx-auto px-8 py-12">
            <p className="text-sm text-slate">Gestão de acesso</p>

            <h1 className="font-serif text-3xl text-ink mt-1">Novo usuário</h1>

            <p className="text-sm text-slate mt-2">
                Cria o acesso de login. O vínculo com um perfil (Aluno, Professor, etc.)
                é feito separadamente depois.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 border-t border-ink/10 pt-8">
                {erro && (
                    <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-6">
                        {erro}
                    </p>
                )}
                {sucesso && (
                    <p className="text-sm text-ink bg-gold/10 border border-gold/30 rounded px-3 py-2 mb-6">
                        Usuário criado com sucesso.
                    </p>
                )}

                <label className="block text-sm text-slate mb-1">Nome</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="w-full border border-ink/20 rounded px-3 py-2 mb-5 focus:outline-none focus:border-gold"
                />

                <label className="block text-sm text-slate mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-ink/20 rounded px-3 py-2 mb-5 focus:outline-none focus:border-gold"
                />

                <label className="block text-sm text-slate mb-1">Senha provisória</label>
                <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    minLength={6}
                    className="w-full border border-ink/20 rounded px-3 py-2 mb-8 focus:outline-none focus:border-gold"
                />

                <button
                    type="submit"
                    disabled={carregando}
                    className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50"
                >
                    {carregando ? 'Criando...' : 'Criar usuário'}
                </button>
            </form>
        </div>
    );
}