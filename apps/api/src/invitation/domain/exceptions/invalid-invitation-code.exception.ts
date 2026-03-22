import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class InvalidInvitationCodeException extends DomainException {
  constructor() {
    super(ErrorCode.InvalidInvitationCode, HttpStatus.BAD_REQUEST, 'Invalid invitation code');
  }
}
