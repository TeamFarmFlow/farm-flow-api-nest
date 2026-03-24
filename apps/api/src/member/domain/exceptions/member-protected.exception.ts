import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class MemberProtectedException extends DomainException {
  constructor() {
    super(ErrorCode.MemberProtected, HttpStatus.FORBIDDEN, 'Member protected');
  }
}
