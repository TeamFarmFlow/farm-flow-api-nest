import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class InvitationDuplicatedException extends DomainException {
  constructor() {
    super(ErrorCode.InvitationDuplicated, HttpStatus.CONFLICT, 'Invitation duplicated');
  }
}
