import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ContextService } from '@app/core/context';
import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY, RequiredPermissionMetadata } from '@app/core/security';
import { FarmUserRepository, RolePermissionRepository } from '@app/infra/persistence/typeorm';
import { PermissionKey, PermissionKeyWildCard } from '@app/shared/domain';
import { AuthPrincipal } from '@app/shared/security';

import { AccessDeninedException } from '../domain';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextService: ContextService<AuthPrincipal>,
    private readonly farmUserRepository: FarmUserRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
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

    const userId = this.contextService.user.id;
    const farmId = this.contextService.user.farmId;

    if (!farmId) {
      throw new AccessDeninedException();
    }

    const farmUser = await this.farmUserRepository.findWithRole(farmId, userId);

    if (!farmUser?.role?.id) {
      throw new AccessDeninedException();
    }

    const permissions = await this.rolePermissionRepository.findKeysByRoleId(farmUser.role.id);
    const userPermissions = permissions.map(({ key }) => key);

    const allowed = this.checkPermissions(userPermissions, metadata.permissions, metadata.options.mode);

    if (!allowed) {
      throw new AccessDeninedException();
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
