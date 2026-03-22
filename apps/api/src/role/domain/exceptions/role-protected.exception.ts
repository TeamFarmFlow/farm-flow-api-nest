import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class RoleProtectedException extends DomainException {
  constructor() {
    super(ErrorCode.RoleProtected, HttpStatus.FORBIDDEN, 'Role protected');
  }
}
