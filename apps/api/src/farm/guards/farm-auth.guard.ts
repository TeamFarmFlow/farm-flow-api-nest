import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY, IS_SKIP_FARM_AUTH } from '@libs/http';

import { ContextService } from '@apps/api/context';

import { FARM_USER_REPOSITORY, FarmUserRepositoryPort } from '../application';
import { ForbiddenFarmUserException } from '../domain';

@Injectable()
export class FarmAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextService: ContextService,
    @Inject(FARM_USER_REPOSITORY)
    private readonly farmUserRepository: FarmUserRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return true;
    }

    const isSkipFarmAuth = this.reflector.getAllAndOverride<boolean>(IS_SKIP_FARM_AUTH, [context.getHandler(), context.getClass()]);

    if (isSkipFarmAuth) {
      return true;
    }

    const userId = this.contextService.userId;
    const farmId = this.contextService.farmId;

    if (!farmId) {
      throw new ForbiddenFarmUserException();
    }

    const hasfarmUser = await this.farmUserRepository.has(farmId, userId);

    if (!hasfarmUser) {
      throw new ForbiddenFarmUserException();
    }

    return true;
  }
}
