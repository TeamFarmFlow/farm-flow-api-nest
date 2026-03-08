import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class InvitationFarmNotFoundException extends DomainException {
  constructor() {
    super(ErrorCode.InvitationFarmNotFound, HttpStatus.NOT_FOUND, 'Invitation farm not found');
  }
}
