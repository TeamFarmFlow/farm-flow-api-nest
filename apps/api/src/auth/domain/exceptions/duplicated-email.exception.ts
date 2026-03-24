import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class DuplicatedEmailEXception extends DomainException {
  constructor() {
    super(ErrorCode.DuplicatedEmail, HttpStatus.CONFLICT, 'Duplicated email');
  }
}
