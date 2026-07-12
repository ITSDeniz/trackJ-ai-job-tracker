# TrackJ Database Design

## Database Direction

TrackJ should use a relational database as the primary system of record. The product has structured entities, ownership rules, status transitions, timestamps, and reporting needs that fit relational modeling well.

Database decisions must support:

- User-owned job-search data.
- Reliable application tracking.
- Auditable status and note history where useful.
- Privacy-conscious storage of sensitive career information.
- Clear migration and rollback behavior.

## Modeling Principles

- Prefer explicit tables and relationships over unstructured blobs.
- Use foreign keys for ownership and referential integrity.
- Keep user data tenant-scoped through `user_id` on user-owned records.
- Store timestamps consistently with timezone-aware values.
- Use stable enum values for product statuses.
- Avoid storing derived data unless it improves performance or preserves historical meaning.
- Do not store sensitive AI payloads unless the product explicitly needs retention.
- Keep database constraints aligned with API validation and domain rules.

## Core Entities

### Users

Represents an authenticated product user.

Expected fields:

- `id`
- `email`
- `name`
- `created_at`
- `updated_at`

Rules:

- Email must be unique.
- Authentication implementation may add provider-specific identity fields in a separate table if needed.
- User records own job applications, companies, contacts, documents, notes, and AI operation history.

### Companies

Represents an organization associated with one or more job applications.

Expected fields:

- `id`
- `user_id`
- `name`
- `website`
- `industry`
- `size`
- `location`
- `notes`
- `created_at`
- `updated_at`

Rules:

- Company names are not globally unique because different users own separate workspaces.
- A user may track multiple applications for the same company.
- Company deletion must be restricted or converted into archive behavior when applications reference it.

### Job Applications

Represents a role the user is tracking.

Expected fields:

- `id`
- `user_id`
- `company_id`
- `title`
- `status`
- `priority`
- `source`
- `job_posting_url`
- `location`
- `work_mode`
- `employment_type`
- `salary_min`
- `salary_max`
- `salary_currency`
- `applied_at`
- `next_action_at`
- `closed_at`
- `description`
- `notes`
- `created_at`
- `updated_at`

Rules:

- `status` must use documented values from `docs/roadmap.md`.
- `priority` should use stable values such as `low`, `medium`, and `high`.
- `work_mode` should use stable values such as `remote`, `hybrid`, `onsite`, and `unknown`.
- `employment_type` should use stable values such as `full_time`, `part_time`, `contract`, `internship`, and `unknown`.
- Salary range fields must use a consistent currency field.
- `closed_at` should be set when the opportunity reaches a terminal status.
- Job descriptions may contain sensitive or copyrighted text; retention must be intentional and user-visible.

### Contacts

Represents recruiters, hiring managers, referrals, or other people connected to a company or application.

Expected fields:

- `id`
- `user_id`
- `company_id`
- `name`
- `role`
- `email`
- `phone`
- `linkedin_url`
- `notes`
- `created_at`
- `updated_at`

Rules:

- Contact data is personal information and must be handled carefully.
- Contacts may be associated with applications through a join table if direct application-level relationships are needed.

### Interviews

Represents scheduled or completed interview events.

Expected fields:

- `id`
- `user_id`
- `job_application_id`
- `title`
- `interview_type`
- `scheduled_at`
- `duration_minutes`
- `location`
- `meeting_url`
- `status`
- `notes`
- `created_at`
- `updated_at`

Rules:

- Interview status should use stable values such as `scheduled`, `completed`, `cancelled`, and `rescheduled`.
- Interview notes may contain sensitive personal impressions and should not be sent to AI providers unless the user explicitly requests an AI feature that needs them.

### Tasks

Represents user action items such as follow-ups, document updates, or interview preparation.

Expected fields:

- `id`
- `user_id`
- `job_application_id`
- `title`
- `description`
- `due_at`
- `completed_at`
- `source`
- `created_at`
- `updated_at`

Rules:

- Task source should distinguish user-created tasks from AI-suggested tasks.
- AI-suggested tasks must remain editable and dismissible.

### Documents

Represents user-managed resume, cover letter, portfolio, or other application assets.

Expected fields:

- `id`
- `user_id`
- `name`
- `document_type`
- `storage_key`
- `mime_type`
- `version_label`
- `created_at`
- `updated_at`

Rules:

- File storage details must remain infrastructure-specific.
- Database records should store metadata and storage references, not file bytes.
- Document content is sensitive and should not be logged.

### Application Documents

Represents which documents were used for a specific application.

Expected fields:

- `id`
- `job_application_id`
- `document_id`
- `purpose`
- `created_at`

Rules:

- Use this table to preserve historical context for each application.
- `purpose` should use stable values such as `resume`, `cover_letter`, `portfolio`, and `other`.

### Notes

Represents flexible user notes attached to applications, companies, contacts, or interviews.

Expected fields:

- `id`
- `user_id`
- `entity_type`
- `entity_id`
- `body`
- `created_at`
- `updated_at`

Rules:

- Notes are user-authored and sensitive.
- Polymorphic note relationships must be validated at the application layer if the database cannot enforce every referenced entity.

### AI Operations

Represents metadata for AI-assisted actions.

Expected fields:

- `id`
- `user_id`
- `job_application_id`
- `operation_type`
- `provider`
- `model`
- `status`
- `input_reference`
- `output_reference`
- `cost_units`
- `error_code`
- `created_at`
- `completed_at`

Rules:

- Store metadata needed for debugging, cost tracking, and user transparency.
- Avoid storing raw prompts or raw generated text unless retention is explicitly required by the feature.
- If content retention is required, use separate records with clear ownership, deletion, and privacy rules.

## Relationships

- One user has many companies.
- One user has many job applications.
- One company has many job applications.
- One job application has many interviews.
- One job application has many tasks.
- One user has many documents.
- One job application may reference many documents through application documents.
- One user has many notes.
- One user has many AI operations.

All user-owned queries must enforce ownership. Joining through related records is not a substitute for explicit authorization checks in application code.

## Status Values

Job application status values:

- `saved`
- `applied`
- `screening`
- `interviewing`
- `offer`
- `rejected`
- `withdrawn`
- `archived`

Terminal statuses:

- `offer`
- `rejected`
- `withdrawn`
- `archived`

Moving into a terminal status should set `closed_at` when the application layer can determine the transition.

## Migration Standards

- Every schema change must use a migration.
- Migrations must be committed with the code that depends on them.
- Migrations must be deterministic and reviewable.
- Destructive migrations require an explicit data retention and rollback plan.
- Backfills should be separated from schema changes when they are large or risky.
- Database defaults must be documented when application behavior depends on them.

## Indexing Strategy

Initial indexes should support:

- User-owned application lists.
- Filtering applications by status.
- Sorting applications by `updated_at`, `created_at`, `applied_at`, and `next_action_at`.
- Looking up companies by user and name.
- Looking up interviews and tasks by user, application, and due date.

Indexes must be added based on expected query patterns, not speculation. Performance-sensitive query changes should include an indexing review.

## Privacy And Retention

TrackJ stores sensitive career data. The database design must minimize unnecessary retention.

Rules:

- Store only what the product needs.
- Do not log sensitive fields.
- Support user data export before production launch.
- Support account deletion and data deletion before production launch.
- Avoid sending stored personal data to external services without explicit user action.
- Treat job descriptions, resumes, cover letters, notes, contacts, and AI inputs as sensitive.

## Deletion And Archival

- Hard deletion is acceptable for records that have no audit or recovery requirement.
- Archival is appropriate for job applications the user wants to keep in history.
- User account deletion must remove or anonymize user-owned data according to the documented retention policy.
- Deleting a company with applications should be restricted or require reassignment/archive behavior.
- Deleting documents should preserve application history only when the user explicitly wants metadata retained.

## Database Review Checklist

Before implementing or changing schema:

- The entity belongs in the database.
- Ownership is explicit.
- Relationships are enforced where possible.
- Sensitive data handling is documented.
- API contracts and domain rules agree with the schema.
- Migrations are reversible or have a documented rollback path.
- Indexes match real query patterns.
- Tests cover important constraints and repository behavior.
