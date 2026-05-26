# Sigma Bet — Plataforma de Games Virtual

Plataforma web premium com moedas virtuais (demo), jogo Coinflip, carteira, histórico, perfil e painel administrativo completo.

> **Sem dinheiro real · Sem PIX · Sem saque · Sem integração financeira**

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 15, React 19, TailwindCSS 4 |
| Backend | Next.js API Routes |
| Banco | PostgreSQL + Prisma ORM |
| Auth | JWT (jose) + cookie HTTP-only + bcryptjs |

## Funcionalidades

### Usuário
- Cadastro com validação e **1.000 moedas** iniciais
- Login com redirect inteligente
- Dashboard com estatísticas, jogos e últimas apostas
- **Carteira** — saldo e histórico de transações
- **Histórico** — filtros por jogo, resultado e data
- **Perfil** — alterar nome e senha
- **Coinflip** — animação, anti double-click, resultado no backend

### Admin (`/admin/login`)
- Dashboard com métricas da plataforma
- Gestão de usuários (saldo, bloqueio, detalhes)
- Histórico de apostas e transações
- Lucro/prejuízo agregado da plataforma

## Instalação

```bash
npm install
```

PowerShell — copiar env:

```powershell
Copy-Item .env.example .env
```

### 1. Subir o PostgreSQL (obrigatório)

**Opção A — Docker (recomendado)**

Instale [Docker Desktop](https://www.docker.com/products/docker-desktop/), depois:

```bash
npm run db:up
```

Isso sobe PostgreSQL na porta `5432` com usuário `sigma` / senha `sigma123` / banco `sigma_bet`.

**Opção B — PostgreSQL instalado no Windows**

Crie o banco `sigma_bet` e ajuste `DATABASE_URL` no `.env` com seu usuário e senha.

### 2. Configurar `.env`

Use a URL compatível com o Docker (já está no `.env.example`):

```env
DATABASE_URL="postgresql://sigma:sigma123@localhost:5432/sigma_bet?schema=public"
JWT_SECRET="chave-secreta-com-minimo-32-caracteres-aleatorios"
```

### 3. Criar tabelas e admin

```bash
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

**Tudo de uma vez (com Docker):** `npm run db:setup` depois `npm run dev`

### Erro: `Can't reach database server at localhost:5432`

O PostgreSQL **não está rodando**. Faça:

1. `npm run db:up` (Docker) **ou** inicie o serviço PostgreSQL no Windows  
2. Confirme que `DATABASE_URL` no `.env` está correto  
3. `npm run db:push && npm run db:seed`  
4. Reinicie `npm run dev`

Acesse: http://localhost:3000

### Admin
- URL: http://localhost:3000/admin/login
- E-mail: `admin@sigmabet.com`
- Senha: `Admin@123456`

## Estrutura do projeto

```
src/
├── app/              # Páginas e API Routes
│   ├── api/          # REST endpoints
│   ├── dashboard/
│   ├── wallet/
│   ├── history/
│   ├── profile/
│   ├── game/coinflip/
│   └── admin/        # Painel administrativo
├── components/       # UI React
│   ├── layout/       # AppShell, Header, Sidebar
│   ├── admin/
│   ├── game/
│   └── ui/
├── services/         # Lógica de negócio
├── lib/              # Auth, validações, utils
└── types/            # TypeScript compartilhado
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build produção |
| `npm run db:seed` | Admin + jogo coinflip |
| `npm run db:studio` | GUI do banco |

## API

Documentação em [`docs/API.md`](docs/API.md).

### Novas rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/user/stats` | Estatísticas do jogador |
| PATCH | `/api/user/profile` | Atualizar nome/senha |
| GET | `/api/transactions` | Histórico da carteira |
| GET | `/api/bets?game&status&from&to` | Apostas com filtros |
| GET | `/api/admin/stats` | Métricas admin |
| GET | `/api/admin/transactions` | Transações globais |
| GET | `/api/admin/users/:id` | Detalhe do usuário |

## Segurança

- Resultado dos jogos **somente no servidor**
- Senhas com bcrypt (12 rounds)
- JWT com secret ≥ 32 caracteres
- Middleware unificado para rotas user e admin
- Usuário bloqueado não acessa APIs nem páginas
- Transações Prisma atômicas para saldo/apostas
- Validação Zod em todas as entradas

## Aviso

Moedas fictícias sem valor monetário. Plataforma demonstrativa.
