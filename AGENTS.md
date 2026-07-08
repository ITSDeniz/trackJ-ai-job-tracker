# TalentPilot - AI Job Tracker

## Project Vision

TalentPilot is a production-grade SaaS application that helps job seekers manage their job search with clarity, structure, and intelligent assistance.

The product should help users:

- Track job opportunities from discovery through offer or rejection.
- Organize companies, contacts, applications, interviews, documents, and follow-ups.
- Understand the state of their search through useful summaries and actionable insights.
- Use AI to reduce manual work while keeping the user in control of decisions, tone, and final content.

The application must feel trustworthy, calm, and practical. It should reduce cognitive load rather than add another dashboard for users to maintain.

## Engineering Principles

- Treat the project as a long-lived SaaS product, not a prototype.
- Prefer clear, maintainable code over clever abstractions.
- Keep business rules independent from frameworks, databases, and UI libraries.
- Make decisions explicit in documentation before implementation when they affect architecture, data modeling, or product behavior.
- Design for testability from the start.
- Avoid hidden coupling between client, server, database, and AI providers.
- Never introduce a dependency without a clear purpose and maintenance tradeoff.
- Do not implement features until an implementation plan has been explained.

## Coding Standards

- Use TypeScript for application code.
- Enable strict TypeScript settings wherever practical.
- Prefer small, focused modules with explicit exports.
- Avoid default exports for shared application code unless a framework convention requires them.
- Keep functions deterministic when possible.
- Validate all external input at system boundaries.
- Handle expected errors deliberately; do not rely on generic catch-all behavior for business flows.
- Avoid global mutable state outside framework-approved configuration and bootstrapping.
- Keep comments meaningful. Comments should explain why something exists, not restate what the code already says.
- Prefer composition over inheritance.
- Prefer domain-specific types over loose primitives for important concepts such as IDs, statuses, and workflow states.
- Do not mix formatting-only changes with behavioral changes in the same commit unless unavoidable.

## Architecture

TalentPilot follows clean architecture principles.

Dependency direction must move inward:

1. UI and delivery mechanisms depend on application use cases.
2. Application use cases depend on domain models and interfaces.
3. Infrastructure implements interfaces defined by the application or domain layers.
4. Domain logic does not depend on React, Express, database clients, AI SDKs, HTTP, environment variables, or third-party services.

Recommended high-level boundaries:

- `client`: React application, user interactions, presentation logic, client-side routing, API calls.
- `server`: Express application, API routing, authentication boundaries, request validation, use case orchestration.
- `domain`: business entities, value objects, domain services, business invariants.
- `application`: use cases, command/query handlers, ports, authorization checks that are not framework-specific.
- `infrastructure`: database repositories, external API clients, AI provider adapters, email services, storage integrations.
- `shared`: carefully selected shared types or schemas that are stable across client and server.

Rules:

- Business rules must not live in React components or Express route handlers.
- Route handlers should be thin: authenticate, validate, call a use case, map the result to HTTP.
- React components should not know database schema details.
- Infrastructure code must not leak provider-specific objects into domain or application layers.
- Shared code must remain small and intentional. Do not create a dumping ground.
- Circular dependencies are not allowed.

## Naming Conventions

- Use `PascalCase` for React components, classes, type aliases, and interfaces.
- Use `camelCase` for variables, functions, methods, object properties, hooks, and local constants.
- Use `SCREAMING_SNAKE_CASE` only for true constants that are environment-independent.
- Use `kebab-case` for route paths, file-system route segments, and URL slugs.
- Use descriptive names over abbreviations.
- Name booleans as questions or states, such as `isArchived`, `hasInterview`, `canEdit`, or `shouldNotify`.
- Name async functions by the work they perform, not by implementation details.
- Name use cases with action-oriented names, such as `CreateJobApplication`, `UpdateInterviewStage`, or `GenerateResumeTailoringSuggestions`.
- Name repository interfaces by domain concept, such as `JobApplicationRepository`.
- Name infrastructure implementations by technology or storage mechanism, such as `PostgresJobApplicationRepository`.

File naming:

- React components: `PascalCase.tsx`.
- Hooks: `useThing.ts`.
- Utilities: `thing-name.ts` or `thingName.ts`, following the local folder convention once established.
- Tests: colocate with the unit under test when practical using `.test.ts` or `.test.tsx`.
- Documentation: lowercase kebab-case Markdown files.

## React Guidelines

- Build React components as focused, composable units.
- Keep server state, client UI state, and derived state separate.
- Prefer controlled inputs for forms unless a form library provides a clearer pattern.
- Keep business decisions out of components. Components may coordinate UI behavior, but use cases define product behavior.
- Use custom hooks for reusable UI behavior, not as a place to hide business logic.
- Avoid prop drilling through many layers; introduce local composition or context only when it reduces real complexity.
- Context should be used for stable cross-cutting UI state such as authenticated user, theme, or feature flags. Do not use context as an unstructured global store.
- Components must handle loading, empty, error, and success states intentionally.
- Use optimistic UI only when rollback behavior is clear.
- Avoid unnecessary effects. Prefer derived values during render when no external synchronization is required.
- Effects must have complete dependencies and clear cleanup when needed.
- Forms must show validation feedback close to the relevant field.
- Do not rely on color alone to communicate state.
- Keep UI copy concise, direct, and human.

## Express Guidelines

- Keep Express route handlers thin and predictable.
- Register middleware deliberately and in a clear order.
- Validate request params, query strings, headers, and bodies before invoking use cases.
- Normalize API responses to a consistent shape.
- Return appropriate HTTP status codes.
- Never expose raw stack traces, database errors, provider errors, or secrets to clients.
- Centralize error handling.
- Keep authentication and authorization explicit.
- Use request-scoped context for user identity, trace IDs, and other per-request metadata.
- Do not perform long-running AI or integration work directly inside request handlers when it can exceed normal request expectations. Use background jobs when needed.
- Make endpoints idempotent where the product behavior requires safe retries.
- Add rate limiting for authentication, AI generation, import, and other abuse-prone endpoints.

## API Standards

- Use REST conventions unless a documented decision introduces another API style.
- Use nouns for resource routes, such as `/job-applications`, `/companies`, and `/contacts`.
- Use nested routes only when the child resource is meaningfully scoped by the parent.
- Use ISO 8601 strings for dates and timestamps in API responses.
- Use stable enum values for statuses.
- Version externally exposed APIs before breaking changes.
- Treat validation errors as first-class responses with field-level detail.
- Keep response contracts documented in `docs/api.md`.

## Database Guidelines

- Database schema changes must be made through migrations.
- Application code must not rely on implicit database defaults unless those defaults are documented.
- Use explicit foreign keys for relational integrity.
- Store timestamps consistently.
- Avoid soft delete by default; use it only when product, audit, or recovery requirements justify it.
- Keep personally identifiable information intentional, minimal, and protected.
- Do not store AI prompts, generated content, resumes, cover letters, or job descriptions without a documented retention reason.
- Keep database decisions documented in `docs/database.md`.

## UI Guidelines

- The application should feel focused, organized, and quietly capable.
- Prioritize task completion over decorative presentation.
- Use density appropriate for a productivity SaaS tool: compact enough for scanning, spacious enough to avoid fatigue.
- Keep navigation predictable.
- Use familiar controls for familiar tasks.
- Prefer clear tables, timelines, kanban-style workflow views, and focused detail panels where they fit the job-search domain.
- Use cards for repeated items, modals, and bounded tools. Avoid placing cards inside cards.
- Use icons to support recognition, not to replace essential labels where clarity would suffer.
- Every interactive element must have a clear affordance and state.
- Empty states should help users take the next useful action.
- Error states should explain what happened and what the user can do next.
- Avoid visual noise, excessive gradients, oversized marketing sections, and one-note color palettes.

## Accessibility

- Build to WCAG 2.2 AA expectations.
- Use semantic HTML before ARIA.
- Every form field must have an accessible label.
- Every icon-only button must have an accessible name.
- All interactive controls must be keyboard reachable.
- Focus order must match visual and logical order.
- Visible focus states are required.
- Text and meaningful UI elements must meet contrast requirements.
- Do not use color alone to communicate status or priority.
- Modals, popovers, menus, and dialogs must manage focus correctly.
- Dynamic updates that affect the user's task should be announced to assistive technology when appropriate.
- Motion should be purposeful and respect reduced-motion preferences.

## Design Philosophy

TalentPilot should feel like a calm command center for a high-stress process.

Design priorities:

- Clarity over novelty.
- Confidence over excitement.
- Useful structure over generic motivation.
- Fast scanning over decorative storytelling.
- Human language over system language.
- Trustworthy AI assistance over magical claims.

The interface should help users answer:

- What opportunities am I pursuing?
- What needs my attention now?
- What happened last?
- What should I do next?
- Where can AI safely save me time?

## AI Integration Guidelines

AI features must be assistive, transparent, and user-controlled.

Rules:

- AI must not make irreversible decisions for the user.
- AI-generated content must be presented as a draft, suggestion, summary, or recommendation unless explicitly verified by deterministic logic.
- Users must be able to review and edit generated content before using it externally.
- Do not imply that AI output is guaranteed to be accurate.
- Keep prompts and model behavior versionable where they affect product outcomes.
- Keep provider-specific code isolated behind application-defined interfaces.
- Do not leak raw provider responses into the domain layer.
- Validate and sanitize AI inputs and outputs when they cross system boundaries.
- Avoid sending unnecessary personal data to AI providers.
- Do not send resumes, cover letters, contact details, or sensitive application notes to an AI provider unless the user action requires it and the behavior is documented.
- Log AI operations carefully. Logs should support debugging without exposing sensitive user content.
- Provide graceful fallback behavior when AI services are unavailable, slow, or rate-limited.
- Track cost-sensitive AI operations explicitly.

Potential AI use cases:

- Summarizing job descriptions.
- Extracting key requirements from job postings.
- Suggesting application follow-up tasks.
- Drafting tailored resume bullets or cover letter sections.
- Comparing a user's profile against a job description.
- Generating interview preparation notes.

All AI use cases must be reviewed for privacy, user control, latency, cost, and failure behavior before implementation.

## Testing Standards

- Unit test domain logic and application use cases.
- Integration test repositories, API routes, authentication boundaries, and external service adapters.
- Component test important UI states and interactions.
- End-to-end test critical user journeys once the app has stable flows.
- Tests should describe behavior, not implementation details.
- Do not mock domain logic to test application behavior.
- Mock external providers at boundaries.
- Add regression tests for bugs when practical.
- Do not skip failing tests without documenting the reason and a follow-up plan.

## Security And Privacy

- Treat all user job-search data as sensitive.
- Use least-privilege access patterns.
- Never commit secrets.
- Read secrets from environment variables or a managed secret store.
- Validate environment configuration at startup.
- Use secure password and session handling through established libraries or providers.
- Protect authenticated routes by default.
- Enforce authorization server-side.
- Keep audit-relevant events intentional and privacy-conscious.
- Avoid logging resumes, cover letters, access tokens, raw AI prompts containing personal data, or full job descriptions when not necessary.

## Git Workflow

- Work from feature branches.
- Use the `codex/` branch prefix for Codex-created branches unless the user requests another naming convention.
- Keep commits focused and reviewable.
- Write commit messages in imperative mood, such as `Add architecture documentation`.
- Before opening a pull request, run the relevant checks for the changed area.
- Do not rewrite shared history unless explicitly instructed.
- Do not commit generated files, build artifacts, local environment files, dependency directories, or secrets.
- Keep documentation changes close to the decisions they describe.
- Pull requests should explain:
  - What changed.
  - Why it changed.
  - How it was tested.
  - Any follow-up work or known tradeoffs.

## Documentation Workflow

- Update documentation before or alongside meaningful architecture, API, data model, AI, or design decisions.
- Do not rely on undocumented conventions.
- If documentation and code conflict, stop and resolve the conflict before adding more implementation.
- Keep `docs/architecture.md`, `docs/api.md`, `docs/database.md`, `docs/design-system.md`, and `docs/roadmap.md` current as the product evolves.

## Agent Instructions

- Read this file and all files in `docs/` before making project changes.
- Do not assume architecture that is not documented.
- If documentation is missing, incomplete, or contradictory, help improve it before implementing features.
- Do not write application code unless the user explicitly asks.
- Before implementing, explain the implementation plan.
- Follow clean architecture and production-level standards.
- Preserve user changes and never revert work unless explicitly instructed.
