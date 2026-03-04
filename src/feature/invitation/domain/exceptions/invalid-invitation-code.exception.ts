import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';

export class InvalidInvitationCodeException extends DomainException {
  constructor() {
    super('INVALID_INVITATION_CODE', HttpStatus.BAD_REQUEST, 'Invalid invitation code');
  }
}
