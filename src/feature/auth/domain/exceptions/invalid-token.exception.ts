import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core';

export class InvalidRefreshTokenException extends DomainException {
  constructor() {
    super('INVALID_REFRESH_TOKEN', HttpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }
}
