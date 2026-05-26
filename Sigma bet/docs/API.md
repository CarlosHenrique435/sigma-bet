# API — Sigma Bet

Base: `http://localhost:3000` · Auth: cookie `sigma_bet_token` ou `Authorization: Bearer <token>`

## Formato

Sucesso: `{ "success": true, "data": { ... } }`  
Erro: `{ "error": "mensagem", "code": "CODIGO" }`

---

## Auth

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/register` | — | Cadastro + saldo inicial |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/logout` | — | Logout |
| GET | `/api/auth/me` | User | Perfil (bloqueia se `isBlocked`) |

## Usuário

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/user/stats` | Apostas, vitórias, volume, lucro líquido |
| PATCH | `/api/user/profile` | `{ name?, currentPassword?, newPassword? }` |

## Carteira & Apostas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/transactions?limit=50&type=CREDIT\|DEBIT` | Histórico da carteira |
| GET | `/api/bets?game=coinflip&status=WON&from=&to=&limit=50` | Apostas com filtros |

## Jogo

| Método | Rota | Body | Descrição |
|--------|------|------|-----------|
| POST | `/api/game/coinflip` | `{ choice: "HEADS"\|"TAILS", amount: number }` | Aposta (backend sorteia) |

## Admin (role ADMIN)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/stats` | Métricas da plataforma |
| GET | `/api/admin/users` | Listar usuários |
| GET | `/api/admin/users/:id` | Detalhe + apostas + transações |
| PATCH | `/api/admin/users/:id/balance` | `{ amount, operation: "add"\|"subtract"\|"set" }` |
| PATCH | `/api/admin/users/:id/block` | `{ isBlocked: boolean }` |
| GET | `/api/admin/bets?limit=100` | Todas as apostas |
| GET | `/api/admin/transactions?limit=100` | Todas as transações |

## Códigos de erro

| Code | HTTP |
|------|------|
| UNAUTHORIZED | 401 |
| FORBIDDEN | 403 |
| USER_BLOCKED | 403 |
| VALIDATION_ERROR | 400 |
| INSUFFICIENT_BALANCE | 400 |
