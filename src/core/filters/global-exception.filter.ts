import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

import { Response } from 'express';

import { DomainException, ExceptionResponse } from '../exceptions';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(e: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let exception: ExceptionResponse;

    switch (true) {
      case e instanceof DomainException:
        exception = ExceptionResponse.fromDomainException(e);
        break;

      case e instanceof HttpException:
        exception = ExceptionResponse.fromHttpException(e);
        break;

      case e instanceof Error:
        exception = ExceptionResponse.fromError(e);
        this.logger.error(e);
        break;

      default:
        exception = ExceptionResponse.fromUnknown(e);
        this.logger.error(e);
    }

    res.status(exception.statusCode).json(exception);
  }
}
