import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class DuplicatedInvitationException extends DomainException {
  constructor() {
    super(ErrorCode.DuplicatedInvitation, HttpStatus.CONFLICT, 'Duplicated invitation');
  }
}
