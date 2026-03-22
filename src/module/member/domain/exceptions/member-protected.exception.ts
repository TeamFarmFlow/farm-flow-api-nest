import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@app/core/exceptions';
import { ErrorCode } from '@app/shared/domain';

export class MemberProtectedException extends DomainException {
  constructor() {
    super(ErrorCode.MemberProtected, HttpStatus.FORBIDDEN, 'Member protected');
  }
}
