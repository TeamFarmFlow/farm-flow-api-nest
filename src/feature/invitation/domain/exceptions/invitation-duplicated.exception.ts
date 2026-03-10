import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class InvitationDuplicatedException extends DomainException {
  constructor() {
    super(ErrorCode.InvitationDuplicated, HttpStatus.CONFLICT, 'Invitation duplicated');
  }
}
