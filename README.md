# Sistema de Gestão Escolar

Sistema de gestão escolar desenvolvido para centralizar e organizar informações acadêmicas, administrativas e disciplinares. A aplicação possui uma API em ASP.NET Core e uma interface web em React/TypeScript, com autenticação, controle de acesso por perfil, gerenciamento de alunos e professores, notas, frequência, ocorrências, comunicados e conselho de classe.

> Projeto em desenvolvimento, com novas funcionalidades sendo adicionadas gradualmente.

## Tecnologias

### Backend

* C# / .NET 10
* ASP.NET Core Web API
* Entity Framework Core 10
* Npgsql / PostgreSQL
* Supabase
* JWT Bearer Authentication
* BCrypt.Net para hash de senhas
* Scalar para documentação e testes da API
* ClosedXML para leitura de planilhas

### Frontend

* React 19
* TypeScript
* Vite
* React Router DOM
* Tailwind CSS 4
* ESLint

## Arquitetura

O backend está organizado em uma estrutura separada por responsabilidades:

```text
sistema_escolar/
├── backend/
│   ├── SistemaEscolar.Domain/
│   │   └── Entidades e regras de domínio
│   │
│   ├── SistemaEscolar.Infrastructure/
│   │   ├── AppDbContext
│   │   └── Migrations
│   │
│   └── SistemaEscolar.Api/
│       ├── Controllers
│       ├── DTOs
│       ├── Services
│       └── Program.cs
│
└── frontend/
    └── src/
        ├── components/
        ├── hooks/
        ├── pages/
        │   ├── admin/
        │   ├── aluno/
        │   ├── auth/
        │   ├── coordenador/
        │   ├── funcionario/
        │   ├── professor/
        │   └── responsavel/
        ├── services/
        ├── types/
        ├── App.tsx
        └── main.tsx
```

## Principais funcionalidades

### Autenticação e permissões

* [x] Autenticação utilizando JWT
* [x] Proteção das rotas da API
* [x] Controle de acesso por perfil
* [x] Perfis de administrador, coordenador, professor, funcionário, aluno e responsável
* [x] Redirecionamento para áreas específicas de acordo com o perfil

### Gestão acadêmica

* [x] Cadastro de usuários
* [x] Cadastro de alunos
* [x] Cadastro de professores
* [x] Cadastro de funcionários
* [x] Cadastro de coordenadores
* [x] Cadastro de responsáveis
* [x] Cadastro de anos letivos
* [x] Cadastro e gerenciamento de turmas
* [x] Matrículas
* [x] Cadastro de disciplinas
* [x] Vínculo entre professor, turma e disciplina

### Notas e avaliações

* [x] Cadastro de avaliações
* [x] Lançamento de notas
* [x] Lançamento de notas para múltiplos alunos
* [x] Consulta de notas por aluno
* [x] Organização das avaliações por bimestre
* [x] Importação de notas através de planilha
* [x] Validação de matrícula e valores durante a importação
* [x] Registro dos erros encontrados durante a importação
* [x] Cálculo automático da média final quando os quatro bimestres possuem os tipos de avaliação obrigatórios
* [x] Identificação automática de aprovado ou recuperação
* [x] Registro de prova final para alunos em recuperação
* [x] Atualização da situação para aprovado ou reprovado após a prova final

### Frequência

* [x] Registro de frequência
* [x] Chamada em lote por turma
* [x] Consulta de frequência
* [ ] Integração com a plataforma governamental de registro oficial de frequência

### Área disciplinar

* [x] Registro de ocorrências disciplinares
* [x] Consulta do histórico de ocorrências por aluno
* [x] Registro do usuário responsável pela ocorrência
* [x] Controle de situação disciplinar do aluno

### Conselho de classe

* [x] Criação automática de conselho de classe quando atingido o critério definido no sistema
* [x] Registro de votos dos professores
* [x] Impedimento de voto duplicado para o mesmo professor
* [x] Encerramento do conselho por administrador ou coordenador
* [x] Registro do resultado do conselho

### Responsáveis

* [x] Cadastro de responsáveis
* [x] Vinculação de responsáveis aos alunos
* [x] Consulta dos alunos vinculados ao responsável
* [ ] Dashboard completo do responsável
* [ ] Notificações para responsáveis

### Comunicados

* [x] Criação de comunicados
* [x] Definição de público-alvo
* [x] Comunicados direcionados para turmas
* [x] Listagem dos comunicados por data de envio

### Frontend

* [x] Interface React/TypeScript
* [x] Roteamento com React Router
* [x] Áreas separadas por perfil de usuário
* [x] Páginas de autenticação
* [x] Dashboard
* [x] Componentização da interface
* [x] Serviços para comunicação com a API
* [x] Tipagem com TypeScript
* [x] Estilização com Tailwind CSS
* [ ] Responsividade completa de todas as telas
* [ ] Refinamentos visuais e UX

## Banco de dados

O sistema utiliza PostgreSQL como banco de dados, acessado através do Entity Framework Core e do provedor Npgsql.

A estrutura de domínio contempla entidades como:

* Usuário
* Aluno
* Professor
* Funcionário
* Coordenador
* Responsável
* Ano Letivo
* Turma
* Matrícula
* Disciplina
* Professor/Turma/Disciplina
* Frequência
* Avaliação
* Nota
* Situação da Disciplina
* Conselho de Classe
* Voto do Conselho
* Ocorrência
* Comunicado
* Relação Responsável/Aluno

As migrations do Entity Framework ficam no projeto `SistemaEscolar.Infrastructure`.

## Como executar localmente

### Pré-requisitos

* [.NET SDK 10](https://dotnet.microsoft.com/download)
* [Node.js](https://nodejs.org/) (recomendado LTS)
* PostgreSQL ou uma conta no [Supabase](https://supabase.com/)
* Git

### 1. Clonar o repositório

```bash
git clone https://github.com/GabrielS0306/sistema_escolar.git
cd sistema_escolar
```

### 2. Configurar o backend

Entre na pasta da API:

```bash
cd backend/SistemaEscolar.Api
```

Inicialize o User Secrets:

```bash
dotnet user-secrets init
```

Configure a conexão com o PostgreSQL:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=SEU_HOST;Database=postgres;Username=SEU_USUARIO;Password=SUA_SENHA;Port=5432"
```

Também configure as chaves utilizadas pela autenticação JWT e os demais valores sensíveis esperados pela aplicação através do User Secrets.

> Nunca coloque senhas, chaves JWT, tokens ou outras credenciais diretamente no repositório.

### 3. Instalar o Entity Framework Core CLI

Caso ainda não esteja instalado:

```bash
dotnet tool install --global dotnet-ef
```

Se já estiver instalado, pode atualizar com:

```bash
dotnet tool update --global dotnet-ef
```

### 4. Aplicar as migrations

A partir de `backend/SistemaEscolar.Api`:

```bash
dotnet ef database update --project ..\SistemaEscolar.Infrastructure --startup-project .
```

### 5. Executar a API

```bash
dotnet run
```

Durante o desenvolvimento, a API disponibiliza a documentação interativa do Scalar em:

```text
http://localhost:5155/scalar/v1
```

> A porta pode variar conforme a configuração do ambiente.

### 6. Executar o frontend

Em outro terminal, a partir da raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

O Vite exibirá no terminal o endereço local para acessar a aplicação, normalmente:

```text
http://localhost:5173
```

## API

Os endpoints são organizados por controllers e seguem o padrão:

```text
/api/[controller]
```

Entre os recursos disponíveis estão:

* Autenticação
* Usuários
* Alunos
* Professores
* Funcionários
* Coordenadores
* Responsáveis
* Anos letivos
* Turmas
* Matrículas
* Disciplinas
* Professor/Turma/Disciplina
* Avaliações
* Notas
* Frequências
* Ocorrências
* Situações disciplinares
* Conselhos de classe
* Comunicados

A documentação da API pode ser explorada pelo Scalar durante a execução em ambiente de desenvolvimento.

## Segurança

O projeto utiliza algumas medidas de segurança na API:

* Autenticação baseada em JWT Bearer
* Validação de emissor e audiência do token
* Validação de expiração do token
* Validação da chave de assinatura
* Autorização baseada em roles
* Política de fallback exigindo autenticação nas rotas não liberadas explicitamente
* Senhas armazenadas utilizando hash com BCrypt
* Credenciais de banco destinadas ao User Secrets

## Importação de notas

O sistema permite importar notas através de planilhas.

O fluxo realiza:

1. Seleção da avaliação.
2. Upload da planilha.
3. Leitura das linhas da planilha.
4. Busca do aluno através da matrícula.
5. Validação do valor da nota.
6. Registro das notas válidas.
7. Registro dos erros encontrados.
8. Atualização da situação da disciplina dos alunos processados.

Isso permite realizar lançamentos em lote sem precisar cadastrar cada nota individualmente.

## Regras acadêmicas implementadas

A situação da disciplina é atualizada automaticamente após o lançamento das notas.

Para o cálculo da média final, o sistema verifica a existência dos tipos obrigatórios de avaliação em cada bimestre:

* Comportamento
* Atividade
* Prova bimestral

Com os quatro bimestres completos, a média final é calculada e a situação pode ser definida como:

* **Aprovado:** média final maior ou igual a 6.
* **Em recuperação:** média final abaixo de 6.

Para alunos em recuperação, é possível registrar a prova final. A média considerada após a prova final é calculada pela média entre a média final anterior e a nota da prova final.

## Status do projeto

O projeto está em desenvolvimento ativo.

### Próximos passos

* [ ] Aperfeiçoar o dashboard de cada perfil
* [ ] Finalizar a área do responsável
* [ ] Implementar notificações
* [ ] Evoluir o módulo de frequência
* [ ] Refinar regras acadêmicas conforme levantamento de requisitos
* [ ] Melhorar responsividade
* [ ] Adicionar testes automatizados
* [ ] Melhorar documentação da API
* [ ] Preparar configuração para ambiente de produção

## Objetivo

O projeto tem como objetivo desenvolver uma solução complementar para a gestão escolar, permitindo centralizar informações e facilitar o acompanhamento de alunos, professores, responsáveis e equipes administrativas.

A proposta busca separar responsabilidades por perfil de usuário e fornecer uma visão mais organizada das informações acadêmicas, disciplinares e administrativas.

## Autor

Desenvolvido por **Gabriel S.**

* GitHub: [GabrielS0306](https://github.com/GabrielS0306)
