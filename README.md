# Sistema de Gestão Escolar

Sistema de gestão escolar full-stack para centralizar informações acadêmicas, administrativas e disciplinares. É composto por uma API em **ASP.NET Core** e uma interface web em **React + TypeScript**. Tem autenticação com múltiplos perfis por usuário, controle de acesso por papel, notas por bimestre com cálculo automático de situação, frequência, ocorrências, conselho de classe, comunicados e documentos.

> Projeto de portfólio em desenvolvimento ativo. Novas funcionalidades entram aos poucos.

## Sumário

- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Regras acadêmicas](#regras-acadêmicas)
- [Como executar localmente](#como-executar-localmente)
- [API](#api)
- [Segurança](#segurança)
- [Problemas comuns](#problemas-comuns)
- [Status e próximos passos](#status-e-próximos-passos)

## Tecnologias

### Backend

- C# / .NET 10, ASP.NET Core Web API (Controllers)
- Entity Framework Core 10 + Npgsql (PostgreSQL hospedado no Supabase)
- JWT Bearer + BCrypt.Net-Next, **sem** ASP.NET Identity
- Supabase Storage (`supabase-csharp`) para fotos de perfil e documentos
- OpenAPI nativo + [Scalar](https://scalar.com/) para documentação interativa
- ClosedXML (.xlsx) e CSV para importação de planilhas

### Frontend

- React 19 + TypeScript
- Vite
- React Router DOM
- Tailwind CSS 4
- ESLint

## Arquitetura

Monorepo com o backend dividido em camadas. As dependências seguem uma única direção, **Api → Infrastructure → Domain**. O Domain não conhece EF Core nem ASP.NET.

```text
sistema_escolar/
├── backend/
│   ├── SistemaEscolar.Domain/          # Entidades e enums (sem dependências)
│   │   └── Entities/Perfis/            # Papéis de usuário: Aluno, Professor, Coordenador...
│   ├── SistemaEscolar.Infrastructure/  # AppDbContext e Migrations
│   ├── SistemaEscolar.Api/             # Controllers, DTOs, Services, Program.cs
│   └── SistemaEscolar.slnx
│
└── frontend/
    └── src/
        ├── types/        # Tipos TypeScript espelhando os DTOs da API
        ├── services/     # Chamadas HTTP (api.ts centraliza fetch + token)
        ├── hooks/        # Hooks de dados (carregamento, erro, recarregar)
        ├── components/   # Layouts por área, Modal, abas etc.
        └── pages/        # Uma subpasta por papel
            ├── auth/  admin/  aluno/  professor/
            └── coordenador/  responsavel/  funcionario/
```

### Modelo de usuários

Um `Usuario` guarda os dados pessoais (nome, e-mail, senha, CPF, foto…) e pode ter **vários perfis ao mesmo tempo**: Admin, Coordenador, Professor, Funcionário, Aluno e Responsável. Quem tem mais de um perfil escolhe no login com qual quer entrar.

## Funcionalidades

### Autenticação e permissões

- [x] Login com JWT, com um claim por papel do usuário
- [x] Seleção de papel após o login para usuários com múltiplos perfis
- [x] Toda a API exige autenticação por padrão (política de fallback)
- [x] Permissões por papel em cada ação sensível
- [x] Cadastro de usuários restrito a Admin/Coordenador. Não há registro público.

### Usuários e perfis

- [x] Cadastro em 2 etapas: dados gerais + foto, depois os dados do perfil (ex.: matrícula do aluno)
- [x] Upload de foto de perfil (Supabase Storage, bucket público)
- [x] Gestão de usuários pelo Admin (listar, editar)
- [x] Edição do próprio perfil (modal)
- [x] Histórico de documentos do usuário (atestados, comprovantes…) em bucket privado
- [x] Vínculo entre responsáveis e alunos

### Estrutura acadêmica

- [x] Anos letivos, turmas (com turno), disciplinas e matrículas
- [x] Vínculo professor × turma × disciplina

### Notas e avaliações

- [x] Avaliações por bimestre: Comportamento, Atividade e Prova Bimestral
- [x] Lançamento de notas em lote
- [x] Importação de notas por planilha (.xlsx/.csv), com relatório de erros por linha
- [x] Cálculo automático da situação da disciplina
- [x] Prova final para alunos em recuperação

### Frequência

- [x] Chamada em lote por turma
- [x] Importação de frequência por planilha
- [x] Consulta de frequência
- [ ] Integração com a plataforma governamental de frequência oficial

### Ocorrências, conselho de classe e comunicados

- [x] Ocorrências (disciplinar, saúde, atraso, elogio, outro), com registro de quem lançou
- [x] Conselho de classe criado automaticamente, com votação dos professores e bloqueio de voto duplicado
- [x] Encerramento do conselho por Admin/Coordenador
- [x] Comunicados com público-alvo (escola toda, turma, professores, alunos)

### Telas (frontend)

- [x] Login e seleção de papel
- [x] **Admin**: dashboard, usuários, alunos, professores, turmas, consulta de notas e frequência
- [x] **Aluno**: dashboard com resumo de notas, frequência e situação
- [x] **Professor**: minhas turmas + hub da turma com abas **Alunos**, **Frequência**, **Notas** e **Observações**
- [ ] Dashboards de **Coordenador**, **Responsável** e **Funcionário** (hoje são placeholders)
- [ ] Telas de Conselho de Classe e Comunicados

## Regras acadêmicas

1. **Notas por bimestre.** O ano tem 4 bimestres. Cada um precisa das 3 avaliações (Comportamento, Atividade e Prova Bimestral), e a média do bimestre é a média simples delas.
2. **Situação automática.** Quando os 4 bimestres estão completos, ao lançar ou importar notas o sistema calcula a média final:
   - média final **≥ 6** → **Aprovado**
   - média final **< 6** → **Em recuperação**
3. **Prova final** (registrada por Admin/Coordenador): `(média final + prova final) / 2 ≥ 6` → **Aprovado**. Abaixo disso → **Reprovado**.
4. **Conselho de classe.** O aluno com **3 ou mais** disciplinas reprovadas tem um conselho aberto automaticamente (*Pendente de votação*). Os professores votam (aprovar/reprovar) e Admin/Coordenador encerram o conselho. Vence a maioria.

## Como executar localmente

### Pré-requisitos

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (LTS)
- Um banco PostgreSQL. O projeto usa o [Supabase](https://supabase.com/), que também fornece o Storage.
- Ferramenta do EF Core: `dotnet tool install --global dotnet-ef`

### 1. Clonar

```bash
git clone https://github.com/GabrielS0306/sistema_escolar.git
cd sistema_escolar
```

### 2. Configurar os segredos do backend

Os segredos ficam em **User Secrets**, nunca no repositório. O `appsettings.json` guarda só placeholders vazios. Dentro de `backend/SistemaEscolar.Api`, rode **um comando por vez**:

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=SEU_HOST;Database=postgres;Username=SEU_USUARIO;Password=SUA_SENHA;Port=5432"
dotnet user-secrets set "Jwt:Key" "uma-chave-secreta-com-pelo-menos-32-caracteres"
dotnet user-secrets set "Jwt:Issuer" "SistemaEscolar"
dotnet user-secrets set "Jwt:Audience" "SistemaEscolarFrontend"
dotnet user-secrets set "Supabase:Url" "https://SEU_PROJETO.supabase.co"
dotnet user-secrets set "Supabase:ServiceKey" "SUA_SERVICE_ROLE_KEY"
```

No Supabase Storage, crie dois buckets:

| Bucket | Visibilidade | Uso |
|---|---|---|
| `fotos-perfil` | público | fotos de perfil |
| `documentos-usuario` | privado | documentos dos usuários |

### 3. Aplicar as migrations

> Use **caminhos absolutos**. Com caminhos relativos, o `dotnet-ef` falha neste projeto com `IndexOutOfRangeException`.

```powershell
dotnet ef database update --project C:\caminho\para\sistema_escolar\backend\SistemaEscolar.Infrastructure --startup-project C:\caminho\para\sistema_escolar\backend\SistemaEscolar.Api
```

Para criar uma migration nova, use `migrations add NomeDaMigration` com os mesmos parâmetros e depois rode o `database update`.

### 4. Rodar a API

```bash
cd backend/SistemaEscolar.Api
dotnet run
```

A API sobe em `http://localhost:5155`. Em desenvolvimento, a documentação interativa fica em **`http://localhost:5155/scalar/v1`** (não existe `/swagger`).

### 5. Rodar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. O CORS da API libera apenas essa origem.

### 6. Primeiro acesso

Não há registro público, então o primeiro usuário Admin precisa ser criado direto no banco. A senha precisa de um **hash BCrypt real**. Com a extensão `pgcrypto`, dá para gerar o hash com `crypt('sua-senha', gen_salt('bf', 11))`. Depois do login como Admin, os demais usuários são cadastrados pela tela `/admin/usuarios/novo`.

### Scripts do frontend

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | checagem de tipos + build de produção |
| `npm run lint` | ESLint |
| `npm run preview` | serve o build localmente |

## API

As rotas seguem o padrão `/api/[controller]` e sempre trafegam **DTOs**, nunca entidades. Recursos disponíveis:

`Auth`, `Usuarios`, `Admins`, `Coordenadores`, `Professores`, `Funcionarios`, `Alunos`, `Responsaveis`, `AnoLetivos`, `Turmas`, `Matriculas`, `Disciplinas`, `ProfessorTurmaDisciplinas`, `Avaliacoes`, `Notas`, `Frequencias`, `SituacoesDisciplina`, `ConselhosClasse`, `Ocorrencias`, `Comunicados`, `DocumentosUsuario`.

Alguns endpoints de destaque:

| Endpoint | Descrição |
|---|---|
| `POST /api/Auth/login` | login (único endpoint anônimo) |
| `GET /api/Alunos/me/resumo` | resumo do aluno logado |
| `GET /api/Alunos/{id}/resumo` | resumo de um aluno |
| `GET /api/ProfessorTurmaDisciplinas/minhas` | turmas/disciplinas do professor logado |
| `POST /api/Notas/importar` | importação de notas por planilha |
| `POST /api/Frequencias/importar` | importação de frequência por planilha |
| `POST /api/SituacoesDisciplina/{id}/prova-final` | registra prova final |
| `POST /api/ConselhosClasse/{id}/votar` | voto do professor |
| `POST /api/ConselhosClasse/{id}/encerrar` | encerra o conselho |

### Enums no JSON

Enums trafegam como números:

| Enum | Valores |
|---|---|
| `Sexo` | 0 Masculino, 1 Feminino |
| `TurnoEscolar` | 0 Manhã, 1 Tarde, 2 Noite |
| `TipoAvaliacao` | 0 Comportamento, 1 Atividade, 2 ProvaBimestral |
| `StatusDisciplina` | 0 EmAndamento, 1 Aprovado, 2 EmRecuperacao, 3 Reprovado |
| `TipoOcorrencia` | 0 Disciplinar, 1 Saúde, 2 Atraso, 3 Elogio, 4 Outro |
| `TipoDocumento` | 0 AtestadoMedico, 1 Comprovante, 2 Disciplinar, 3 Outro |
| `ResultadoConselho` | 0 PendenteVotacao, 1 Aprovado, 2 Reprovado |
| `TipoVoto` | 0 Aprovar, 1 Reprovar |
| `PublicoAlvoComunicado` | 0 TodaEscola, 1 Turma, 2 Professores, 3 Alunos |

> **Atenção aos ids:** `Usuario.Id`, `Aluno.Id` e `Matricula.Id` são diferentes. Confira qual deles cada endpoint espera.

## Segurança

- JWT Bearer com validação de emissor, audiência, expiração e chave de assinatura
- Política de fallback: toda rota exige autenticação, salvo as marcadas como anônimas
- Autorização por papel (`[Authorize(Roles = ...)]`), com JWT multi-papel
- Senhas com hash BCrypt
- Segredos em User Secrets, fora do controle de versão
- Documentos em bucket privado do Supabase

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| `IndexOutOfRangeException` no `dotnet ef` | caminhos relativos; use caminhos absolutos |
| `PendingModelChangesWarning` | a migration não foi criada; rode `migrations add` antes do `database update` |
| 404 sem corpo num controller novo | a API não foi reiniciada |
| Erro ao salvar datas no PostgreSQL | `DateTime.Kind` *Unspecified*; use `DateTime.SpecifyKind(..., DateTimeKind.Utc)` |
| Header `Authorization` corrompido ou upload falhando no Scalar | limitação do Scalar; teste com `curl -i` |
| Usuário criado via SQL não consegue logar | `SenhaHash` não é um hash BCrypt válido |
| Tela em branco + `No routes matched location` | rota faltando no `App.tsx` |
| Arquivo novo não aparece no Vite | reinicie o `npm run dev` e dê hard refresh |

## Status e próximos passos

**Pronto:** núcleo acadêmico completo no backend, autenticação multi-papel, cadastro em 2 etapas com foto, documentos, gestão de usuários, importação de notas/frequência e dashboards de Admin, Aluno e Professor.

**Próximos passos:**

- [ ] Dashboards de Coordenador, Responsável e Funcionário
- [ ] Telas de Conselho de Classe e Comunicados
- [ ] URL assinada para visualizar documentos do bucket privado
- [ ] Notificações para responsáveis
- [ ] Responsividade e refinamentos de UX
- [ ] Testes automatizados
- [ ] Configuração para produção
- [ ] Módulo Financeiro (deixado para o fim do projeto)

## Autor

Desenvolvido por **Gabriel S.** · GitHub: [GabrielS0306](https://github.com/GabrielS0306)
