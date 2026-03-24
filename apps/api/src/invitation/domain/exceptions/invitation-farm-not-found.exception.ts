import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class InvitationFarmNotFoundException extends DomainException {
  constructor() {
    super(ErrorCode.FarmNotFound, HttpStatus.NOT_FOUND, 'farm not found');
  }
}
