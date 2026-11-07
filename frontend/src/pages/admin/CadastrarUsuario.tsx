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
import { mensagemDeErro } from '../../services/api';
import { useAlunos } from '../../hooks/useAlunos';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Pagina, PageHeader, EstadoErro, Aviso } from '../../components/ui/Estrutura';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Campo';
import { Icone } from '../../components/ui/Icone';
import { CampoSelecaoBusca } from '../../components/ui/CampoSelecaoBusca';

type Funcao = 'Admin' | 'Coordenador' | 'Professor' | 'Responsavel' | 'Aluno' | 'Funcionario';

const FUNCOES: { value: Funcao; label: string }[] = [
    { value: 'Aluno', label: 'Aluno' },
    { value: 'Responsavel', label: 'Responsável' },
    { value: 'Professor', label: 'Professor' },
    { value: 'Funcionario', label: 'Funcionário' },
    { value: 'Coordenador', label: 'Coordenador' },
    { value: 'Admin', label: 'Administrador' },
];

// O backend só deixa o Coordenador criar perfis de Aluno e Responsável; o resto é exclusivo do Admin.
const FUNCOES_COORDENADOR: Funcao[] = ['Aluno', 'Responsavel'];

const ETAPAS = ['Dados gerais', 'Função no sistema'];

export function CadastrarUsuario() {
    const { sessao } = useAuth();
    const toast = useToast();
    const funcoesPermitidas = sessao?.papelAtivo === 'Coordenador'
        ? FUNCOES.filter((f) => FUNCOES_COORDENADOR.includes(f.value))
        : FUNCOES;

    const [etapa, setEtapa] = useState<1 | 2>(1);
    const [usuarioId, setUsuarioId] = useState<string | null>(null);
    const [funcao, setFuncao] = useState<Funcao>('Aluno');
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);

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
        } catch (err) {
            setErro(mensagemDeErro(err, 'Não foi possível criar o usuário. Verifique os dados.'));
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

            toast.sucesso(`${nome} foi cadastrado(a) como ${FUNCOES.find((f) => f.value === funcao)?.label}.`);
            resetFormulario();
        } catch (err) {
            setErro(mensagemDeErro(err, 'Não foi possível concluir o cadastro.'));
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

    return (
        <Pagina estreita>
            <PageHeader
                eyebrow="Pessoas"
                titulo="Novo usuário"
                descricao="O cadastro tem duas etapas: os dados da pessoa e, depois, a função dela na escola."
            />

            {/* Indicador de etapas */}
            <ol className="flex items-center gap-3 mb-6">
                {ETAPAS.map((rotulo, i) => {
                    const numero = i + 1;
                    const concluida = etapa > numero;
                    const atual = etapa === numero;

                    return (
                        <li key={rotulo} className="flex items-center gap-3 flex-1">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                                concluida ? 'bg-success text-white' : atual ? 'bg-primary text-on-primary' : 'bg-surface-muted text-slate'
                            }`}>
                                {concluida ? <Icone nome="check" tamanho={14} /> : numero}
                            </span>
                            <span className={`text-sm ${atual ? 'font-medium text-ink' : 'text-slate'}`}>{rotulo}</span>
                            {numero < ETAPAS.length && <span className="flex-1 h-px bg-line" aria-hidden="true" />}
                        </li>
                    );
                })}
            </ol>

            {erro && <div className="mb-4"><EstadoErro mensagem={erro} /></div>}

            {etapa === 1 && (
                <Card>
                    <form onSubmit={handleSubmitEtapa1}>
                        <div className="flex items-center gap-4 mb-6">
                            <label htmlFor="foto-input" className="relative cursor-pointer group">
                                <span className="w-16 h-16 rounded-full bg-surface-muted border border-dashed border-line-strong flex items-center justify-center overflow-hidden group-hover:border-gold transition-colors">
                                    {fotoPreview
                                        ? <img src={fotoPreview} alt="" className="w-full h-full object-cover" />
                                        : <Icone nome="upload" className="text-slate" />}
                                </span>
                            </label>
                            <div>
                                <label htmlFor="foto-input" className="text-sm font-medium text-gold cursor-pointer hover:underline">
                                    {foto ? 'Trocar foto' : 'Adicionar foto'}
                                </label>
                                <p className="text-xs text-slate">Opcional. JPG ou PNG.</p>
                            </div>
                            <input
                                id="foto-input"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                                className="hidden"
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-x-4">
                            <Input label="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
                            <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <Input
                                label="Senha provisória"
                                type="password"
                                autoComplete="new-password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                minLength={6}
                                dica="Mínimo 6 caracteres. Informe à pessoa no primeiro acesso."
                            />
                            <Input label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" />
                            <Input label="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" />
                            <Input label="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                            <Input label="Data de nascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
                            <Select label="Sexo" value={sexo} onChange={(e) => setSexo(e.target.value as '0' | '1')}>
                                <option value="0">Masculino</option>
                                <option value="1">Feminino</option>
                            </Select>
                            <Select
                                label="Função"
                                value={funcao}
                                onChange={(e) => setFuncao(e.target.value as Funcao)}
                                dica={funcoesPermitidas.length < FUNCOES.length ? 'A coordenação cadastra alunos e responsáveis.' : undefined}
                            >
                                {funcoesPermitidas.map((f) => (
                                    <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                            </Select>
                        </div>

                        <div className="flex justify-end mt-2">
                            <Button type="submit" carregando={carregando} icone="setaDireita">
                                {carregando ? 'Criando...' : 'Continuar'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {etapa === 2 && (
                <Card titulo={`Função: ${FUNCOES.find((f) => f.value === funcao)?.label}`} descricao={`Usuário ${nome} criado. Falta só definir a função.`}>
                    <form onSubmit={handleSubmitEtapa2}>
                        {funcao === 'Aluno' && (
                            <Input label="Matrícula" value={matricula} onChange={(e) => setMatricula(e.target.value)} required autoFocus />
                        )}

                        {funcao === 'Responsavel' && (
                            <CampoSelecaoBusca
                                label="Vincular a qual aluno?"
                                opcoes={alunos.map((a) => ({ id: a.id, titulo: a.nomeUsuario, subtitulo: `Matrícula ${a.matricula}` }))}
                                valor={alunoVinculadoId}
                                onChange={setAlunoVinculadoId}
                                placeholder="Digite o nome ou a matrícula do aluno..."
                                dica="Dá para vincular outros filhos depois."
                            />
                        )}

                        {(funcao === 'Admin' || funcao === 'Coordenador' || funcao === 'Professor' || funcao === 'Funcionario') && (
                            <div className="mb-4">
                                <Aviso>Nenhuma informação adicional é necessária para essa função.</Aviso>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" carregando={carregando} icone="check">
                                {carregando ? 'Concluindo...' : 'Concluir cadastro'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </Pagina>
    );
}
