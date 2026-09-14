import { useState, useMemo } from 'react';
import { registrar } from '../../services/authService';
import {
    criarAdmin,
    criarCoordenador,
    criarProfessor,
    criarFuncionario,
    criarAluno,
    criarResponsavel,
    vincularAlunoResponsavel,
} from '../../services/perfilService';
import { useAlunos } from '../../hooks/useAlunos';

type Funcao = 'Admin' | 'Coordenador' | 'Professor' | 'Responsavel' | 'Aluno' | 'Funcionario';

const FUNCOES: { value: Funcao; label: string }[] = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Coordenador', label: 'Coordenador' },
    { value: 'Professor', label: 'Professor' },
    { value: 'Responsavel', label: 'Responsável' },
    { value: 'Aluno', label: 'Aluno' },
    { value: 'Funcionario', label: 'Funcionário' },
];

export function CadastrarUsuario() {
    const [etapa, setEtapa] = useState<1 | 2>(1);
    const [usuarioId, setUsuarioId] = useState<string | null>(null);
    const [funcao, setFuncao] = useState<Funcao>('Aluno');
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [endereco, setEndereco] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [sexo, setSexo] = useState<'0' | '1'>('0');
    const [foto, setFoto] = useState<File | null>(null);
    const fotoPreview = useMemo(() => (foto ? URL.createObjectURL(foto) : null), [foto]);

    const [matricula, setMatricula] = useState('');

    const { alunos } = useAlunos();
    const [alunoVinculadoId, setAlunoVinculadoId] = useState('');

    async function handleSubmitEtapa1(e: React.FormEvent) {
        e.preventDefault();
        setErro(null);
        setCarregando(true);

        try {
            const resposta = await registrar({
                nome,
                email,
                senha,
                telefone: telefone || undefined,
                cpf: cpf || undefined,
                endereco: endereco || undefined,
                dataNascimento: dataNascimento || undefined,
                sexo: Number(sexo),
                foto,
            });

            setUsuarioId(resposta.id);
            setEtapa(2);
        } catch {
            setErro('Não foi possível criar o usuário. Verifique os dados e tente novamente.');
        } finally {
            setCarregando(false);
        }
    }

    async function handleSubmitEtapa2(e: React.FormEvent) {
        e.preventDefault();
        if (!usuarioId) return;

        setErro(null);
        setCarregando(true);

        try {
            switch (funcao) {
                case 'Admin':
                    await criarAdmin(usuarioId);
                    break;
                case 'Coordenador':
                    await criarCoordenador(usuarioId);
                    break;
                case 'Professor':
                    await criarProfessor(usuarioId);
                    break;
                case 'Funcionario':
                    await criarFuncionario(usuarioId);
                    break;
                case 'Aluno':
                    await criarAluno(usuarioId, matricula);
                    break;
                case 'Responsavel': {
                    const responsavel = await criarResponsavel(usuarioId);
                    if (alunoVinculadoId) {
                        await vincularAlunoResponsavel(responsavel.id, alunoVinculadoId);
                    }
                    break;
                }
            }

            setSucesso(true);
            resetFormulario();
        } catch {
            setErro('Não foi possível concluir o cadastro. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    }

    function resetFormulario() {
        setEtapa(1);
        setUsuarioId(null);
        setNome('');
        setEmail('');
        setSenha('');
        setTelefone('');
        setCpf('');
        setEndereco('');
        setDataNascimento('');
        setSexo('0');
        setFoto(null);
        setMatricula('');
        setAlunoVinculadoId('');
        setFuncao('Aluno');
    }

    const inputClasses = 'w-full h-11 border border-ink/20 rounded px-3 py-2 mb-5 focus:outline-none focus:border-gold';
    const labelClasses = 'block text-sm text-slate mb-1';

    return (
        <div className="px-12 py-10">
            <p className="text-sm text-slate">Gestão de acesso</p>

            <h1 className="font-serif text-3xl text-ink mt-1">Novo usuário</h1>

            <p className="text-sm text-slate mt-2">
                Etapa {etapa} de 2 — {etapa === 1 ? 'dados gerais' : 'função no sistema'}
            </p>

            <div className="mt-10 border-t border-ink/10 pt-8">
                {erro && (
                    <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-6">{erro}</p>
                )}
                {sucesso && (
                    <p className="text-sm text-ink bg-gold/10 border border-gold/30 rounded px-3 py-2 mb-6">
                        Usuário cadastrado com sucesso.
                    </p>
                )}

                {etapa === 1 && (
                    <form onSubmit={handleSubmitEtapa1}>
                        <div className="grid grid-cols-2 gap-x-6">
                            <div>
                                <label className={labelClasses}>Nome</label>
                                <input placeholder='Nome' value={nome} onChange={(e) => setNome(e.target.value)} required className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Email</label>
                                <input placeholder='Email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClasses} />
                            </div>

                            <div>
                                <label className={labelClasses}>Senha provisória</label>
                                <input placeholder='Senha' type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Telefone</label>
                                <input placeholder='Telefone' value={telefone} onChange={(e) => setTelefone(e.target.value)} className={inputClasses} />
                            </div>

                            <div>
                                <label className={labelClasses}>CPF</label>
                                <input placeholder='000.000.000-00' value={cpf} onChange={(e) => setCpf(e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Endereço</label>
                                <input placeholder='Endereço' value={endereco} onChange={(e) => setEndereco(e.target.value)} className={inputClasses} />
                            </div>

                            <div>
                                <label className={labelClasses}>Data de nascimento</label>
                                <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Sexo</label>
                                <select value={sexo} onChange={(e) => setSexo(e.target.value as '0' | '1')} className={inputClasses}>
                                <option value="0">Masculino</option>
                                <option value="1">Feminino</option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClasses}>Foto de perfil</label>
                                <label
                                    htmlFor="foto-input"
                                    className="flex items-center gap-3 h-11 border border-dashed border-ink/25 rounded px-3 py-2 cursor-pointer hover:border-gold transition-colors mb-5"
                                >
                                    {fotoPreview ? (
                                        <img src={fotoPreview} alt="" className="w-7 h-7 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-ink/5 flex items-center justify-center text-slate text-lg">
                                            +
                                        </div>
                                    )}
                                    <span className="text-sm text-slate truncate">
                                        {foto ? foto.name : 'Selecionar imagem'}
                                    </span>
                                </label>
                                <input
                                    id="foto-input"
                                    type="file"
                                    accept="image/*"    
                                    onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Função</label>
                                <select value={funcao} onChange={(e) => setFuncao(e.target.value as Funcao)} className={inputClasses}>
                                    {FUNCOES.map((f) => (
                                        <option key={f.value} value={f.value}>{f.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" disabled={carregando} className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50 mt-2">
                            {carregando ? 'Criando...' : 'Continuar'}
                        </button>
                    </form>
                )}

                {etapa === 2 && (
                    <form onSubmit={handleSubmitEtapa2}>
                        {funcao === 'Aluno' && (
                            <>
                                <label className={labelClasses}>Matrícula</label>
                                <input value={matricula} onChange={(e) => setMatricula(e.target.value)} required className={inputClasses} />
                            </>
                        )}

                        {funcao === 'Responsavel' && (
                            <>
                                <label className={labelClasses}>Vincular a qual aluno?</label>
                                <select value={alunoVinculadoId} onChange={(e) => setAlunoVinculadoId(e.target.value)} className={inputClasses}>
                                    <option value="">Selecione um aluno</option>

                                    {alunos.map((a) => (
                                        <option key={a.id} value={a.id}>{a.nomeUsuario} — {a.matricula}</option>
                                    ))}
                                </select>
                            </>
                        )}

                        {(funcao === 'Admin' || funcao === 'Coordenador' || funcao === 'Professor' || funcao === 'Funcionario') && (
                            <>
                                <p className="text-sm text-slate mb-6">Nenhuma informação adicional é necessária para essa função.</p>
                            </>
                        )}

                        <button type="submit" disabled={carregando} className="bg-ink text-paper rounded px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50">
                            {carregando ? 'Concluindo...' : 'Concluir cadastro'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}