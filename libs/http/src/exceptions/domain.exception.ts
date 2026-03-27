export class DomainException extends Error {
  clientErrorMessage: string;
  systemErrorMessage: string;
  errorCode: string;
  statusCode: number;
  details?: unknown;

  constructor(errorCode: string, statusCode: number, clientErrorMessage: string, systemErrorMessage: string, details?: unknown) {
    super();

    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.details = details;
  }
}
