import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY, RequiredPermissionMetadata } from '@libs/http';
import { PermissionKey, PermissionKeyWildCard } from '@libs/shared';

import { ContextService } from '@apps/api/context';

import { ROLE_FARM_USER_REPOSITORY, ROLE_PERMISSION_REPOSITORY, RoleFarmUserRepositoryPort, RolePermissionRepositoryPort } from '../application';
import { ForbiddenPermissionException } from '../domain';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextService: ContextService,

    @Inject(ROLE_FARM_USER_REPOSITORY)
    private readonly farmUserRepository: RoleFarmUserRepositoryPort,
    @Inject(ROLE_PERMISSION_REPOSITORY)
    private readonly rolePermissionRepository: RolePermissionRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return true;
    }

    const metadata = this.reflector.getAllAndOverride<RequiredPermissionMetadata>(REQUIRED_PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!metadata) {
      return true;
    }

    if (!Array.isArray(metadata.permissions) || metadata.permissions.length === 0) {
      return true;
    }

    const userId = this.contextService.userId;
    const farmId = this.contextService.farmId;

    if (!farmId) {
      throw new ForbiddenPermissionException();
    }

    const role = await this.farmUserRepository.findRole(farmId, userId);

    if (!role?.id) {
      throw new ForbiddenPermissionException();
    }

    const permissions = await this.rolePermissionRepository.findKeysByRoleId(role.id);
    const allowed = this.checkPermissions(permissions, metadata.permissions, metadata.options.mode);

    if (!allowed) {
      throw new ForbiddenPermissionException();
    }

    return true;
  }

  private hasPermission(permissions: string[], requiredPermission: string): boolean {
    if (permissions.some((permission) => permission === PermissionKeyWildCard.Administrator.toString())) {
      return true;
    }
    if (permissions.includes(requiredPermission)) {
      return true;
    }

    const [permission] = requiredPermission.split('.');

    return permissions.includes(`${permission}.*` as PermissionKey);
  }

  private checkPermissions(userPermissions: string[], requiredPermissions: string[], mode: 'ANY' | 'ALL'): boolean {
    if (mode === 'ANY') {
      return requiredPermissions.some((permission) => this.hasPermission(userPermissions, permission));
    }

    return requiredPermissions.every((permission) => this.hasPermission(userPermissions, permission));
  }
}
