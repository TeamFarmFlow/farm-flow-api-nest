import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY } from '@libs/http';
import { JwtClaims } from '@libs/shared';

import { ContextService } from '@apps/api/context';

import { ExpiredTokenException, InvalidTokenException } from '../domain';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextService: ContextService,
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

    this.contextService.userId = user?.id;
    this.contextService.farmId = user?.farmId ?? '';

    return user ?? null;
  }

  private isJwtRequestUser(user: unknown): user is JwtClaims {
    if (typeof user !== 'object' || user === null) {
      return false;
    }

    return true;
  }
}
