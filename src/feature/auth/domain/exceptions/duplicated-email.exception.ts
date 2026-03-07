import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class DuplicatedEmailEXception extends DomainException {
  constructor() {
    super(ErrorCode.DuplicatedEmail, HttpStatus.CONFLICT, 'Duplicated email');
  }
}
