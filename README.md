# Sistema de Gestão Escolar

Sistema de gestão escolar (backend em ASP.NET Core + frontend em React/TypeScript), com controle de notas, frequência, ocorrências disciplinares e permissões por perfil de usuário.

## Stack

**Backend**
- C# / .NET 10
- ASP.NET Core Web API
- Entity Framework Core + Npgsql
- PostgreSQL (via Supabase)
- Scalar (documentação interativa da API)

**Frontend**
- React
- TypeScript
- Vite

## Estrutura do projeto

```
sistema-escolar/
├── backend/
│   ├── SistemaEscolar.Domain/         # Entidades e regras de negócio
│   ├── SistemaEscolar.Infrastructure/ # DbContext, Migrations
│   └── SistemaEscolar.Api/            # Controllers, DTOs, Program.cs
└── frontend/                          # Aplicação React
```

## Como rodar localmente

### Pré-requisitos
- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- Uma conta no [Supabase](https://supabase.com) (ou outro PostgreSQL)

### Backend

1. Clone o repositório e entre na pasta da Api:
```
   cd backend/SistemaEscolar.Api
```

2. Configure a connection string usando user-secrets (nunca commitar credenciais no `appsettings.json`):
```
   dotnet user-secrets init
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=SEU_HOST;Database=postgres;Username=SEU_USER;Password=SUA_SENHA;Port=5432"
```

3. Instale a ferramenta do EF Core, se ainda não tiver:
```
   dotnet tool install --global dotnet-ef
```

4. Aplique as migrations no banco:
```
   dotnet ef database update --project ..\SistemaEscolar.Infrastructure --startup-project .
```

5. Suba a API:
```
   dotnet run
```

6. Acesse a documentação interativa em `http://localhost:5155/scalar/v1`

### Frontend

1. Entre na pasta do frontend:
```
   cd frontend
```

2. Instale as dependências:
```
   npm install
```

3. Suba o servidor de desenvolvimento:
```
   npm run dev
```

## Funcionalidades implementadas até agora

- [x] Cadastro de Usuários, Alunos e Professores
- [x] Estrutura acadêmica: Ano Letivo, Turma, Matrícula
- [x] Disciplinas e vínculo Professor + Turma + Disciplina
- [x] Registro de frequência (chamada em lote por turma)
- [x] Lançamento de notas por avaliação/bimestre
- [ ] Cálculo automático de situação por disciplina (aprovado/recuperação/reprovado)
- [ ] Conselho de classe (votação de professores)
- [ ] Área do responsável
- [ ] Comunicados
- [ ] Interface (frontend)