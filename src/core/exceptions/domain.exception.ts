export class DomainException extends Error {
  errorCode: string;
  statusCode: number;
  details?: unknown;

  constructor(errorCode: string, statusCode: number, message?: string, details?: unknown) {
    super(message);

    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.details = details;
  }
}
