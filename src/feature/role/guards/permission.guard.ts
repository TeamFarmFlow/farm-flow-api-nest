import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ContextService } from '@app/core/context';
import { IS_PUBLIC_KEY, REQUIRED_PERMISSIONS_KEY, RequiredPermissionMetadata } from '@app/core/security';
import { FarmUserRepository, RolePermissionRepository } from '@app/infra/persistence/typeorm';
import { PermissionKey } from '@app/shared/domain';
import { AuthPrincipal } from '@app/shared/security';

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

    if (!Array.isArray(metadata.permissions) || metadata.permissions.length === 0) {
      return true;
    }

    const userId = this.contextService.user.id;
    const farmId = this.contextService.user.farmId;

    if (!farmId) {
      throw new Error('permission denined');
    }

    const farmUser = await this.farmUserRepository.findWithRole(farmId, userId);

    if (!farmUser?.role?.id) {
      throw new Error('permission denined');
    }

    const permissions = await this.rolePermissionRepository.findKeysByRoleId(farmUser.role.id);
    const userPermissions = permissions.map(({ key }) => key);

    const allowed = this.checkPermissions(userPermissions, metadata.permissions, metadata.options.mode);

    if (!allowed) {
      throw new Error('permission denied');
    }

    return true;
  }

  private hasPermission(permissions: PermissionKey[], requiredPermission: PermissionKey): boolean {
    if (permissions.some((permission) => permission === PermissionKey.Administrator)) {
      return true;
    }
    if (permissions.includes(requiredPermission)) {
      return true;
    }

    const [permission] = requiredPermission.split('.');

    return permissions.includes(`${permission}.*` as PermissionKey);
  }

  private checkPermissions(userPermissions: PermissionKey[], requiredPermissions: PermissionKey[], mode: 'ANY' | 'ALL'): boolean {
    if (mode === 'ANY') {
      return requiredPermissions.some((permission) => this.hasPermission(userPermissions, permission));
    }

    return requiredPermissions.every((permission) => this.hasPermission(userPermissions, permission));
  }
}
