import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';

export class ForbiddenFarmUserException extends DomainException {
  constructor() {
    super('FORBIDDEN_FARM_USER', HttpStatus.FORBIDDEN, 'Forbidden farm user');
  }
}
