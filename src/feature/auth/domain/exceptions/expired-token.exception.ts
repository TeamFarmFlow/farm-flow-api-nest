import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core';

export class ExpiredTokenException extends DomainException {
  constructor() {
    super('EXPIRED_ACCESS_TOKEN', HttpStatus.UNAUTHORIZED, 'Expired token');
  }
}
