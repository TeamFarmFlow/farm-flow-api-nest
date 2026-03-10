import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class MemberRoleNotFoundException extends DomainException {
  constructor() {
    super(ErrorCode.RoleNotFound, HttpStatus.NOT_FOUND, 'Role not found');
  }
}
