import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY } from '@libs/http';
import { JwtClaims } from '@libs/shared';

import { CONTEXT_SERVICE, ContextServicePort, ContextUser } from '@apps/api/context';

import { ExpiredTokenException, InvalidTokenException } from '../domain';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextServicePort,
  ) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    this.contextService.context = context;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  override handleRequest<TUser = unknown>(e: unknown, user: TUser, info: unknown) {
    if (info instanceof TokenExpiredError) {
      throw new ExpiredTokenException();
    }

    if (e || info || !this.isJwtRequestUser(user)) {
      throw new InvalidTokenException();
    }

    this.contextService.user = ContextUser.from(user?.id, user.farmId);

    return user ?? null;
  }

  private isJwtRequestUser(user: unknown): user is JwtClaims {
    if (typeof user !== 'object' || user === null) {
      return false;
    }

    return true;
  }
}
