import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class RoleNotFoundException extends DomainException {
  constructor() {
    super(ErrorCode.RoleNotFound, HttpStatus.NOT_FOUND, 'Role not found');
  }
}
