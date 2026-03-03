import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';

export class AccessDeninedException extends DomainException {
  constructor() {
    super('ACCESS_DENINED', HttpStatus.FORBIDDEN, 'Access denined');
  }
}
