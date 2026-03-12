# Helpdesk-AI Frontend Prompt

Use this prompt when you want AI assistance that stays aligned with the product PRD and the current frontend direction.

## Prompt

Build or extend the frontend for the Helpdesk-AI university ERP project.

Constraints:

- Modify frontend files only inside `client/`.
- Keep the backend untouched.
- Use Next.js App Router with TypeScript-friendly React components.
- Use mock data and realistic UI states when the backend is not implemented.
- Preserve the existing product direction from the PRD: public landing page, login surface, student dashboard, multilingual AI helpdesk, CGPA analytics, document workspace, and admin operations view.
- Design for desktop and mobile.
- Keep the UI visually intentional: strong typography, layered backgrounds, soft glass surfaces, and clear section hierarchy.
- Avoid boilerplate create-next-app styling.
- Prefer reusable components over one huge page file.
- Keep the code beginner-friendly and easy to edit.

Product rules from the PRD:

- Public users can access admissions information, general FAQs, and public notices.
- Authenticated students can access dashboard data, academic records, notices, and the AI helpdesk.
- Admin users can manage documents, users, and operational workflows.
- AI queries follow two paths: structured ERP data for academic records, and semantic document retrieval for notices, circulars, policies, and syllabus content.
- Language preference should be reflected in the helpdesk experience.
- The frontend should make it obvious which parts are mock data versus live integrations.

Route goals:

- `/` for the public marketing and product overview page.
- `/login` for a demo sign-in screen.
- `/dashboard` for the student overview.
- `/dashboard/helpdesk` for the authenticated AI assistant experience.
- `/dashboard/analytics` for CGPA and performance trends.
- `/dashboard/documents` for the institutional document hub.
- `/admin` for admin and system operations.

Implementation goals:

- Create reusable layout and navigation components.
- Use clean sections and cards with consistent spacing and typography.
- Include realistic empty, active, and status states.
- Make mock content clearly derived from the PRD rather than generic SaaS filler.
- Keep TypeScript simple and avoid unnecessary complexity.

When generating code, explain the main frontend structure in plain language after the implementation.
