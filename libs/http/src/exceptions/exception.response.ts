import { HttpException, HttpStatus } from '@nestjs/common';

import { DomainException } from './domain.exception';

export class ExceptionResponse {
  readonly timestamp = new Date().toISOString();

  constructor(
    readonly errorCode: string,
    readonly statusCode: HttpStatus,
    readonly clientErrorMessage: string,
    readonly systemErrorMessage: string,
    readonly details?: unknown,
    readonly isUnknownError?: boolean,
  ) {}

  public static fromDomainException(e: DomainException) {
    return new ExceptionResponse(e.errorCode, e.statusCode, e.clientErrorMessage, e.systemErrorMessage, e.details);
  }

  public static fromHttpException(e: HttpException) {
    return new ExceptionResponse(e.name, e.getStatus(), '요청이 실패하였습니다.', e.message, undefined, true);
  }

  public static fromError(e: Error) {
    return new ExceptionResponse(
      'UNKNOWN_ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
      '서버 장애가 발생하였습니다.',
      e.message,
      {
        name: e.name,
        message: e.message,
        cause: e.cause,
      },
      true,
    );
  }

  public static fromUnknown(e: unknown) {
    return new ExceptionResponse('UNKNOWN_ERROR', HttpStatus.INTERNAL_SERVER_ERROR, '알 수 없는 오류가 발생하였습니다.', 'Unknown error', e, true);
  }
}
