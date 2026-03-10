import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class RoleProtectedException extends DomainException {
  constructor() {
    super(ErrorCode.RoleProtected, HttpStatus.FORBIDDEN, 'Role protected');
  }
}
