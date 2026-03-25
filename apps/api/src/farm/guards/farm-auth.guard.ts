import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY, IS_SKIP_FARM_AUTH } from '@libs/http';

import { CONTEXT_SERVICE, ContextServicePort } from '@apps/api/context';

import { FARM_USER_REPOSITORY, FarmUserRepositoryPort } from '../application';
import { ForbiddenFarmUserException } from '../domain';

@Injectable()
export class FarmAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextServicePort,
    @Inject(FARM_USER_REPOSITORY)
    private readonly farmUserRepository: FarmUserRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.contextService.context = context;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return true;
    }

    const isSkipFarmAuth = this.reflector.getAllAndOverride<boolean>(IS_SKIP_FARM_AUTH, [context.getHandler(), context.getClass()]);

    if (isSkipFarmAuth) {
      return true;
    }

    const contextUser = this.contextService.user;

    if (!contextUser.farmId) {
      throw new ForbiddenFarmUserException();
    }

    const hasfarmUser = await this.farmUserRepository.has(contextUser.farmId, contextUser.userId);

    if (!hasfarmUser) {
      throw new ForbiddenFarmUserException();
    }

    return true;
  }
}
