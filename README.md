# Blendwit CMS - Enterprise Content Management System

Blendwit CMS is a modern, modular Content Management System built with a microservices architecture. It features a robust NestJS backend and a high-performance Next.js frontend, designed for scalability and visual excellence.

## Project Structure

This repository is organized as a monorepo with the following components:

-   **`backend/`**: A NestJS application providing a secure REST API.
    -   **Database**: PostgreSQL managed via Prisma ORM.
    -   **Authentication**: JWT-based authentication with role-based access control (RBAC).
    -   **Settings**: Dynamic CMS branding and configuration stored in the database.
-   **`frontend/`**: A Next.js application using React 19 and Tailwind CSS.
    -   **Branding**: Fetches CMS title, subtitle, and avatar dynamically from the backend.
    -   **Dashboard**: Admin interface for content and settings management.

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | NestJS, Prisma, PostgreSQL, JWT, Passport |
| **Frontend** | Next.js 16 (Turbopack), React 19, Tailwind CSS 4, Heroicons |
| **Infrastructure**| Docker, Docker Compose |

## Getting Started

To get the project up and running on your local machine, please follow the detailed instructions in the [SETUP.md](./SETUP.md) file.

## Quick Start

```bash
# 1. First time setup (Installs, Envs, DB, Seed)
npm run setup

# 2. Select environment to run (Dev, Prod, Test)
npm run start
```

## Available Scripts

- `npm run setup`: Fully automated setup (Manual or Docker).
- `npm run reset`: Wipe all local data and reset DB.
- `npm run start`: Interactive start manager.
- `npm run db:init`: Run database migrations.
- `npm run db:seed`: Seed the database.
- `npm run dev`: Start development environment.
- `npm run build`: Build both frontend and backend for production.

## Development

The project uses `concurrently` to run both the frontend and backend development servers with a single command:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Database (via Docker)**: `localhost:5432`
- **pgAdmin**: [http://localhost:5050](http://localhost:5050)

## License

Private / Licensed - See individual subdirectories for details.
