# RealTimeExcelidraw

A real-time collaborative whiteboard inspired by Excalidraw. Multiple users can join the same room and collaborate on a shared canvas with changes synchronized instantly through WebSockets.

## ✨ Features

- 🎨 Collaborative drawing canvas
- 👥 Room-based collaboration
- ⚡ Real-time canvas synchronization with WebSockets
- 🔐 JWT-based authentication
- 🔒 Password hashing with bcrypt
- 🌐 REST APIs with Express.js
- 🗄️ PostgreSQL database with Prisma ORM
- 📦 Turborepo monorepo architecture
- 🧩 Shared packages for UI, database, common types, and backend utilities
- 🛡️ TypeScript across the application stack

## 🛠️ Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios
- Lucide React

### Backend

- Node.js
- Express.js
- TypeScript
- JWT (`jsonwebtoken`)
- bcrypt
- CORS
- dotenv

### Real-Time Layer

- WebSocket
- `ws`
- Dedicated WebSocket server

### Database

- PostgreSQL
- Prisma ORM
- Prisma Client
- `pg` / node-postgres
- `@prisma/adapter-pg`

### Tooling & Architecture

- Turborepo
- pnpm
- ESLint
- Prettier

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │   Next.js Frontend   │
                         │ React + Tailwind CSS │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
               HTTP / REST                     WebSocket
                    │                               │
                    ▼                               ▼
          ┌──────────────────┐             ┌──────────────────┐
          │  Express Server  │             │   WS Server      │
          │ JWT + bcrypt     │             │ Real-time sync   │
          └────────┬─────────┘             └────────┬─────────┘
                   │                                │
                   └──────────────┬─────────────────┘
                                  ▼
                         ┌──────────────────┐
                         │   PostgreSQL     │
                         │     Prisma       │
                         └──────────────────┘

                     Turborepo + pnpm

```
###📁 Project Structure
```text
RealTimeExcelidraw/
├── apps/
│   ├── excelidraw-frontend/   # Main Next.js application
│   ├── http-backend/           # Express REST API & authentication
│   ├── wsserver/               # WebSocket real-time server
│   └── web/                    # Additional Next.js application
│
└── packages/
    ├── db/                     # Prisma + PostgreSQL
    ├── ui/                     # Shared React UI components
    ├── common/                 # Shared application code/types
    ├── backend-common/         # Shared backend utilities
    └── typescript-config/      # Shared TypeScript configuration

```
##1. Clone the repository
git clone https://github.com/Rav1Chauhan/RealTimeExcelidraw.git

cd RealTimeExcelidraw

##2. Install dependencies
pnpm install

##3. Configure Environment Variables
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret"
##4. Generate Prisma Client
pnpm --filter @repo/db build
##5. Start the Development Environment
pnpm dev
