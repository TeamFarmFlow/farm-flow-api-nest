import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';

import { type Response } from 'express';
import { catchError, Observable, throwError } from 'rxjs';

import { COOKIE_SERVICE, CookieServicePort } from '@app/core/cookies';

import { InvalidTokenException } from '../../domain';

@Injectable()
export class ClearAuthSessionOnInvalidTokenInterceptor implements NestInterceptor {
  constructor(
    @Inject(COOKIE_SERVICE)
    private readonly cookieService: CookieServicePort,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      catchError((error: unknown) => {
        if (error instanceof InvalidTokenException) {
          this.cookieService.clearAuthSession(response);
        }

        return throwError(() => error);
      }),
    );
  }
}
