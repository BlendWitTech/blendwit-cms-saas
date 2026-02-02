# Base CMS: Features & Roadmap

This document serves as the master list for the Blendwit Base CMS project, providing a reusable foundation for client projects.

## Core Features (Phase 1)
These are the essential building blocks included in every installation.

### 1. User Management & Authentication
*   **RBAC (Role-Based Access Control):** Super Admin, Admin, Editor, Author, Contributor.
*   **Security:** Email/Password (bcrypt), 2FA, Session Management, Account Lockout.
*   **Profiles:** Custom bios, photos, activity logs, and preferences.

### 2. Content Management
*   **Page Builder:** Drag-and-drop system with pre-built blocks.
*   **Rich Text Editor:** Support for formatting, embeds, and HTML/CSS editing.
*   **Workflow:** Drafts, scheduling, version history, and approval cycles.
*   **SEO:** Built-in meta fields, OG tags, and auto-slug generation.

### 3. Media & Assets
*   **Centralized Library:** Drag-and-drop uploads, folder organization.
*   **Optimization:** Automatic compression, responsive image generation.
*   **Cloud Integration:** Support for AWS S3, Cloudflare R2, and CDN delivery.

### 4. Navigation & Forms
*   **Menu Builder:** Multi-level nested menus with drag-and-drop management.
*   **Form Builder:** Conditional logic, multiple field types, and spam protection (reCAPTCHA).
*   **Integrations:** Submissions storage (CSV/Excel) and email marketing hooks.

### 5. SEO & Analytics
*   **SEO Tools:** XML Sitemap, Robots.txt editor, 301 Redirects, Schema markup (JSON-LD).
*   **Analytics:** GA4, Facebook Pixel, and Search Console integration.

---

## Optional Modules (Phases 2 & 3)
Can be toggled per client requirements.

### 6. E-commerce Module
*   Product variants, inventory tracking, shopping cart, and coupon system.
*   Payment Gateways: Stripe, PayPal, Square.

### 7. Global & Advanced Tools
*   **Multi-language:** Translation management, RTL support, and localized URLs.
*   **Portfolio:** Filterable project grids, testimonials, and video galleries.
*   **Events:** Recurring event support, calendar views, and registration/ticketing.
*   **Membership:** Tiered subscriptions and recurring billing.

---

## Development Roadmap (12-Month Plan)

### Phase 1: Foundation (Months 1-3)
*   **Month 1:** Project setup, CI/CD, and core auth system.
*   **Month 2:** User management interface and RBAC implementation.
*   **Month 3:** Page creation engine and basic SEO fields.

### Phase 2: Enhanced Content & Media (Months 4-6)
*   **Month 4:** Cloud-integrated media library and image processing.
*   **Month 5:** Blog system, categories, and scheduling.
*   **Month 6:** Drag-and-drop menu builder and form management tools.

### Phase 3: Advanced Modules (Months 7-9)
*   **Month 7:** E-commerce core (Products, Cart, Stripe).
*   **Month 8:** Multi-language engine and Portfolio module.
*   **Month 9:** Events management and Membership/Subscription logic.

### Phase 4: Polish & Launch (Months 10-12)
*   **Month 10:** Performance optimization, caching strategy, and security hardening.
*   **Month 11:** Documentation, API guides, and end-to-end testing.
*   **Month 12:** First client launch and handover.

---

## Technical Stack
*   **Backend:** Node.js (NestJS) / TypeScript / PostgreSQL (Prisma).
*   **Frontend:** React (Next.js) / Tailwind CSS / Shadcn UI.
*   **Infrastructure:** Redis (Caching), Docker, AWS/Vercel.
