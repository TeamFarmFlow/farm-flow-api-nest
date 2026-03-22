import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class InvalidInvitationCodeException extends DomainException {
  constructor() {
    super(ErrorCode.InvalidInvitationCode, HttpStatus.BAD_REQUEST, 'Invalid invitation code');
  }
}
