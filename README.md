# 🎵 FyMusic

Um clone do Spotify full-stack, desenvolvido como projeto de portfólio.

🔗 **Demo ao vivo:** [fy-music-web.vercel.app](https://fy-music-web.vercel.app)

> ⏳ O backend roda no plano gratuito do Railway e pode "dormir" após inatividade — a primeira carga pode levar alguns segundos.

---

## ✨ Funcionalidades

- 🔐 **Autenticação completa** — cadastro e login com senha criptografada (bcrypt), tokens JWT (access + refresh em cookie httpOnly) e **sessão persistente** (continua logado após recarregar).
- 🏠 **Home** com álbuns reais (dados da Deezer API).
- 🔍 **Busca** de músicas com debounce.
- 🎧 **Player de áudio funcional** — tocar/pausar, barra de progresso com seek, controle de volume.
- ❤️ **Favoritos** — curtir/descurtir faixas, salvas no banco por usuário, com página "Músicas Curtidas".
- 📱 **Mobile-first** e responsivo, com visual inspirado no Spotify.

## 🛠️ Tecnologias

**Frontend**
- Next.js (App Router) + React + TypeScript
- Tailwind CSS · Zustand (estado) · TanStack Query (dados)

**Backend**
- Express + TypeScript
- Prisma ORM + PostgreSQL
- JWT · bcrypt · Zod (validação)

**Infra**
- Monorepo com npm workspaces
- Deploy: Vercel (web) · Railway (API + Postgres)
- Catálogo musical: Deezer API (metadados, capas e previews de 30s)

## 🏗️ Estrutura (monorepo)

```
.
├── apps/
│   ├── web/    # Frontend Next.js
│   └── api/    # Backend Express + Prisma
└── packages/   # (código compartilhado)
```

## 🚀 Rodando localmente

**Pré-requisitos:** Node 18+, Docker (para o Postgres).

```bash
# 1. Instalar dependências (a partir da raiz)
npm install

# 2. Subir o banco PostgreSQL
docker compose up -d

# 3. Configurar variáveis de ambiente
cp apps/api/.env.example apps/api/.env
# preencha os segredos JWT no apps/api/.env

# 4. Rodar as migrations
npm run prisma:migrate --workspace=@fymusic/api

# 5. Subir a API (terminal 1) e o frontend (terminal 2)
npm run dev --workspace=@fymusic/api
npm run dev --workspace=web
```

Acesse **http://localhost:3000**.

## 📝 Notas

- A integração de músicas usa a **Deezer API** (pública). Originalmente o projeto usaria a Spotify API, mas ela restringiu o acesso de apps novos em 2024/2025 — a Deezer oferece metadados e previews de áudio que realmente tocam.
- O player toca os **previews de 30 segundos** fornecidos pela Deezer.