import { HttpStatus } from '@nestjs/common';

import { DomainException } from '@libs/http';
import { ErrorCode } from '@libs/shared';

export class InvitationDuplicatedException extends DomainException {
  constructor() {
    super(ErrorCode.InvitationDuplicated, HttpStatus.CONFLICT, '이미 초대된 멤버입니다.', 'Invitation duplicated');
  }
}
