import { HttpException, HttpStatus } from '@nestjs/common';

import { DomainException } from './domain.exception';

export class ExceptionResponse {
  readonly timestamp = new Date().toISOString();

  constructor(
    readonly errorCode: string,
    readonly statusCode: HttpStatus,
    readonly message: string,
    readonly details?: unknown,
  ) {}

  public static fromDomainException(e: DomainException) {
    return new ExceptionResponse(e.errorCode, e.statusCode, e.message, e.details);
  }

  public static fromHttpException(e: HttpException) {
    return new ExceptionResponse(e.name, e.getStatus(), e.message);
  }

  public static fromError(e: Error) {
    return new ExceptionResponse('UNKNOWN_ERROR', HttpStatus.INTERNAL_SERVER_ERROR, e.message, {
      name: e.name,
      message: e.message,
      cause: e.cause,
    });
  }

  public static fromUnknown(e: unknown) {
    return new ExceptionResponse('UNKNOWN_ERROR', HttpStatus.INTERNAL_SERVER_ERROR, 'Unknown error', e);
  }
}
