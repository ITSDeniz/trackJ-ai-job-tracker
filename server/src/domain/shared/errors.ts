export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} with ID "${id}" was not found.`);
  }
}

export class ValidationError extends DomainError {
  public fields: Record<string, string[]>;
  constructor(message: string, fields: Record<string, string[]> = {}) {
    super(message);
    this.fields = fields;
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "Unauthorized access.") {
    super(message);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "Forbidden access.") {
    super(message);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
