# AGENTS.md — Sistema de Gestão Escolar

Guia para agentes de IA (e para quem chegar no projeto) trabalharem neste repositório.
Idioma do projeto: **português (pt-br)** — código de domínio, mensagens de UI, commits e PRs.

## Visão geral

Sistema de gestão escolar full-stack, feito do zero como projeto de **portfólio e aprendizado** por uma pessoa só (Gabriel). Monorepo:

```
sistema_escolar/
├── backend/
│   ├── SistemaEscolar.Domain/          # Entidades e enums (sem dependências)
│   ├── SistemaEscolar.Infrastructure/  # AppDbContext, Migrations (EF Core + Npgsql)
│   ├── SistemaEscolar.Api/             # Controllers, DTOs, Services, Program.cs
│   └── SistemaEscolar.slnx
└── frontend/                           # React + TypeScript + Vite + Tailwind v4
```

Dependência em uma direção só: `Api → Infrastructure → Domain`. O Domain nunca referencia EF Core nem ASP.NET.

## Stack

- **Backend:** C# / .NET 10, ASP.NET Core Web API (Controllers), EF Core, PostgreSQL (Supabase)
- **Auth:** BCrypt.Net-Next (hash) + JWT Bearer, **sem** ASP.NET Identity
- **Storage:** Supabase Storage (`supabase-csharp`)
- **Docs da API:** OpenAPI nativo + Scalar em `/scalar/v1` (não existe `/swagger`)
- **Importação:** ClosedXML (.xlsx) e CSV
- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, React Router (`react-router-dom`)

## Como rodar

Portas: API `http://localhost:5155` · Frontend `http://localhost:5173` (CORS libera só essa origem).

```powershell
# Backend (pasta backend/SistemaEscolar.Api)
dotnet run

# Frontend (pasta frontend)
npm install
npm run dev
```

### Segredos (nunca commitar)

Ficam em `dotnet user-secrets` no projeto `SistemaEscolar.Api`:

```
ConnectionStrings:DefaultConnection
Jwt:Key  (mín. 32 caracteres)
Jwt:Issuer
Jwt:Audience
Supabase:Url
Supabase:ServiceKey
```

`appsettings.json` guarda só placeholders vazios.

### Migrations — SEMPRE com caminhos absolutos

Caminhos relativos quebram o `dotnet-ef` neste projeto (`IndexOutOfRangeException`). Use:

```powershell
dotnet ef migrations add NomeDaMigration --project C:\projetos\sistema_escolar\backend\SistemaEscolar.Infrastructure --startup-project C:\projetos\sistema_escolar\backend\SistemaEscolar.Api
dotnet ef database update --project C:\projetos\sistema_escolar\backend\SistemaEscolar.Infrastructure --startup-project C:\projetos\sistema_escolar\backend\SistemaEscolar.Api
```

Rode `migrations add` **e** `database update` — o erro `PendingModelChangesWarning` costuma significar que a migration nunca foi criada. Se o build falhar, rode `dotnet build` dentro de `SistemaEscolar.Api` para ver o erro real.

- Rode o `dotnet ef` **de dentro de `backend/SistemaEscolar.Api`** (de outra pasta ele já falhou ao carregar o assembly).
- **Pare a API antes** do `migrations add`: com ela rodando, as DLLs ficam travadas (`MSB3021`/`MSB3027`). Para só checar se compila com a API no ar, use `dotnet build -o <pasta temporária>`.
- Migrations que mudam o significado de dados existentes levam o ajuste junto, com `migrationBuilder.Sql(...)` (exemplo: `CaminhoArquivoDocumento`).

## Domínio

Entidades (todas com `Guid Id`): `Usuario`, perfis em `Entities/Perfis/` (`Aluno`, `Professor`, `Coordenador`, `Admin`, `Funcionario`, `Responsavel`), `ResponsavelAluno` (N:N), `AnoLetivo`, `Turma`, `Matricula`, `Disciplina`, `ProfessorTurmaDisciplina` ("vínculo"), `Frequencia`, `Avaliacao`, `Nota`, `SituacaoDisciplina`, `ConselhoClasse`, `VotoConselho`, `Ocorrencia`, `Comunicado`, `DocumentoUsuario`.

- `Perfis/` é só para entidades que representam um **papel** de usuário (têm `UsuarioId`). Entidades de estrutura/relacionamento ficam direto em `Entities/`.
- `Usuario` guarda dados pessoais (Nome, Email, SenhaHash, Telefone, Cpf, Endereco, FotoPerfilUrl, DataNascimento, Sexo — os novos são nullable). Um usuário pode ter **vários** perfis ao mesmo tempo.
- `Aluno.Id` ≠ `Matricula.Id` ≠ `Usuario.Id`. Confundir esses ids já causou bug real — confira qual id o endpoint espera.
- Índices únicos: `Responsaveis.UsuarioId` (um perfil de Responsável por usuário) e `ResponsaveisAlunos(ResponsavelId, AlunoId)`.
- `Comunicado.AutorUsuarioId` é nullable só porque comunicados antigos foram criados sem autor.
- `DocumentoUsuario.CaminhoArquivo` guarda o **caminho no bucket**, não uma URL (o bucket é privado).

### Valores numéricos dos enums (como chegam/saem no JSON)

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

### Regras de negócio

- Notas por **bimestre** (4 por ano). Cada bimestre precisa das 3 avaliações (Comportamento, Atividade, ProvaBimestral); a média do bimestre é a média simples das notas.
- O cálculo de `SituacaoDisciplina` é **automático**, disparado dentro de `NotasController.Lancar()` (e `Importar`) quando os 4 bimestres estão completos. Média final ≥ 6 → `Aprovado`; senão → `EmRecuperacao`.
- Prova final (`POST /api/SituacoesDisciplina/{id}/prova-final`, só Admin/Coordenador, nota de 0 a 10): `(MediaFinal + NotaProvaFinal) / 2 ≥ 6` → `Aprovado`, senão `Reprovado`. Quem está em recuperação: `GET /api/SituacoesDisciplina/recuperacao`.
- Aluno com **3 ou mais** disciplinas `Reprovado` **no mesmo ano letivo** → `ConselhoClasse` é criado automaticamente (`PendenteVotacao`). **Um conselho por aluno por ano letivo**, mesmo que o anterior já tenha sido encerrado.
- Conselho: só professores votam (um voto cada, imutável); Admin/Coordenador encerram (precisa de pelo menos 1 voto). **Empate aprova o aluno.**
- Frequência é registrada em lote por turma (a "chamada").
- Comunicados (`GET /api/Comunicados/me` filtra pelo público do usuário logado):

| Papel | Vê | Pode enviar |
|---|---|---|
| Admin / Coordenador | todos | qualquer público |
| Professor | Escola toda, Professores, turmas onde dá aula | só para as suas turmas |
| Aluno | Escola toda, Alunos, a própria turma | — |
| Responsável | Escola toda, Alunos, turmas dos filhos | — |
| Funcionário | Escola toda | — |

  O autor sempre vê o que enviou.
- Documentos do usuário (atestados etc.): só Admin. Abrir = `GET /api/DocumentosUsuario/{id}/url`, que devolve uma **URL assinada válida por 5 minutos**.

## Convenções do backend

- **DTOs sempre.** Nunca devolver entidade direto (vazaria navigation properties). Padrão: `CreateXDto` (entrada) e `XResponseDto` (saída), em `Api/DTOs/`. Ações em lote têm nome próprio (`RegistrarFrequenciaDto`, `LancarNotasDto`).
- Controllers: `[ApiController]`, `[Route("api/[controller]")]`, `AppDbContext` injetado como `_context`, métodos `async` retornando `ActionResult<T>`. Projetar com `.Select(...)` para DTO.
- Validar existência de FKs no `Create` e devolver `BadRequest("... não existe.")`.
- **Autorização:** a API exige autenticação por padrão (`FallbackPolicy`). Só `Auth/login` e (opcionalmente) endpoints de docs são `[AllowAnonymous]`. **Todo `POST`/`PUT` precisa de `[Authorize(Roles = "...")]`** — "só logado" não basta (já houve aluno conseguindo criar matrícula e ocorrência). Cadastro de pessoal (Admin, Coordenador, Professor, Funcionário) e gestão de usuários → Admin; Aluno, Responsável, Matrícula e estrutura acadêmica → Admin/Coordenador; lançar nota/frequência → + Professor; ocorrência → + Professor e Funcionário; votar no conselho → Professor.
- **Identidade vem do token, nunca do corpo.** Autor de comunicado, quem registra ocorrência, professor que vota: leia de `User`, não aceite um `...UsuarioId`/`ProfessorId` no DTO (senão um usuário age em nome de outro).
- **Dados acadêmicos de um aluno** (resumo, situações, notas, frequência, ocorrências): checar com `AcessoAlunoService.PodeVerAluno(User, alunoId)` — equipe vê todos; aluno vê o próprio; responsável vê os filhos. Não duplicar essa regra nos controllers.
- **JWT multi-papel:** um claim `"papel"` por papel (`RoleClaimType = "papel"`). Para ler o id do usuário logado use `User.FindFirst(ClaimTypes.NameIdentifier)` — o ASP.NET remapeia o `sub`, então `FindFirst("sub")` retorna null.
- **Datas no PostgreSQL:** colunas `timestamp with time zone` rejeitam `DateTime.Kind == Unspecified`. Antes de salvar datas vindas de input, use `DateTime.SpecifyKind(valor, DateTimeKind.Utc)`.
- **Decimais em importação:** parse com `CultureInfo.InvariantCulture` (senão `7.5` vira `75` no locale pt-BR).
- Endpoints que misturam arquivo e campos usam `multipart/form-data` com `[FromForm]` e `[FromQuery]` explícitos.
- Upload (`SupabaseStorageService`): bucket público → `UploadArquivoAsync` (devolve URL pública, ex.: `fotos-perfil`); bucket privado → `UploadArquivoPrivadoAsync` (devolve o caminho; salve o caminho) + `CriarUrlAssinadaAsync` na hora de exibir (ex.: `documentos-usuario`).
- Listagens com dados relacionados: projetar tudo num único `.Select(...)` (subconsultas com `_context.X.Count(...)` são traduzidas para SQL) em vez de laço com uma consulta por item. Quando várias ações devolvem o mesmo DTO, extraia um `Projetar(...)` privado (ex.: `ConselhosClasseController`, `ComunicadosController`).
- Ao criar novo Controller, **reinicie a API** antes de testar (404 sem corpo costuma ser só isso).

## Convenções do frontend

Padrão por recurso: `types/` → `services/` → `hooks/` → `pages/` (+ `components/` reutilizáveis).

- `services/api.ts` centraliza `fetch` (`apiGet`, `apiPost`, `apiPut`, `apiPostForm`, `apiPutForm`) e anexa o `Bearer` token lido do `sessionStorage` (`sistema-escolar-sessao`: `{ token, nome, papeis[], papelAtivo }`). Aceita resposta sem corpo (`Ok()`/`NoContent()`). Para upload (`FormData`) **não** setar `Content-Type` manualmente.
- Erros: o `api.ts` lança `ApiError` (com `status`) cuja mensagem já é a do backend (`BadRequest("...")`) ou um texto amigável por status. No `catch`, use `mensagemDeErro(err, 'texto padrão')` — nunca concatene o objeto de erro na mensagem.
- Feedback de ação concluída: `const toast = useToast(); toast.sucesso('...')` (também `erro` e `info`). Erro de formulário/modal fica dentro dele com `<EstadoErro>`.
- Hooks de dados seguem este formato (evita setState em componente desmontado e o lint `react-hooks/set-state-in-effect`):

```ts
useEffect(() => {
  if (!id) return;
  let cancelado = false;
  (async () => {
    setCarregando(true);
    try {
      const dados = await getAlgo(id);
      if (!cancelado) setDados(dados);
    } catch (err) {
      if (!cancelado) setErro((err as Error).message);
    } finally {
      if (!cancelado) setCarregando(false);
    }
  })();
  return () => { cancelado = true; };
}, [id]);
```

- Hooks que precisam recarregar após uma ação expõem `recarregarDados()` (contador no array de dependências).
- Páginas em subpastas por papel: `pages/auth|admin|aluno|professor|coordenador|responsavel|funcionario/`. Imports de dentro de subpastas usam `../../`.
- Layout: **um só**, `components/layout/AppShell.tsx`, para todas as áreas (`<AppShell key="admin" area="admin" />` na rota). Sidebar com ícones (vira gaveta no celular), cabeçalho com o caminho ("Gestão › Turmas") e botão de tema, menu do usuário (perfil, **trocar de papel**, tema, sair). Os menus de todos os papéis ficam em `components/layout/menus.ts` — tela nova entra no menu ali. A área vem da rota, não da sessão (senão trocar Admin → Coordenador manteria o menu errado).
- Rotas: `/login`, `/selecionar-papel`, `/admin/*`, `/coordenador/*`, `/dashboard/{aluno|professor|responsavel|funcionario|sem-perfil}`. As telas de gestão compartilhadas ficam em `rotasGestao()` no `App.tsx` — tela nova de gestão entra ali e aparece para os dois papéis. O parâmetro da rota precisa casar com o `useParams` (já houve `:id` vs `turmaId` deixando a tela travada em "Carregando…").
- Login: 1 papel → vai direto ao dashboard; 2+ papéis → `/selecionar-papel`.
- Registro de usuário **não é público**: só Admin/Coordenador, em `.../usuarios/novo`, em 2 etapas (dados gerais + foto → completar a função, ex.: matrícula do Aluno). O Coordenador só vê as funções Aluno e Responsável.
- **Kit visual** em `components/ui/` — use sempre em vez de escrever classes de botão/input/tabela à mão. A galeria `/ui` (só em desenvolvimento) mostra tudo nos dois temas:
  - `Button` (variantes `primario`, `secundario`, `fantasma`, `perigo`; `icone`, `carregando`), `Input`/`Select`/`Textarea` (já com `label`, `dica`, `erro`), `CampoBusca`, `CampoSelecaoBusca` (escolher aluno etc. digitando — use no lugar de `<select>` com listas longas);
  - `Pagina` + `PageHeader` (estrutura de toda tela), `BarraFerramentas`, `Card`, `StatCard`, `Badge` (status), `Avatar`, `Tabela`/`Th`/`Tr`/`Td`/`CelulaDupla`;
  - `Carregando`, `EstadoVazio` (sempre com orientação do próximo passo), `EstadoErro`, `Aviso`; `Icone` (nomes tipados); `SeletorTema`.
- Componentes de domínio já existentes — reaproveite antes de criar: `Modal`, `ResumoAlunoPainel`, `TabelaConselhos`, `ListaComunicados`, `NovoComunicadoModal`, `PaginaComunicados`, `ComunicadosRecentes`, `NovaOcorrenciaModal`, `TabelaOcorrencias`, `DocumentosUsuarioModal`, `EditarUsuarioModal`, `PerfilModal`, `TabsTurma`.
- Utilitários: `utils/datas.ts` (`saudacao`, `hojePorExtenso`, `dataCurta`, `tempoRelativo`) e `utils/notas.ts` (`lerNota` aceita "7,5" e "7.5" e valida 0–10; nunca use `type="number"`/`Number()` direto em nota).
- Ação irreversível (voto, prova final, encerrar conselho): o modal mostra o resultado **antes** de confirmar, usando a mesma regra do backend (ex.: `mediaComProvaFinal` em `types/recuperacao.ts`).
- Constantes exportadas (rótulos de enum etc.) ficam em `types/`, não em arquivos de componente — senão o lint `react-refresh/only-export-components` reclama.
- Padrão de tela de gestão: `Pagina` → `PageHeader` (ação principal no canto) → `Card semPadding` com `BarraFerramentas` (busca/filtros) e `Tabela` → `Modal` com o formulário; após salvar, `toast.sucesso(...)` e `recarregarDados()`. Exemplos: `pages/admin/Recuperacao.tsx`, `pages/professor/Aba*.tsx`.
- Cuidado ao navegar entre abas: o query param `?vinculo=<id>` precisa ser preservado.

### Identidade visual (não usar o azul/cinza padrão do Tailwind)

Azul-marinho + dourado, com **tema claro e escuro**. As cores são variáveis CSS em `index.css` (valor em `:root` e em `.dark`), expostas ao Tailwind via `@theme inline` — então **use os tokens, nunca cores fixas** (`bg-white`, `text-gray-*`, `blue-*`, `red-50`...), senão a tela quebra no escuro.

| Token | Uso |
|---|---|
| `paper` | fundo da aplicação |
| `surface` / `surface-muted` | cards, modais, tabelas / hover, áreas recuadas |
| `ink` / `slate` | texto forte / texto secundário |
| `line` / `line-strong` | bordas e divisores |
| `gold` / `gold-soft` | destaque, item ativo, foco / fundo de destaque |
| `primary` / `on-primary` | botão primário (marinho no claro, dourado no escuro) |
| `sidebar`, `sidebar-fg`, `sidebar-muted` | barra lateral (marinho nos dois temas) |
| `success`, `warning`, `danger`, `info` (+ `-soft`) | status: aprovado, recuperação, reprovado/falta, informação |

- Tema: `useTema()` / `definirTema('claro' | 'escuro' | 'sistema')`; o `index.html` aplica antes da primeira pintura (chave `sistema-escolar-tema` no `localStorage`).
- Fontes: **IBM Plex Sans** para tudo (títulos em `font-semibold`); **Source Serif 4** só na marca e em números grandes (`StatCard`, placares).
- Estilo: cards `rounded-xl` com borda fina e sombra leve (`shadow-card`), inputs `h-10 rounded-lg` com foco dourado, status sempre em `Badge`, ícones de contorno. Telas pensadas também para celular (tabelas rolam na horizontal, modal vira folha que sobe).

## Fluxo de Git

O Gabriel **executa os comandos de Git ele mesmo**. Agentes não devem commitar, dar push ou mergear sem pedido explícito — ao fim de cada feature, entregue:

1. uma **mensagem de commit curta** (conventional commits em pt-br: `feat:`, `fix:`, `style:`, `docs:`…);
2. uma **descrição detalhada para o PR** (o que foi feito + como testar).

Branches:

- Feature simples: `feature/<nome>` a partir da `main` atualizada → PR para `main`.
- Feature grande (épico): **branch guarda-chuva** `feature/<epico>` criada a partir da `main`, com **sub-branches** `feature/<epico>-<parte>` criadas a partir dela. PRs das sub-branches têm como *base* o guarda-chuva; só no fim abre-se um PR do guarda-chuva para a `main`.
- **Dê `git push -u origin <branch>` no guarda-chuva logo ao criá-lo** — senão o GitHub não o oferece como base de PR.
- Antes de criar branch nova, confirme que o PR anterior foi **mergeado de verdade** (não só aberto), principalmente após dias de pausa — PR aberto faz arquivos parecerem "sumidos".
- Cuidado com o botão **Revert** do GitHub em PRs já mergeados (um clique acidental já desfez uma feature; a correção é dar *Revert* no PR de revert).

## Armadilhas conhecidas

- **Scalar** corrompe o header `Authorization` e perde query params em requests multipart. Para testar endpoints protegidos, use o PowerShell (abaixo) ou `curl.exe -i`.
- **PowerShell 5.1:** `curl` é apelido de `Invoke-WebRequest` (não aceita `-H`/`-d`). Use `Invoke-RestMethod`:
  - login: `$h = @{ Authorization = "Bearer $((Invoke-RestMethod -Method Post -Uri http://localhost:5155/api/Auth/login -ContentType 'application/json' -Body '{"email":"...","senha":"..."}').token)" }`
  - lista + `Select-Object` mostra linha em branco: envolva em parênteses, `(Invoke-RestMethod ...) | Select-Object ...`;
  - para ver status **e** mensagem de erro, leia o corpo de `$_.Exception.Response.GetResponseStream()` no `catch` (`$_.ErrorDetails.Message` costuma vir vazio).
- **Supabase pausa o projeto** após ~7 dias sem uso (plano gratuito). Sintoma: `XX000: (ENOTFOUND) tenant/user postgres.<id> not found` e botão "Connect" desabilitado no painel. Solução: **Restore project** no painel (os dados são mantidos).
- **Smart App Control** do Windows 11 bloqueava as DLLs do build (`Uma política de Controle de Aplicativo bloqueou este arquivo`, `0x800711C7`). Foi desligado na máquina do Gabriel; se o erro voltar, a causa é essa. Depois de desligar, apague `bin/` e `obj/` (o veredito fica gravado no arquivo).
- Comandos colados em várias linhas no PowerShell/cmd costumam virar uma linha só e quebrar. Rode **um comando por vez**.
- Usuários criados via SQL com `SenhaHash` fake (`'hash-temporario'`) **não conseguem logar**. Para um login de teste, registre via API ou gere hash BCrypt real (`crypt(senha, gen_salt('bf', 11))` com `pgcrypto`).
- Existem várias turmas "9º A" nos dados de teste; matrícula e vínculo de professor podem apontar para turmas diferentes e a lista de alunos vir vazia — confira os `TurmaId`.
- Mudou `Program.cs`, Controller ou DTO? Reinicie a API. Arquivo novo no Vite não apareceu? Reinicie o `npm run dev` e dê hard refresh.
- Tela em branco + `No routes matched location` no console = rota faltando no `App.tsx`; tela em branco com `500` no `App.tsx` = import de arquivo que não existe.

## Como o Gabriel gosta de trabalhar

- Explique o *porquê* de cada passo, sem despejar mudanças sem contexto.
- Explicações **curtas e diretas**, ancoradas no contexto do projeto. Respostas dele costumam ser confirmações curtas ("pronto", "funcionou").
- Avançar **uma peça por vez**, validando cada uma (migration → endpoint → teste via curl → tela → teste no navegador) antes da próxima. Sem planos de fases rígidos; o escopo evolui conforme as ideias surgem.
- Quando houver mais de uma opção razoável, recomende uma e explique brevemente por quê.
- Entregar arquivos **completos** quando a mudança é grande ou o arquivo já divergiu do esperado (evita erros de colagem); trechos pontuais só quando a alteração é realmente pequena e o local é inequívoco.
- gosto de commitar eu mesmo, mas gosto de reeceber as descrições ds commits 

## Estado atual e próximos passos

**Núcleo completo e redesenhado** (backend + telas, tema claro/escuro, layout único responsivo): autenticação multi-papel; cadastro de usuário em 2 etapas com foto; gestão de usuários pelo Admin (editar, redefinir senha, documentos com URL assinada); perfil próprio; importação de notas/frequência por planilha; ciclo acadêmico inteiro (notas → recuperação/prova final → conselho de classe com votação); comunicados com público-alvo; ocorrências; áreas e dashboards de **todos os papéis**: Admin, Coordenador (`/coordenador`), Professor (hub com 4 abas + conselho + comunicados), Aluno, Responsável (vários filhos) e Funcionário (alunos + ocorrências).

Próximos passos:

- **Módulo Financeiro** — deliberadamente deixado para o fim; é o próximo grande bloco.
- **Publicar o projeto** (portfólio): API e frontend online, URL da API em variável de ambiente (hoje `localhost:5155` está fixo em `services/api.ts`), dados e logins de demonstração, README com capturas de tela, contornar a pausa do Supabase.
- Testes automatizados (começar pelas regras de negócio: média, recuperação, conselho/empate).
- Decisões em aberto: dar ao Funcionário acesso aos documentos (secretaria lidando com atestados) — hoje só o Admin.