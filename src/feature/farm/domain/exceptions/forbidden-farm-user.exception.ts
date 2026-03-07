import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class ForbiddenFarmUserException extends DomainException {
  constructor() {
    super(ErrorCode.ForbiddenFarmUser, HttpStatus.FORBIDDEN, 'Forbidden farm user');
  }
}
