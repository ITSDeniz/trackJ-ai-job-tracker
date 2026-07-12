# TrackJ Roadmap

## Product Direction

TrackJ helps job seekers run a disciplined, less stressful job search. The product combines structured tracking with selective AI assistance so users can understand what is active, what needs attention, and how to improve each application.

The roadmap favors a reliable core workflow before advanced automation. The first releases should make manual tracking excellent, then add AI where it removes repetitive work without reducing user control.

## Target Users

- Active job seekers applying to multiple roles at once.
- Career changers who need structure across different job types.
- Recent graduates managing many early-career opportunities.
- Professionals who want AI help with job descriptions, resumes, cover letters, and interview preparation.

## Product Principles

- The user owns every decision.
- Tracking must be fast enough to maintain during a busy search.
- AI should reduce drafting, summarizing, and comparison work.
- The application should make next actions obvious.
- Privacy and trust are product features, not implementation details.

## MVP Scope

The MVP should support the complete manual job-tracking loop:

- User authentication.
- Job application creation and editing.
- Company information attached to applications.
- Application status tracking.
- Priority, source, compensation range, location, work mode, and notes.
- Interview and follow-up dates.
- Dashboard summary of active opportunities and overdue actions.
- Basic search, filtering, and sorting.
- Responsive React interface for desktop-first productivity with solid mobile support.
- Express API with validated request and response contracts.
- Relational database schema with migrations.

## MVP Status Model

Initial application statuses:

- `saved`: the user is interested but has not applied.
- `applied`: the user has submitted an application.
- `screening`: recruiter or initial screening is in progress.
- `interviewing`: one or more interviews are scheduled or completed.
- `offer`: an offer has been received.
- `rejected`: the opportunity ended with rejection.
- `withdrawn`: the user chose to stop pursuing the opportunity.
- `archived`: the opportunity is no longer active but should remain in history.

Statuses must be treated as product vocabulary. Changes to this list require updates to documentation, database constraints, API contracts, and UI labels.

## Phase 1: Foundation

Goals:

- Establish project documentation.
- Define clean architecture boundaries.
- Define database model and API contracts.
- Set up the client and server foundations.
- Add baseline testing, linting, formatting, and environment validation.

Exit criteria:

- Documentation exists for architecture, API, database, design system, and roadmap.
- The application can run locally.
- The project has a repeatable development workflow.
- Core architectural boundaries are visible in the folder structure.

## Phase 2: Core Job Tracking

Goals:

- Implement authentication.
- Implement CRUD for job applications.
- Implement company capture within the application flow.
- Add filtering, sorting, search, and status transitions.
- Add dashboard summaries and upcoming action reminders.

Exit criteria:

- A user can manage an end-to-end job application pipeline.
- Core flows have meaningful tests.
- API validation and error handling are consistent.
- UI states cover loading, empty, error, and success paths.

## Phase 3: Documents And Application Assets

Goals:

- Allow users to store resume and cover letter metadata.
- Associate documents with job applications.
- Track which resume or cover letter version was used for each application.
- Add notes for recruiter conversations, interview preparation, and follow-up history.

Exit criteria:

- Users can understand the full context of each application.
- Sensitive data handling is documented and implemented intentionally.
- Document-related workflows do not expose private content unnecessarily.

## Phase 4: AI Assistance

Goals:

- Summarize job descriptions.
- Extract role requirements, skills, seniority, and location constraints.
- Suggest next actions based on application state.
- Draft follow-up notes, resume bullet variants, and cover letter sections.
- Generate interview preparation prompts based on the job and company context.

Exit criteria:

- AI features are opt-in and clearly labeled.
- Users can review and edit generated content before using it.
- AI provider code is isolated behind application-defined interfaces.
- Privacy, logging, cost, latency, and failure behavior are documented.

## Phase 5: Productivity And Insights

Goals:

- Add saved views for common filters.
- Add analytics for pipeline health, response rates, and stage conversion.
- Add calendar-ready interview and follow-up reminders.
- Add import flows for job descriptions or saved postings.
- Add recurring task suggestions for stale applications.

Exit criteria:

- The product helps users decide where to spend attention.
- Insights are actionable rather than decorative.
- Automation remains reversible and user-controlled.

## Phase 6: SaaS Readiness

Goals:

- Add account settings.
- Add billing and subscription boundaries if commercialization is pursued.
- Add production observability.
- Add audit-relevant security events.
- Harden rate limiting, backup, restore, and data export behavior.

Exit criteria:

- Production operations are documented.
- User data can be exported.
- Security and privacy expectations are testable.
- The system can support real users with operational confidence.

## Out Of Scope For MVP

- Automated job application submission.
- Scraping job boards without explicit user action and legal review.
- Multi-user teams or recruiter workflows.
- Browser extension workflows.
- Native mobile applications.
- Billing and subscription management.
- Fully automated resume rewriting without user review.

## Roadmap Change Process

Roadmap changes must update this file and any affected architecture, API, database, or design-system documentation. Changes that alter the MVP scope should explain the user value, implementation risk, privacy impact, and testing expectations before implementation begins.
