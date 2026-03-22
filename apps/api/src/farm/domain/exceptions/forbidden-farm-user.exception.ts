import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class ForbiddenFarmUserException extends DomainException {
  constructor() {
    super(ErrorCode.ForbiddenPermission, HttpStatus.FORBIDDEN, 'Forbidden farm user');
  }
}
