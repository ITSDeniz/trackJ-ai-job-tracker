# TrackJ API Documentation

## API Direction

TrackJ uses a REST-style HTTP API for communication between the React client and Express server.

The API should be predictable, typed, validated, and documented before implementation. Route handlers should remain thin and delegate product behavior to application use cases.

## Base Conventions

- Use JSON for request and response bodies.
- Use UTF-8 encoding.
- Use ISO 8601 strings for dates and timestamps.
- Use plural resource names.
- Use `kebab-case` for URL path segments.
- Use stable lowercase enum values.
- Do not expose database internals in API contracts.
- Do not trust client-provided ownership fields.

Recommended base path:

```text
/api/v1
```

Versioning starts at `v1` to allow future breaking changes without changing every route shape later.

## Authentication

Authenticated endpoints require a valid user session or bearer token, depending on the chosen authentication implementation.

Rules:

- The server determines the authenticated user.
- Clients must not send `user_id` to claim ownership.
- Unauthorized requests return `401`.
- Authenticated users accessing resources they do not own return `404` when revealing existence would leak data, or `403` when the existence is already appropriate to reveal.

## Response Envelope

Successful single-resource response:

```json
{
  "data": {}
}
```

Successful list response:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "total": 100
  }
}
```

Error response:

```json
{
  "error": {
    "code": "validation_error",
    "message": "The request contains invalid fields.",
    "fields": {
      "title": ["Title is required."]
    }
  }
}
```

Rules:

- `message` should be safe to show to users when appropriate.
- `fields` is included for field-level validation errors.
- Unexpected errors must not expose stack traces, SQL, secrets, or provider payloads.

## HTTP Status Codes

- `200 OK`: successful read or update.
- `201 Created`: successful creation.
- `204 No Content`: successful deletion with no response body.
- `400 Bad Request`: malformed request or invalid query structure.
- `401 Unauthorized`: authentication required or invalid.
- `403 Forbidden`: authenticated user lacks permission.
- `404 Not Found`: resource does not exist or is not visible to the user.
- `409 Conflict`: request conflicts with current resource state.
- `422 Unprocessable Entity`: syntactically valid request with validation errors.
- `429 Too Many Requests`: rate limit exceeded.
- `500 Internal Server Error`: unexpected server failure.
- `502 Bad Gateway`: upstream provider failure.
- `503 Service Unavailable`: temporary service unavailability.

## Pagination

List endpoints should support page-based pagination initially.

Query parameters:

- `page`: positive integer, defaults to `1`.
- `pageSize`: positive integer, defaults to `25`, maximum `100`.

Pagination response:

```json
{
  "page": 1,
  "pageSize": 25,
  "total": 100
}
```

Cursor pagination may be introduced later for high-volume or realtime-like views.

## Sorting And Filtering

Use query parameters for list filtering and sorting.

Common query parameters:

- `sort`: field name, optionally prefixed with `-` for descending order.
- `search`: text search query.
- `status`: filter by status.
- `priority`: filter by priority.
- `companyId`: filter by company.
- `nextActionBefore`: ISO 8601 timestamp.

Rules:

- Unsupported filters return validation errors.
- Sortable fields must be explicitly allowlisted.
- Search behavior must be documented per endpoint when implemented.

## Core Resource Contracts

### Job Application

Response shape:

```json
{
  "id": "jobapp_123",
  "companyId": "company_123",
  "companyName": "Example Co",
  "title": "Frontend Engineer",
  "status": "applied",
  "priority": "medium",
  "source": "LinkedIn",
  "jobPostingUrl": "https://example.com/jobs/123",
  "location": "Remote",
  "workMode": "remote",
  "employmentType": "full_time",
  "salaryMin": 120000,
  "salaryMax": 150000,
  "salaryCurrency": "USD",
  "appliedAt": "2026-07-08T09:00:00.000Z",
  "nextActionAt": "2026-07-15T09:00:00.000Z",
  "closedAt": null,
  "description": "Role description text.",
  "notes": "User notes.",
  "createdAt": "2026-07-08T09:00:00.000Z",
  "updatedAt": "2026-07-08T09:00:00.000Z"
}
```

Status values:

- `saved`
- `applied`
- `screening`
- `interviewing`
- `offer`
- `rejected`
- `withdrawn`
- `archived`

Priority values:

- `low`
- `medium`
- `high`

Work mode values:

- `remote`
- `hybrid`
- `onsite`
- `unknown`

Employment type values:

- `full_time`
- `part_time`
- `contract`
- `internship`
- `unknown`

### Company

Response shape:

```json
{
  "id": "company_123",
  "name": "Example Co",
  "website": "https://example.com",
  "industry": "Software",
  "size": "51-200",
  "location": "New York, NY",
  "notes": "Company notes.",
  "createdAt": "2026-07-08T09:00:00.000Z",
  "updatedAt": "2026-07-08T09:00:00.000Z"
}
```

### Interview

Response shape:

```json
{
  "id": "interview_123",
  "jobApplicationId": "jobapp_123",
  "title": "Technical interview",
  "interviewType": "technical",
  "scheduledAt": "2026-07-12T14:00:00.000Z",
  "durationMinutes": 60,
  "location": null,
  "meetingUrl": "https://example.com/meeting",
  "status": "scheduled",
  "notes": "Preparation notes.",
  "createdAt": "2026-07-08T09:00:00.000Z",
  "updatedAt": "2026-07-08T09:00:00.000Z"
}
```

Interview status values:

- `scheduled`
- `completed`
- `cancelled`
- `rescheduled`

### Task

Response shape:

```json
{
  "id": "task_123",
  "jobApplicationId": "jobapp_123",
  "title": "Send follow-up email",
  "description": "Follow up with recruiter after screening call.",
  "dueAt": "2026-07-15T09:00:00.000Z",
  "completedAt": null,
  "source": "user",
  "createdAt": "2026-07-08T09:00:00.000Z",
  "updatedAt": "2026-07-08T09:00:00.000Z"
}
```

Task source values:

- `user`
- `ai_suggested`
- `system`

## Initial Endpoints

### Job Applications

- `GET /api/v1/job-applications`
- `POST /api/v1/job-applications`
- `GET /api/v1/job-applications/:id`
- `PATCH /api/v1/job-applications/:id`
- `DELETE /api/v1/job-applications/:id`

List filters:

- `status`
- `priority`
- `companyId`
- `search`
- `nextActionBefore`

Sortable fields:

- `createdAt`
- `updatedAt`
- `appliedAt`
- `nextActionAt`
- `title`
- `status`
- `priority`

### Companies

- `GET /api/v1/companies`
- `POST /api/v1/companies`
- `GET /api/v1/companies/:id`
- `PATCH /api/v1/companies/:id`
- `DELETE /api/v1/companies/:id`

List filters:

- `search`

Sortable fields:

- `name`
- `createdAt`
- `updatedAt`

### Interviews

- `GET /api/v1/job-applications/:jobApplicationId/interviews`
- `POST /api/v1/job-applications/:jobApplicationId/interviews`
- `GET /api/v1/interviews/:id`
- `PATCH /api/v1/interviews/:id`
- `DELETE /api/v1/interviews/:id`

### Tasks

- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `GET /api/v1/tasks/:id`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`

List filters:

- `jobApplicationId`
- `completed`
- `dueBefore`
- `source`

## AI Endpoints

AI endpoints should be introduced only when the related use case is documented and reviewed for privacy, cost, latency, and failure behavior.

Initial AI endpoint candidates:

- `POST /api/v1/ai/job-description-summary`
- `POST /api/v1/ai/requirement-extraction`
- `POST /api/v1/ai/follow-up-draft`
- `POST /api/v1/ai/interview-prep`

Rules:

- AI endpoints must be rate limited.
- AI endpoints must validate input size.
- AI responses must identify generated content as AI-assisted.
- AI outputs must be reviewable by the user before external use.
- AI failures should preserve the user's input and return actionable errors.

## Validation Rules

Request validation must happen before use cases run.

Common rules:

- Required strings must be trimmed and non-empty.
- URLs must be valid URLs.
- Date values must be valid ISO 8601 strings.
- Enum values must match documented values.
- Numeric ranges must be internally consistent.
- Unknown fields should be rejected for write operations unless explicitly supported.

## Rate Limiting

Rate limiting is required for:

- Authentication routes.
- AI routes.
- Import routes.
- Public or unauthenticated routes.

Rate limit responses should use `429` and include a safe message. Headers may expose retry information when useful.

## Idempotency

Idempotency should be considered for:

- AI generation requests.
- Import requests.
- Payment or billing requests if introduced.
- Retried create operations that could duplicate user data.

When implemented, idempotency keys should be scoped to the authenticated user and endpoint.

## API Review Checklist

Before implementing or changing an endpoint:

- The route follows REST naming conventions.
- Request and response shapes are documented.
- Ownership and authorization behavior are clear.
- Validation errors include useful field-level detail.
- Status codes are appropriate.
- Sensitive data is not exposed unnecessarily.
- AI behavior is labeled and rate limited when relevant.
- Database and domain documentation agree with the API contract.
