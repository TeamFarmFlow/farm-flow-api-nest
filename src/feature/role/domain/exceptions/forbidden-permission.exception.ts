import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';

export class ForbiddenPermissionException extends DomainException {
  constructor() {
    super('FORBIDDEN_PERMISSION', HttpStatus.FORBIDDEN, 'Forbidden permission');
  }
}
