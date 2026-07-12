# TrackJ Architecture

## Architecture Goal

TrackJ uses clean architecture to keep product behavior independent from frameworks, databases, AI providers, and delivery mechanisms.

The system should be easy to test, safe to evolve, and clear about where each decision belongs.

## System Overview

TrackJ is organized around two delivery surfaces:

- React client for the authenticated user experience.
- Express server for API delivery, authentication boundaries, use case orchestration, persistence, and integrations.

The primary system of record is a relational database. AI providers, document storage, email, and other external services are treated as infrastructure adapters.

## Dependency Rule

Dependencies point inward.

Outer layers may depend on inner layers. Inner layers must not depend on outer layers.

Layer order:

1. Domain
2. Application
3. Infrastructure
4. Delivery

Delivery includes React components, Express routes, HTTP middleware, CLI scripts, background job runners, and any other entrypoint.

## Domain Layer

The domain layer contains business concepts and invariants.

Responsibilities:

- Entities.
- Value objects.
- Domain services.
- Domain errors.
- Business rules that are true regardless of UI, database, or API.

Examples:

- Job application status rules.
- Priority values.
- Work mode values.
- Determining whether an application is active or closed.
- Validating status transitions when rules become more complex.

Rules:

- No React imports.
- No Express imports.
- No database client imports.
- No AI SDK imports.
- No environment variable reads.
- No HTTP-specific behavior.

## Application Layer

The application layer coordinates use cases.

Responsibilities:

- Commands and queries.
- Use case orchestration.
- Authorization decisions that are not framework-specific.
- Transaction boundaries expressed through interfaces.
- Repository and integration ports.
- Mapping domain results into application-level results.

Examples:

- Create a job application.
- Update application status.
- List applications for a user with filters.
- Schedule an interview.
- Generate AI-assisted job description summary.

Rules:

- The application layer may depend on the domain layer.
- The application layer defines interfaces for persistence and external services.
- The application layer does not depend on Express, React, database clients, or AI SDKs.
- Use cases receive authenticated user context explicitly.

## Infrastructure Layer

The infrastructure layer implements technical details behind application-defined interfaces.

Responsibilities:

- Database repositories.
- Migration tooling integration.
- AI provider adapters.
- File storage adapters.
- Email adapters.
- Observability adapters.
- Provider-specific error mapping.

Rules:

- Infrastructure may depend on application and domain types.
- Infrastructure must not leak provider-specific objects into application or domain code.
- Provider errors must be translated into application-safe errors.
- Infrastructure code should be integration tested where behavior depends on external systems or database behavior.

## Delivery Layer

The delivery layer handles input and output.

React responsibilities:

- Render application state.
- Collect user input.
- Show loading, empty, error, and success states.
- Call API clients.
- Keep presentation logic separate from business rules.

Express responsibilities:

- Route HTTP requests.
- Authenticate requests.
- Validate params, query strings, headers, and bodies.
- Call application use cases.
- Map use case results to HTTP responses.
- Apply middleware such as rate limiting, request IDs, and error handling.

Rules:

- Express route handlers should be thin.
- React components should not contain business rules.
- Delivery code must not directly access the database.
- Delivery code must not call AI providers directly.

## Recommended Repository Structure

The project should use a structure that makes architectural boundaries visible.

```text
client/
  src/
    app/
    components/
    features/
    hooks/
    lib/
    routes/
    styles/

server/
  src/
    application/
    domain/
    infrastructure/
    delivery/
    shared/
    config/
```

Notes:

- `client/src/features` may organize UI by product area.
- `server/src/domain` owns business concepts.
- `server/src/application` owns use cases and ports.
- `server/src/infrastructure` owns adapters.
- `server/src/delivery` owns Express routes, middleware, controllers, and request/response mapping.
- `server/src/shared` should stay small and intentional.

## Data Flow

Typical API request flow:

1. Express receives a request.
2. Middleware attaches request metadata and authenticated user context.
3. Route validation parses external input.
4. The route handler calls an application use case.
5. The use case applies authorization and business rules.
6. The use case calls repository or integration interfaces.
7. Infrastructure adapters persist data or call external services.
8. The use case returns an application result.
9. Delivery maps the result to a documented API response.

React data flow:

1. A page or feature component requests data through an API client.
2. The UI renders loading, error, empty, or populated states.
3. User actions submit commands to the API.
4. The UI updates from the confirmed API result or a documented optimistic update.

## Authentication And Authorization

Authentication identifies the user. Authorization determines whether the user may access or mutate a resource.

Rules:

- Authenticated user context must be explicit in server use cases.
- All user-owned records must be scoped by `user_id`.
- API routes must not trust client-provided ownership fields.
- Repository methods should support ownership-aware queries.
- Authorization checks must happen server-side.

## Validation

Validation occurs at multiple boundaries:

- Client-side validation improves user experience.
- API request validation protects the server boundary.
- Domain validation protects business invariants.
- Database constraints protect persisted integrity.

Rules:

- Do not rely only on client-side validation.
- Request schemas should align with API documentation.
- Domain rules should not be duplicated only in route handlers.

## Error Handling

Errors should be deliberate and mapped by layer.

Categories:

- Validation errors.
- Authentication errors.
- Authorization errors.
- Not found errors.
- Conflict errors.
- Rate limit errors.
- External provider errors.
- Unexpected errors.

Rules:

- Domain and application errors should be typed or otherwise distinguishable.
- Infrastructure errors should be translated before crossing into application code.
- API responses must not expose stack traces, database internals, secrets, or raw provider payloads.
- Client UI should show actionable messages.

## AI Architecture

AI features are application use cases backed by provider adapters.

Rules:

- Use cases define what AI operation is being requested.
- Application ports define the model-agnostic contract.
- Infrastructure adapters call specific AI providers.
- Prompts that affect product behavior should be versionable.
- AI output must be treated as untrusted until validated.
- AI features must support provider failure and timeout behavior.
- Sensitive inputs must be minimized before sending to providers.

## Background Jobs

Background jobs should be introduced when work is slow, retryable, scheduled, or integration-heavy.

Likely future jobs:

- AI generation that may exceed normal request latency.
- Reminder generation.
- Document processing.
- Data export.
- Cleanup and retention tasks.

Rules:

- Jobs must be idempotent where retries are possible.
- Job payloads should contain references instead of large sensitive content.
- Job status should be observable when the user is waiting on a result.

## Configuration

Configuration should be validated at startup.

Rules:

- Read environment variables in configuration modules only.
- Do not read environment variables deep inside domain or application logic.
- Fail fast for missing required production configuration.
- Keep local development configuration documented separately from secrets.

## Testing Architecture

Testing should follow boundaries:

- Domain tests cover business rules without framework setup.
- Application tests cover use cases with mocked ports.
- Infrastructure tests cover database and provider adapters.
- Delivery tests cover API validation, response mapping, and middleware.
- UI tests cover important states and interactions.
- End-to-end tests cover stable critical flows.

## Architecture Decision Process

Architecture changes must be documented before implementation when they affect:

- Frameworks.
- Database technology.
- Authentication approach.
- AI provider strategy.
- Folder structure.
- API style.
- Background jobs.
- Deployment topology.
- Shared package boundaries.

Each decision should explain the problem, chosen approach, alternatives considered, and consequences.

## Architecture Review Checklist

Before implementing a feature:

- The use case belongs in the documented roadmap.
- The affected domain concepts are clear.
- The data model exists or is documented.
- API contracts are documented.
- UI behavior follows the design system.
- AI behavior is reviewed for privacy and user control when relevant.
- Tests are planned at the right architectural layers.
- The implementation plan has been explained before code is written.
