# Developer Guide - Blendwit CMS

Welcome to the Blendwit CMS developer guide. This document outlines the architectural patterns, coding standards, and workflows required to maintain consistency and quality across the codebase.

## Project Structure

The project follows a monorepo-style structure separating the frontend and backend:

\`\`\`
/
├── backend/            # NestJS API Server
│   ├── prisma/         # Database Schema & Migrations
│   ├── src/            # Application Source
│   │   ├── [module]/   # Feature Modules (Controller, Service, DTOs)
│   │   └── app.module.ts
│   └── ...
├── frontend/           # Next.js 14 (App Router) Admin Dashboard
│   ├── src/
│   │   ├── app/        # App Router Pages & Layouts
│   │   ├── components/ # Reusable UI Components
│   │   ├── lib/        # Utilities (API, formatting)
│   │   └── context/    # Global State (Auth, Notifications)
│   └── ...
└── ...
\`\`\`

---

## Backend Development (NestJS)

We use **NestJS** with **Prisma ORM**.

### 1. Creating a New Feature Module
Every major feature (e.g., Projects, Blogs) should be its own module.

**Pattern:**
\`\`\`bash
nest g module [name]
nest g controller [name]
nest g service [name]
\`\`\`

### 2. Controller Pattern
Controllers should handle HTTP requests, permissions, and response formatting.

- **Guards:** Always use \`JwtAuthGuard\` and \`PermissionsGuard\`.
- **Decorators:** Use \`@RequirePermissions\` to enforce RBAC.
- **DTOs:** Create DTOs for all input validation.

**Example:**
\`\`\`typescript
@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    @RequirePermissions(Permission.PROJECTS_CREATE)
    create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.create(createProjectDto);
    }
}
\`\`\`

### 3. Service Pattern (`X.service.ts`)
Services contain the business logic and database interactions.

- **Prisma:** Inject \`PrismaService\` to access the database.
- **Notifications:** Use \`NotificationsService\` to alert admins of important actions.
- **Audit:** (Optional) Log critical changes via \`AuditLogService\`.

**Example:**
\`\`\`typescript
async create(data: CreateProjectDto) {
    const project = await this.prisma.project.create({ data });
    
    // Notify admins
    await this.notificationsService.create({
        type: 'SUCCESS',
        title: 'New Project',
        message: \`Project "\${project.title}" created.\`,
        targetRole: 'Admin'
    });
    
    return project;
}
\`\`\`

### 4. Database Changes
When modifying `schema.prisma`:
1.  Edit `backend/prisma/schema.prisma`.
2.  Run migration: `npx prisma migrate dev --name [descriptive_name]`.
3.  Update the client (auto-generated).

---

## Frontend Development (Next.js)

We use **Next.js 14** (App Router) with **Tailwind CSS**.

### 1. Page Structure
Pages are located in `src/app/(admin)/dashboard/[feature]`.
- \`page.tsx\`: List View.
- \`[id]/page.tsx\` or URL params: Edit/Detail View.

### 2. UI Components
Use standard Tailwind classes. Avoid custom CSS files unless necessary (`globals.css` is for base styles).
- **Icons:** Use `@heroicons/react/24/outline`.
- **Feedback:** Use `useNotification()` for toasts.

**Example Component:**
\`\`\`tsx
import { useNotification } from '@/context/NotificationContext';
import { apiRequest } from '@/lib/api';

export default function CreateButton() {
    const { showToast } = useNotification();
    
    const handleClick = async () => {
        try {
            await apiRequest('/projects', { method: 'POST', body: { ... } });
            showToast('Created successfully!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    return (
        <button onClick={handleClick} className="bg-blue-600 text-white px-4 py-2 rounded-xl">
            Create
        </button>
    );
}
\`\`\`

### 3. API Integration
Always use the `apiRequest` utility in `@/lib/api`. It handles:
- Base URL configuration.
- Auth headers (JWT).
- Error parsing.

**Usage:**
\`\`\`typescript
const data = await apiRequest('/endpoint', {
    method: 'POST',
    body: payload
});
\`\`\`

---

## Workflow Standards

1.  **Development**:
    -   Backend: `cd backend && npm run dev` (Port 3001)
    -   Frontend: `cd frontend && npm run dev` (Port 3000)
2.  **Linting**: Run `npm run lint` before committing.
3.  **Commits**: Use semantic commit messages (e.g., `feat: ...`, `fix: ...`).
4.  **Testing**: Verify "Local" vs "Live" behavior, especially for environment-dependent features like Analytics.

## User Permissions
- **Super Admin**: Full access.
- **Admin**: Configurable access.
- **PermissionsGuard**: Ensures feature-level access control on the Backend.
- **Frontend Checks**: Hide UI elements based on user role/permissions to improve UX (but always rely on backend validation).

---

*Last Updated: February 2026*
